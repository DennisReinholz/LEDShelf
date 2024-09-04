import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";
import styles from "./../../styles/Database/recoveryDatabase.module.css";

const RecoryDatabase = () => {
  const [currentDatabase, setCurrentDatabase] = useState();
  const [files, setFiles] = useState();

  const GetBackUpFiles = async () => {
    const response = await fetch(`http://localhost:3000/getBackUpFiles`, {
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
  const GetCurrentDatabasePath = async () => {
    const response = await fetch(`http://localhost:3000/getCurrentDatabase`, {
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
            setCurrentDatabase(data);
          }
        }
      });
  };

  useEffect(() => {
    GetBackUpFiles();
    GetCurrentDatabasePath();
  }, [files]);

  return (
    <React.Fragment>
      <Tooltip anchorSelect=".primaryButton" place="right">
        Starte ein manuelles Backup der Datenbank
      </Tooltip>
      <fieldset>
        <legend>Datenbank Wiederherstellung</legend>
        <div className={styles.contentContainer}>
          <p>Verbundene Datenbank:</p>
          <p className={styles.currentDatabaseName}>
            {currentDatabase != undefined ? currentDatabase : ""}
          </p>
        </div>
        <div className={styles.databaseSelectionContainer}>
          <p>Datenbank auswählen</p>
          <select className={styles.backUpSelection}>
            <option>BackUp auswählen</option>
            {Array.isArray(files) ? (
              files.map((f) => (
                <option value={f.name} key={f.index}>
                  {f.name}
                </option>
              ))
            ) : (
              <option>Kein Backup gefunden</option>
            )}
          </select>
        </div>
        <div className={styles.buttonContainer}>
          <button className="primaryButton" onClick={() => console.log(files)}>
            Speichern
          </button>
        </div>
      </fieldset>
    </React.Fragment>
  );
};

export default RecoryDatabase;
