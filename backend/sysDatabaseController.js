module.exports.GetDatabaseBackUpPath = () => {};
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
module.exports.GetCurrentDatabasePath = () => {
  sysDatabase.all(`SELECT dataBasepath FROM system`, (err, rows) => {
    if (err) {
      console.error("Fehler beim Abrufen der Daten:", err.message);
      return reject(new Error("Datenbank konnte nicht gefunden werden."));
    } else {
      resolve(rows);
    }
  });
};
