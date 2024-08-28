const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const configPath = path.join(__dirname, "config.json");

function loadConfig() {
  try {
    const rawData = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(rawData);
    return config;
  } catch (error) {
    console.error("Error reading or parsing config.json:", error);
    return null;
  }
}

// Lade die Konfiguration
const config = loadConfig();

if (config) {
  // Sicherstellen, dass das Backup-Verzeichnis existiert
  const backupPath = config.backupFolder;

  if (!backupPath) {
    console.error("BackupFolder path is undefined in the configuration.");
  }

  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
    console.log(`Backup directory created at: ${backupPath}`);
  } else {
    console.log(`Backup directory already exists: ${backupPath}`);
  }
} else {
  console.error(
    "Failed to load configuration. Backup directory creation skipped."
  );
}

// Backup-Funktion
function createBackup() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const timestamp = `${year}${month}${day}`;
  const backupFile = path.join(
    config.backupFolder,
    `database_backup_${timestamp}.db`
  );

  try {
    fs.copyFileSync(config.databasePath, backupFile);
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
  if (config.backupFolder) {
    res.status(200).json({ backUpPath: config.backupFolder });
  } else {
    res.status(500).json({ serverStatus: -2 });
  }
};
module.exports.ManualBackup = (req, res) => {
  const config = loadConfig();

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Monate sind nullbasiert
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0"); // Stunde
  const minute = String(now.getMinutes()).padStart(2, "0"); // Minute
  const timestamp = `${year}${month}${day}_${hour}${minute}`; // Format: YYYYMMDD_HHMM
  const backupFile = path.join(
    config.backupFolder,
    `database_backup_${timestamp}.db`
  );

  try {
    fs.copyFileSync(config.databasePath, backupFile);

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
module.exports.GetBackUpFiles = (req, res) => {
  const config = loadConfig();

  fs.readdir(config.backupFolder, (err, files) => {
    if (err) {
      console.error("Fehler beim Lesen des Ordners:", err);
      return res.status(500).json({ error: "Fehler beim Lesen des Ordners" });
    }

    if (files.length === 0) {
      return res
        .status(404)
        .json({ error: "Keine Dateien im Ordner gefunden" });
    }

    // Stat-Daten für alle Dateien abrufen und die neueste Datei finden
    let latestFile = { name: null, birthtime: 0 };

    files.forEach((file) => {
      const filePath = path.join(config.backupFolder, file);
      const stats = fs.statSync(filePath);

      if (stats.birthtime > latestFile.birthtime) {
        latestFile = {
          name: file,
          birthtime: stats.birthtime,
        };
      }
    });

    res.status(200).json(latestFile);
  });
};
