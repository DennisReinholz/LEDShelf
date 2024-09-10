const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const configPath = path.join(__dirname, "config.json");
require("dotenv").config();

// Windows
let backupPathDev = "./Database/BackUp";
let databasePathDev = "./Database/Ledshelf.db";

// Docker container
let backupPathProd = "/home/ledshelf/backup";
let databasePathPro = "/home/ledshelf";

// Bestimmen, ob wir uns in einer Docker-Umgebung befinden oder lokal ausführen
const isDocker = process.env.DOCKER_ENV === "true";

if (!isDocker) {
  // Webapp läuft lokal
  console.log("Running in local environment");

  // Erstelle den /Datenbank/BackUp-Ordner
  const dataDir = path.join(backupPathDev);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
} else {
  // Webapp läuft in Docker
  console.log("Running in Docker environment");
  // Erstelle den /Datenbank/BackUp-Ordner
  const dataDir = path.join(backupPathProd);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`Backup directory created at: ${dataDir}`);
  } else {
    console.log(`Backup directory already exists: ${dataDir}`);
  }
}

// Backup-Funktion
function createBackup() {
  if (isDocker) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const timestamp = `${year}${month}${day}`;
    const backupFile = path.join(
      databasePathPro,
      `database_backup_${timestamp}.db`
    );

    try {
      fs.copyFileSync(databasePathPro, backupFile);
      if (fs.existsSync(backupFile)) {
        console.log(`Backup erfolgreich erstellt: ${backupFile}`);
      } else {
        console.error(
          `Fehler: Backup-Datei wurde nicht erstellt: ${backupFile}`
        );
      }
    } catch (error) {
      console.error(`Fehler beim Erstellen des Backups: ${error.message}`);
    }
  } else {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const timestamp = `${year}${month}${day}`;
    const backupFile = path.join(
      backupPathDev,
      `database_backup_${timestamp}.db`
    );

    try {
      fs.copyFileSync(backupPathDev, backupFile);
      if (fs.existsSync(backupFile)) {
        console.log(`Backup erfolgreich erstellt: ${backupFile}`);
      } else {
        console.error(
          `Fehler: Backup-Datei wurde nicht erstellt: ${backupFile}`
        );
      }
    } catch (error) {
      console.error(`Fehler beim Erstellen des Backups: ${error.message}`);
    }
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
  if (isDocker) {
    if (backupPathProd) {
      res.status(200).json({ backUpPath: backupPathDev });
    } else {
      res.status(500).json({ serverStatus: -2 });
    }
  } else {
    if (backupPathDev) {
      res.status(200).json({ backUpPath: backupPathDev });
    } else {
      res.status(500).json({ serverStatus: -2 });
    }
  }
};
module.exports.ManualBackup = (req, res) => {
  //Dev
  if (!isDocker) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const timestamp = `${year}${month}${day}_${hour}${minute}`;
    const backupFile = path.join(
      backupPathDev,
      `database_backup_${timestamp}.db`
    );

    try {
      fs.copyFileSync(databasePathDev, backupFile);

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
  } else {
    //Prod
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const timestamp = `${year}${month}${day}_${hour}${minute}`;
    const backupFile = path.join(
      backupPathDev,
      `database_backup_${timestamp}.db`
    );

    try {
      fs.copyFileSync(databasePathDev, backupFile);

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
  }
};
module.exports.GetRecentBackUpFile = (req, res) => {
  // Dev
  if (!isDocker) {
    fs.readdir(backupPathDev, (err, files) => {
      if (err) {
        console.error("Fehler beim Lesen des Ordners:", err);
        return res.status(500).json({ error: "Fehler beim Lesen des Ordners" });
      }

      if (files.length === 0) {
        return res.status(200).json({ serverStatus: -2 });
      }

      let latestFile = { name: null, birthtime: 0 };

      files.forEach((file) => {
        const filePath = path.join(backupPathDev, file);
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
    //Prod
  } else {
    fs.readdir(backupPathProd, (err, files) => {
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
        const filePath = path.join(backupPathProd, file);
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
  }
};
module.exports.GetBackUpFiles = (req, res) => {
  const handleResponse = (err, files, backupPath) => {
    if (err) {
      console.error("Fehler beim Lesen des Ordners:", err);
      return res.status(500).json({ error: "Fehler beim Lesen des Ordners" });
    }

    if (files.length === 0) {
      return res.status(200).json([]); // Leeres Array zurückgeben
    }

    const fileInfos = files.map((file, index) => {
      const filePath = path.join(backupPath, file);
      const stats = fs.statSync(filePath);

      return {
        index: index,
        name: file,
        birthtime: stats.birthtime,
      };
    });

    res.status(200).json(fileInfos);
  };

  // Dev
  if (!isDocker) {
    fs.readdir(backupPathDev, (err, files) =>
      handleResponse(err, files, backupPathDev)
    );
  } else {
    // Prod
    fs.readdir(backupPathProd, (err, files) =>
      handleResponse(err, files, backupPathProd)
    );
  }
};
