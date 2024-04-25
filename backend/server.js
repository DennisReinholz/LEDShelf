const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.set("Cache-Control", "no-store");
  next();
});
app.use(express.json());
app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:3000/login",
  optionsSuccessStatus: 200,
};

app.use(cors());

//app.use(bodyParser.json());
app.set("etag", false);
// SQLite-Datenbankverbindung herstellen
const db = new sqlite3.Database("./haseloff3D.db");

//Controller
const DataBaseController = require("./dataBaseController");
const Database = require("better-sqlite3");

app.post("/users", (req, res) => {
  DataBaseController.getUser(req, res, db);
});
app.get("/getShelf", (req, res) => {
  DataBaseController.getShelf(req, res, db);
});
app.post("/getCompartment", (req, res) => {
  DataBaseController.getCompartments(req, res, db);
});
app.get("/getUser", (req, res) => {
  DataBaseController.getUsers(req, res, db);
});
app.post("/createUser", (req, res) => {
  DataBaseController.createUser(req, res, db);
});
app.get("/getAllUser", (req, res) => {
  DataBaseController.getAllUser(req, res, db);
});
app.post("/createShelf", (req, res) => {
  DataBaseController.postCreateShelf(req, res, db);
});
app.get("/getArticle", (req, res) => {
  DataBaseController.getArticle(req, res, db);
});
app.post("/createArticle", (req, res) => {
  DataBaseController.createArticle(req, res, db);
});
app.post("/getSelectedArticle", (req, res) => {
  DataBaseController.getSelectedArticle(req, res, db);
});
app.post("/upateArticle", (req, res) => {
  DataBaseController.updateArticle(req, res, db);
});
app.post("/deleteArticle", (req, res) => {
  DataBaseController.deleteArticle(req, res, db);
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
