const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const databasePath = "./haseloff3D.db"; // Pfad zu Ihrer SQLite-Datenbank
const backupDir = "./BackUp"; // Pfad zu Ihrem Backup-Verzeichnis

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
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
      //TODO: EMAIL notification to Customer or Hintze & Reinholz IT
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
