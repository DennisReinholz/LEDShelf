const { SecretClient } = require("@azure/keyvault-secrets");
const { ClientSecretCredential } = require("@azure/identity");

let apiKey;
let apiToken;

(async() => {

  const token = "TRELLO-TOKEN";
  const key = "TRELLO-API-KEY";
  const keyVaultUrl = "https://kvledshelf.vault.azure.net/";

  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    console.error("Fehlende Umgebungsvariablen: AZURE_TENANT_ID, AZURE_CLIENT_ID oder AZURE_CLIENT_SECRET");
  }

  try {
    // Authentifizierung mit ClientSecretCredential
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const client = new SecretClient(keyVaultUrl, credential);

    // Abrufen der Secrets
    const secretToken = await client.getSecret(token);
    const secretKey = await client.getSecret(key);

    apiKey = secretKey.value;
    apiToken = secretToken.value;

  } catch (error) {
    console.error("Fehler beim Abrufen des Secrets:", error.message);
  } 
})();

module.exports.getLabels = async (req, res, sysdb) => {
  let customerBoardId;
  try {
    const result = await new Promise((resolve, reject) => {
      sysdb.all(`SELECT * FROM trello`, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
    customerBoardId = result[0].customerBoard;
   
    const response = await fetch(
      `https://api.trello.com/1/boards/${customerBoardId}/labels?key=${apiKey}&token=${apiToken}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Trello API error: ${response.statusText}`);
    }

    const labels = await response.json();
    res.status(200).json(labels);
  } catch (error) {
    console.error("Error fetching labels:", error);
    res.status(500).json({ serverStatus: -2 });
  }
};
module.exports.createCard = async (req, res, sysdb) => {
  const { name, email, reference, reason, description } = req.body;

  let customerRequestListId;

  try {
    const result = await new Promise((resolve, reject) => {
      sysdb.all(`SELECT * FROM trello`, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });

    customerRequestListId = result[0].customerRequestList;

    const url = `https://api.trello.com/1/cards?key=${apiKey}&token=${apiToken}`;

    const body = {
      idList: customerRequestListId,
      idLabels: reason,
      name: reference,
      desc: `From: ${name} \n Email: ${email} \n\n ${description}`,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }

    await response.json();
    res.status(200).json({ serverStatus: 2 });

  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).json({ serverStatus: -1 });
  }
};
