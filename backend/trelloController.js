const config = require("./config.js");

module.exports.getLabels = async (req, res) => {
  try {
    const response = await fetch(
      `https://api.trello.com/1/boards/${config.customerBoardId}/labels?key=${config.apiKey}&token=${config.accessToken}`,
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
module.exports.createCard = async (req, res) => {
  const { name, email, reference, reason, description } = req.body;
  const url = `https://api.trello.com/1/cards?key=${config.apiKey}&token=${config.accessToken}`;

  const body = {
    idList: config.customerRequestListId,
    idLabels: reason,
    name: reference,
    desc: `From: ${name} \n Email: ${email} \n\n ${description}`,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body), // Body der Anfrage
    });

    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }
    await response.json();
    res.status(200).json({ serverStatus: 2 });
  } catch (error) {
    res.status(500).json({ serverStatus: -1 });
  }
};
