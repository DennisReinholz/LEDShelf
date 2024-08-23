import React, { useState } from "react";
import { HiOutlineFolderOpen } from "react-icons/hi2";
import styles from "../../styles/Database/databaseBackup.module.css";

const DatabaseBackup = () => {
  const [databasePath, setDatabasePath] = useState();
  return (
    <fieldset>
      <legend>Datenbank Backup</legend>
      <div className={styles.backupContainer}>
        <p>Letztes Datenbank backup</p>
        <p>10.10.2024 - 04:00 Uhr</p>
      </div>
      <div className={styles.backupPathContainer}>
        <p>Datenbank Pfad</p>
        <div className={styles.inputContainer}>
          <input
            className={styles.inputDatabasePath}
            type="text"
            disabled="true"
            placeholder="Artikelname"
            value={"test"}
            onChange={(e) => setDatabasePath(e.target.value)}
          />
          <HiOutlineFolderOpen className={styles.openFolder} />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className="primaryButton">Backup Starten</button>
        <button className="secondaryButton">Speichern</button>
      </div>
    </fieldset>
  );
};

export default DatabaseBackup;
