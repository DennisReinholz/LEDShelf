const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const configPath = path.join(__dirname, "config.json");
require("dotenv").config();

let backupPath, databasePath;

function replaceEnvVariables(config) {
  const keys = Object.keys(config);
  keys.forEach((key) => {
    if (
      typeof config[key] === "string" &&
      config[key].startsWith("${") &&
      config[key].endsWith("}")
    ) {
      const envVar = config[key].slice(2, -1);
      config[key] = process.env[envVar] || config[key];
    }
  });
  return config;
}
function loadConfig() {
  try {
    const rawData = fs.readFileSync(configPath, "utf8");
    let config = JSON.parse(rawData);
    config = replaceEnvVariables(config);
    return config;
  } catch (error) {
    console.error("Error reading or parsing config.json:", error);
    return null;
  }
}

const isDocker = process.env.DOCKER_ENV === "true";

if (!isDocker) {
  // Webapp is running locally
  console.log("Running in local environment");

  backupPath = process.env.REACT_APP_DATABASE_BACKUP_PATH;
  databasePath = process.env.REACT_APP_DATABASE_PATH;

  if (!backupPath) {
    console.error("BackupFolder path is undefined in the configuration.");
  } else {
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
      console.log(`Backup directory created at: ${backupPath}`);
    } else {
      console.log(`Backup directory already exists: ${backupPath}`);
    }
  }
} else {
  // Webapp is running in Docker
  console.log("Running in Docker environment");
  const config = loadConfig();

  if (config) {
    backupPath = config.backupFolder;
    databasePath = config.databasePath;

    if (!backupPath) {
      console.error("BackupFolder path is undefined in the configuration.");
    } else {
      if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath, { recursive: true });
        console.log(`Backup directory created at: ${backupPath}`);
      } else {
        console.log(`Backup directory already exists: ${backupPath}`);
      }
    }
  } else {
    console.error(
      "Failed to load configuration. Backup directory creation skipped."
    );
  }
}

// Backup-Funktion
function createBackup() {
  if (!backupPath || !databasePath) {
    console.error("Backup path or database path is not set.");
    return;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const timestamp = `${year}${month}${day}`;
  const backupFile = path.join(backupPath, `database_backup_${timestamp}.db`);

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
  if (backupPath) {
    res.status(200).json({ backUpPath: backupPath });
  } else {
    res.status(500).json({ serverStatus: -2 });
  }
};
module.exports.ManualBackup = (req, res) => {
  if (!backupPath || !databasePath) {
    res.status(500).json({
      error: "Backup path or database path is not set",
      serverStatus: -1,
    });
    return;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const timestamp = `${year}${month}${day}_${hour}${minute}`;
  const backupFile = path.join(backupPath, `database_backup_${timestamp}.db`);

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
module.exports.GetBackUpFiles = (req, res) => {
  if (!backupPath) {
    return res.status(500).json({ error: "Backup path is not set" });
  }

  fs.readdir(backupPath, (err, files) => {
    if (err) {
      console.error("Fehler beim Lesen des Ordners:", err);
      return res.status(500).json({ error: "Fehler beim Lesen des Ordners" });
    }

    if (files.length === 0) {
      return res
        .status(404)
        .json({ error: "Keine Dateien im Ordner gefunden" });
    }

    let latestFile = { name: null, birthtime: 0 };

    files.forEach((file) => {
      const filePath = path.join(backupPath, file);
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
