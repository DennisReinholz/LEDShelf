import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";
import styles from "../../styles/Database/databaseBackup.module.css";
import { useConfig } from "../../ConfigProvider";

const DatabaseBackup = () => {
  // eslint-disable-next-line no-unused-vars
  const [databaseBackUpPath, setDatabasePath] = useState();
  const [files, setFiles] = useState();
  const [upDated, setUpdated] = useState();
  const [databaseName, setDatabaseName] = useState();
  const config = useConfig();
  const { backendUrl } = config || {};


  const getDatabasePath = async () => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/getDatabasepath`, {
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
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/startManualBackup`, {
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
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/getRecentBackUpFile`, {
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
  const GetDatabaseName = async () => {
    const exportUrl = `http://${backendUrl === undefined ? config.localhost : backendUrl}:3000/getDatabaseName`;
    try {
      await fetch(exportUrl, {
        method: "Get",
        cache: "no-cache",
      } 
      )
      .then((response) => response.json())
      .then((data)=>{
        if (data !== undefined) {
          setDatabaseName(data.databaseName);
        }
      });
    } catch (error) {
      console.error("Fehler beim Exportieren der Datenbank:", error);
      toast.error("Fehler beim Exportieren der Datenbank. Bitte erneut versuchen.");
    }
  };

  const ExportDatabase = async () => {
    const exportUrl = `http://${backendUrl === undefined ? config.localhost : backendUrl}:3000/exportDatabase`;
    try {
      await fetch(exportUrl, {
        method: "Get",
        cache: "no-cache",
      } 
      )
      .then((response) => response.blob())
      .then((data)=>{
        const downloadUrl = URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `LEDShelf_${formatDate()}.db`;
        link.click();
        URL.revokeObjectURL(downloadUrl);
        toast.success("Datenbank erfolgreich exportiert!");
      });
    } catch (error) {
      console.error("Fehler beim Exportieren der Datenbank:", error);
      toast.error("Fehler beim Exportieren der Datenbank. Bitte erneut versuchen.");
    }
  };

  function formatDate(dateStr = undefined) {
    let date;
    let isTimestamp;
    if (dateStr === undefined) {
      date = new Date();
      isTimestamp = true;
    }
    else{
      date = new Date(dateStr);
      isTimestamp = false;
    }
    
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return isTimestamp? `${day}${month}${year}_${hours}${minutes}`:`${day}.${month}.${year} - ${hours}:${minutes}`;
  };

  useEffect(() => {
    getDatabasePath();
    GetBackUpFiles();
    if(databaseName === undefined){
      GetDatabaseName();
    }
    
  }, [files, upDated]);

  return (
    <React.Fragment>
      <Tooltip anchorSelect="[data-tooltip='backup']" ac place="right">
        Starte ein manuelles Backup der Datenbank
      </Tooltip>
      <Tooltip anchorSelect="[data-tooltip='export']" place="right">
        Exportiere die Datenbank als Datei
      </Tooltip>
      <fieldset className={styles.backupFieldset}>
        <legend>Datenbank Sicherung</legend>
        <div className={styles.backupContainer}>
          <p>Letzte Sicherung</p>
          <p>
            {files != undefined
              ? `${formatDate(files.birthtime)}`
              : "Kein BackUp vorhanden"}
          </p>
        </div>
        <div className={styles.buttonContainer}>
          <button className="primaryButton" data-tooltip="backup" onClick={() => StartBackUp()}>
            Sichern
          </button>
          <button className="primaryButton" data-tooltip="export" onClick={() => ExportDatabase()}>
            Exportieren
          </button>
        </div>
      </fieldset>
    </React.Fragment>
  );
};

export default DatabaseBackup;
