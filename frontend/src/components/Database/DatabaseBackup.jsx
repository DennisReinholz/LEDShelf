import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";
import styles from "../../styles/Database/databaseBackup.module.css";

const DatabaseBackup = () => {
  const [databaseBackUpPath, setDatabasePath] = useState();

  const getDatabasePath = async () => {
    const response = await fetch(`http://localhost:3000/getDatabasepath`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((path) => {
        if (path !== undefined) {
          setDatabasePath(path.backUpPath);
        } else if (path.serverStatus === -2) {
        }
      });
  };
  const StartBackUp = async () => {
    const response = await fetch(`http://localhost:3000/startManualBackup`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.serverStatus === 2) {
          toast.success("Backup wurde erstellt");
        } else if (res.serverStatus === -1) {
          toast.error("Backup konnte nicht erstellt werden");
        }
      });
  };

  useEffect(() => {
    getDatabasePath();
  }, []);

  return (
    <React.Fragment>
      <Tooltip anchorSelect=".inputDatabaseBackup" place="right">
        {databaseBackUpPath}
      </Tooltip>
      <fieldset>
        <legend>Datenbank Backup</legend>
        <div className={styles.backupContainer}>
          <p>Letztes Sicherung</p>
          <p>10.10.2024 - 04:00 Uhr</p>
        </div>
        <div className={styles.backupPathContainer}>
          <p>BackUp Pfad:</p>
          <div className={styles.inputContainer}>
            <p>{databaseBackUpPath}</p>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button className="primaryButton" onClick={() => StartBackUp()}>
            Backup
          </button>
        </div>
      </fieldset>
    </React.Fragment>
  );
};

export default DatabaseBackup;
