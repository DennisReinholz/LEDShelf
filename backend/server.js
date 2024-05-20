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

app.post("/register-controller", async (req, res) => {
  try {
    const { name, ssid, password } = req.body;

    // Überprüfe, ob der Controller bereits registriert ist
    const existingController = await Controller.findOne({ name });

    if (existingController) {
      return res
        .status(400)
        .json({ message: "Controller bereits registriert" });
    }

    // Erstelle einen neuen Controller-Eintrag in der Datenbank

    res.status(201).json({ message: "Controller erfolgreich registriert" });
  } catch (error) {
    console.error("Fehler beim Registrieren des Controllers:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

app.get("/wifi-networks", async (req, res) => {
  try {
    // WLAN-Netzwerke scannen
    const networks = await wifi.scan();
    console.log(networks);
    // Liste der Netzwerke senden
    res.json(networks);
  } catch (error) {
    console.error("Fehler beim Scannen der WLAN-Netzwerke:", error);
    res.status(500).json({ error: "Fehler beim Scannen der WLAN-Netzwerke" });
  }
});
// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
