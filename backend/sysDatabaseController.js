const { exec } = require("child_process");

module.exports.GetDatabasePath = (sysDatabase) => {
  return new Promise((resolve, reject) => {
    sysDatabase.all(`SELECT dataBasepath FROM system`, (err, rows) => {
      if (err) {
        console.error("Fehler beim Abrufen der Daten:", err.message);
        return reject(new Error("Datenbank konnte nicht gefunden werden."));
      } else {
        console.log("Aus SysDatabase: ",rows)
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
  sysDatabase.all(
    `UPDATE system SET databasepath = ?`,
    [selectedBackup],
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
  const ziel = "./Datenbank/Ledshelf.db";
  const pythonScript = `python3 ./Scripts/OverrideProdDatabase.py ${currentDatabase} ${ziel}`;

  exec(pythonScript, (error, stdout, stderr) => {
    if (error) {
      console.error(`Fehler beim Ausführen des Skripts: ${error.message}`);
      return res.status(200).json({ serverStatus: -2, error: error.message });
    }

    if (stderr) {
      console.error(`Fehler im Skript: ${stderr}`);
      return res.status(200).json({ serverStatus: -2, error: stderr });
    }
  });
  sysDatabase.run(
    `UPDATE system SET dataBasepath = "./Datenbank/Ledshelf.db"`,
    (err) => {
      if (err) {
        res.status(200).json({ serverStatus: -2 });
      } else {
        res.status(200).json({ serverStatus: 1 });
      }
    }
  );
};
