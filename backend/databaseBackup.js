const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const config = require("dotenv").config();

const databasePath = process.env.REACT_APP_DATABASE_PATH; // Pfad zu SQLite-Datenbank
const backupDir = process.env.REACT_APP_DATABASE_BACKUP_PATH;
const backUpPath = process.env.REACT_APP_DATABASE_BACKUP_PATH; // Pfad zu Backup-Verzeichnis

if (!fs.existsSync(backUpPath)) {
  fs.mkdirSync(backUpPath, { recursive: true });
}

// Backup-Funktion
function createBackup() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Monate sind nullbasiert
  const day = String(now.getDate()).padStart(2, "0");
  const timestamp = `${year}${month}${day}`;
  const backupFile = path.join(backupDir, `database_backup_${timestamp}.db`);
  fs.copyFileSync(databasePath, backupFile);

  try {
    fs.copyFileSync(databasePath, backupFile);
    if (fs.existsSync(backupFile)) {
      console.log(`Backup erfolgreich erstellt: ${backupFile}`);
    } else {
      console.error(`Fehler: Backup-Datei wurde nicht erstellt: ${backupFile}`);
    }
  } catch (error) {
    console.error(`Fehler beim Erstellen des Backups: ${error.message}`);
  }
}
module.exports.StartBackUp = () => {
  cron.schedule(
    "0 4 * * *",
    () => {
      createBackup();
    },
    {
      scheduled: true,
      timezone: "Europe/Berlin",
    }
  );
  console.log("Cron-Job gestartet: Täglich um 4 Uhr morgens");
};
module.exports.GetBackUpPath = (req, res) => {
  if (backUpPath != undefined) {
    res.status(200).json({ backUpPath });
  } else {
    res.status(500).json({ serverStatus: -2 });
  }
};
module.exports.ManualBackup = (req, res) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Monate sind nullbasiert
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0"); // Stunde
  const minute = String(now.getMinutes()).padStart(2, "0"); // Minute
  const timestamp = `${year}${month}${day}_${hour}${minute}`; // Format: YYYYMMDD_HHMM
  const backupFile = path.join(backupDir, `database_backup_${timestamp}.db`);

  try {
    fs.copyFileSync(databasePath, backupFile);

    if (fs.existsSync(backupFile)) {
      res.status(200).json({
        message: "Backup erfolgreich erstellt",
        backupFile,
        serverStatus: 2,
      });
    } else {
      res
        .status(500)
        .json({ error: "Backup-Datei nicht gefunden", serverStatus: -1 });
    }
  } catch (error) {
    console.error(`Fehler beim Erstellen des Backups: ${error.message}`);
    res.status(500).json({ error: error.message, serverStatus: -1 });
  }
};
