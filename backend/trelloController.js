require("dotenv").config();
const apiKey = process.env.REACT_APP_TRELLO_API_KEY;
const apiToken = process.env.REACT_APP_TRELLO_API_TOKEN;
const boardId = process.env.REACT_APP_CUSTOMERBOARD_ID;
const listId = process.env.REACT_APP_CUSTOMERREQUESTLIST_ID;

module.exports.getLabels = async (req, res) => {
  try {
    const response = await fetch(
      `https://api.trello.com/1/boards/${boardId}/labels?key=${apiKey}&token=${apiToken}`,
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
  const url = `https://api.trello.com/1/cards?key=${apiKey}&token=${apiToken}`;

  const body = {
    idList: listId,
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
    const data = await response.json();
    res.status(200).json({ serverStatus: 2 });
  } catch (error) {
    res.status(500).json({ serverStatus: -1 });
  }
};
