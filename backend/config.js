require("dotenv").config();

const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

// Hier die URL deines Key Vaults einfügen
const keyVaultName = "KV-ledshelf";
const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;

const credential = new DefaultAzureCredential();

const client = new SecretClient(keyVaultUrl, credential);

async function getTrelloKeyToken(secretNames) {
  try {
    const secrets = {};
    for (const name of secretNames) {
      const secret = await client.getSecret(name);
      secrets[name] = secret.value;
    }
    return secrets;
  } catch (error) {
    console.error("Fehler beim Abrufen der Geheimnisse:", error);
  }
}

module.exports = { 
  getSecrets: getTrelloKeyToken, 
};
