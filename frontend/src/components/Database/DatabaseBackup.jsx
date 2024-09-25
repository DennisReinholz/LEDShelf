import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";
import styles from "../../styles/Database/databaseBackup.module.css";

const DatabaseBackup = () => {
  const [databaseBackUpPath, setDatabasePath] = useState();
  const [files, setFiles] = useState();
  const [upDated, setUpdated] = useState();

  const getDatabasePath = async () => {
    await fetch(`http://localhost:3000/getDatabasepath`, {
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
    await fetch(`http://localhost:3000/startManualBackup`, {
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
          setUpdated(true);
        } else if (res.serverStatus === -1) {
          toast.error("Backup konnte nicht erstellt werden");
          setUpdated(false);
        }
      });
  };
  const GetBackUpFiles = async () => {
    await fetch(`http://localhost:3000/getRecentBackUpFile`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data !== undefined) {
          if (data.serverStatus != -2) {
            setFiles(data);
          } else {
            setFiles(undefined);
          }
        }
      });
  };
  function formatDate(dateStr) {
    const date = new Date(dateStr);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Monate sind 0-basiert
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} - ${hours}:${minutes}`;
  }

  useEffect(() => {
    getDatabasePath();
    GetBackUpFiles();
  }, [files, upDated]);

  return (
    <React.Fragment>
      <Tooltip anchorSelect=".primaryButton" place="right">
        Starte ein manuelles Backup der Datenbank
      </Tooltip>
      <fieldset className={styles.backupFieldset.backupFieldset}>
        <legend>Datenbank Sicherung</legend>
        <div className={styles.backupContainer}>
          <p>Letztes Sicherung</p>
          <p>
            {files != undefined
              ? `${formatDate(files.birthtime)}`
              : "Kein BackUp vorhanden"}
          </p>
        </div>
        <div className={styles.buttonContainer}>
          <button className="primaryButton" onClick={() => StartBackUp()}>
            Sichern
          </button>
        </div>
      </fieldset>
    </React.Fragment>
  );
};

export default DatabaseBackup;
