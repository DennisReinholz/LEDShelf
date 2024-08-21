const express = require("express");

const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const backUp = require("./databaseBackup");
const DataBaseController = require("./dataBaseController");
const TrelloController = require("./trelloController");
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

app.set("etag", false);

// SQLite-Datenbankverbindung herstellen
const db = new sqlite3.Database("./haseloff3D.db");
const nodemail = require("./nodeMail");

// SQLite-Datenbank BackUp

backUp.StartBackUp();

app.post("/sendEmail", async (req, res) => {
  nodemail.SendMail(req, res, nodemailer);
});

//TrelloController
app.get("/trelloLabels", (req, res) => {
  TrelloController.getLabels(req, res);
});
app.post("/createTrelloCard", (req, res) => {
  TrelloController.createCard(req, res);
});

//DatabaseController
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
app.post("/getArticleCompartments", (req, res) => {
  DataBaseController.getCompartArticleForm(req, res, db);
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
app.post("/deleteCategory", (req, res) => {
  DataBaseController.deleteCategory(req, res, db);
});
app.post("/cerateUser", (req, res) => {
  DataBaseController.createUser(req, res, db);
});
app.get("/getRoles", (req, res) => {
  DataBaseController.getRoles(req, res, db);
});
app.post("/deleteUser", (req, res) => {
  DataBaseController.deleteUser(req, res, db);
});
app.post("/updateUser", (req, res) => {
  DataBaseController.updateUser(req, res, db);
});
app.post("/getUserData", (req, res) => {
  DataBaseController.getUserData(req, res, db);
});
app.get("/getAllArticle", (req, res) => {
  DataBaseController.getAllArticle(req, res, db);
});
app.post("/getArticleInCompartment", (req, res) => {
  DataBaseController.getArticleInCompartment(req, res, db);
});
app.post("/updateArticleCount", (req, res) => {
  DataBaseController.updateArticleCount(req, res, db);
});
app.post("/createCategory", (req, res) => {
  DataBaseController.createCategory(req, res, db);
});
app.get("/getCategory", (req, res) => {
  DataBaseController.getCategory(req, res, db);
});
app.post("/getControllerFunction", (req, res) => {
  DataBaseController.getControllerFunction(req, res, db);
});
app.post("/getShelfOff", (req, res) => {
  DataBaseController.getLedOff(req, res, db);
});
app.post("/getArticleWithCategory", (req, res) => {
  DataBaseController.getArticleWithCategory(req, res, db);
});
app.post("/UpdateArticleCategory", (req, res) => {
  DataBaseController.UpdateArticleCategory(req, res, db);
});
app.get("/getController", (req, res) => {
  DataBaseController.getController(req, res, db);
});
app.post("/updateLedController", (req, res) => {
  DataBaseController.UpdateLedController(req, res, db);
});
app.post("/createLedController", (req, res) => {
  DataBaseController.CreateLedController(req, res, db);
});
app.post("/deleteLedController", (req, res) => {
  DataBaseController.DeleteLedController(req, res, db);
});
app.post("/controllerOff", (req, res) => {
  DataBaseController.ControllerOff(req, res, db);
});
app.post("/pingController", (req, res) => {
  DataBaseController.PingController(req, res, db);
});
app.get("/getCompany", (req, res) => {
  DataBaseController.getCompany(req, res, db);
});
// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
