require("dotenv").config();
const path = require("path");

const config = {
  apiKey: process.env.REACT_APP_TRELLO_API_KEY,
  accessToken: process.env.REACT_APP_TRELLO_API_TOKEN,
  customerBoardId: "66b8ed3e4477bbb0ce31abf1",
  customerRequestListId: "66b8ed6239d0edab8f6118c3",
};
module.exports = config;
