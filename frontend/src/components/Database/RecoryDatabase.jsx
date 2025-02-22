import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "./../../styles/Database/recoveryDatabase.module.css";
import { useConfig } from "../../ConfigProvider";

const RecoryDatabase = () => {
  const [currentDatabase, setCurrentDatabase] = useState();
  const [selectedBackup, setSelectedBackup] = useState();
  const [enableOverride, setEnableOverride] = useState();
  const [files, setFiles] = useState();
  const config = useConfig();
  const { backendUrl } = config || {};

  const GetBackUpFiles = async () => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/getBackUpFiles`, {
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
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/getCurrentDatabase`, {
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
  const SetNewDatabasePath = async () => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/setNewDatabasePath`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        selectedBackup: selectedBackup,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data !== undefined) {
          if (data.serverStatus != -2) {
            toast.success(
              "Ausgewählte Datenbank wurde geladen. Bitte die Webanwendung neu starten"
            );
          } else {
            toast.error(
              "Datenbank konnte nicht geladen werden. Bitte kontaktieren Sie den Kundenservice"
            );
          }
        }
      });
  };
  const OverrideProdDatabase = async () => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/overrideProdDatabase`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        currentDatabase: currentDatabase,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data !== undefined) {
          if (data.serverStatus != -2) {
            toast.success(
              "Datenbank wurde übernommen. Bitte Starten Sie die Anwendung neu"
            );
          } else {
            toast.error(
              "Datenbank konnte nicht überschrieben werden",
              data.error
            );
          }
        }
      });
  };
  const CheckOverride = () => {
    if (String(currentDatabase).includes("Ledshelf")) {
      setEnableOverride(false);
    } else {
      setEnableOverride(true);
    }
  };

  useEffect(() => {
    GetBackUpFiles();
    GetCurrentDatabasePath();
    CheckOverride();
  }, [files, enableOverride]);

  return (
    <React.Fragment>
      <fieldset className={styles.fieldsetRecoveryBackup}>
        <legend>Datenbank Wiederherstellung</legend>
        <div className={styles.contentContainer}>
          <p>Verbundene Datenbank:</p>
          <p className={styles.currentDatabaseName}>
            {currentDatabase != undefined ? currentDatabase : ""}
          </p>
        </div>
        <div className={styles.databaseSelectionContainer}>
          <p>Sicherung laden</p>
          <select
            className={styles.backUpSelection}
            onChange={(e) => setSelectedBackup(e.target.value)}
            value={selectedBackup}
          >
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
          <button
            className="primaryButton"
            onClick={() => SetNewDatabasePath()}
          >
            Laden
          </button>
        </div>
        <div className={styles.overrideContainer}>
          <h3>Produktiv Datenbank überschreiben</h3>
          <div className={styles.overrideContent}>
            <p>
              <strong>Ledshelf.db</strong>
            </p>
            <p>überschreiben</p>
            <button
              disabled={!enableOverride}
              className={enableOverride ? "primaryButton" : "disabledButton"}
              onClick={() => OverrideProdDatabase()}
            >
              Überschreiben
            </button>
          </div>
        </div>
      </fieldset>
    </React.Fragment>
  );
};

export default RecoryDatabase;
