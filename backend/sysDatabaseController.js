const { exec } = require("child_process");
const os = require("os");

module.exports.GetDatabasePath = (sysDatabase) => {
  return new Promise((resolve, reject) => {
    sysDatabase.all(`SELECT dataBasepath FROM system`, (err, rows) => {
      if (err) {
        console.error("Fehler beim Abrufen der Daten:", err.message);
        return reject(new Error("Datenbank konnte nicht gefunden werden."));
      } else {
        resolve(rows);
      }
    });
  });
};
module.exports.GetCurrentDatabasePath = (req, res, sysDatabase) => {
  sysDatabase.all(`SELECT dataBasepath FROM system`, (err, rows) => {
    if (err) {
      console.error("Fehler beim Abrufen der Daten:", err.message);
      res.status(200).json({ serverStatus: -2 });
    } else {
      res.status(200).json(rows);
    }
  });
};
module.exports.SetNewDatabasePath = (req, res, sysDatabase) => {
  const { selectedBackup } = req.body;
  const system = os.platform();
  let target;

  if (system === "win32") {
    target = `./Database/BackUp/${selectedBackup}`;
  } else {
    target = `/home/ledshelf/database/backup/${selectedBackup}`; 
  }
  sysDatabase.all(
    `UPDATE system SET databasepath = ?`,
    [target],
    (err) => {
      if (err) {
        res.status(200).json({ serverStatus: -2 });
      } else {
        res.status(200).json({ serverStatus: 1 });
      }
    }
  );
};
module.exports.OverrideProdDatabase = (req, res, sysDatabase) => {
  const { currentDatabase } = req.body;
  const system = os.platform();
  let target;
  let backupfilePath;

  if (system === "win32") {    
    target = "./Database/Ledshelf.db";
    backupfilePath = `./Database/BackUp/${currentDatabase}`;
  } else {
    target = "/home/ledshelf/database/ledshelf.db";
    backupfilePath = `/home/ledshelf/database/backup/${currentDatabase}`; 
  }

  const pythonScript = `python3 ./Scripts/OverrideProdDatabase.py ${backupfilePath} ${target}`;

  exec(pythonScript, (error, stdout, stderr) => {
    if (error) {
      console.error(`Fehler beim Ausführen des Skripts: ${error.message}`);
      return res.status(500).json({ serverStatus: -2, error: error.message });
    }

    if (stderr) {
      console.error(`Fehler im Skript: ${stderr}`);
      return res.status(500).json({ serverStatus: -2, error: stderr });
    }

    // Wenn das Python-Skript erfolgreich war, dann führe die Datenbankaktualisierung durch
    sysDatabase.run(`UPDATE system SET dataBasepath = ?`, [target], (err) => {
      if (err) {
        console.error(`Fehler beim Aktualisieren der Datenbank: ${err}`);
        return res.status(500).json({ serverStatus: -2 });
      } else {
        // Nur hier wird die Antwort gesendet, wenn alles erfolgreich war
        return res.status(200).json({ serverStatus: 1 });
      }
    });
  });
};
