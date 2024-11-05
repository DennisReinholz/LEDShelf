import React, { useEffect, useState } from "react";
import styles from "../../styles/Device/editDeviceForm.module.css";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { useConfig } from "../../ConfigProvider";

const EditDeviceForm = ({ onClose, ip, shelfid, deviceId }) => {
  const [shelfList, setShelfList] = useState([]);
  const [newIp, setNewIp] = useState();
  const [newShelf, setNewShelf] = useState();
  const [updateEnabled, setUpdateEnabled] = useState();
  const config = useConfig();
  const { backendUrl } = config || {};

  const getShelf = async () => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/getShelf`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((shelf) => {
        setShelfList(shelf);
      });
  };

  const pingController = async () => {
    try {
      const response = await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/pingController`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ip: newIp }),
        cache: "no-cache",
      });
      const data = await response.json();
      return data.serverStatus === 2;
    } catch (error) {
      console.error("Error pinging the controller:", error);
      return false;
    }
  };
  const UpdateLedController = async () => {
    const isHeartbeat = await pingController();
    if (isHeartbeat) {
      await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/updateLedController`, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ip: newIp != undefined && newIp.length != 0 ? newIp : ip,
          shelfid: newShelf != undefined && newShelf != 0 ? newShelf : shelfid,
          controllerid: deviceId,
          status: "Verbunden",
        }),
        cache: "no-cache",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.serverStatus === 2) {
            toast.success("Led-Controller wurde aktualisiert");
            onClose();
          } else {
            toast.error("Led-Controller konnte nicht geladen werden");
          }
        });    
  };
  const handleIp = () => {
    if (newIp === undefined) {
      setNewIp(ip);
    }
  };
  const handleEditController = () => {
    if (newIp != undefined && newShelf !== undefined) {
      setUpdateEnabled(true);
    } else {
      setUpdateEnabled(false);
    }
  };

  useEffect(() => {
    getShelf();
    handleEditController();
    handleIp();
  }, [newIp, newShelf]);

  return (
    <div className={styles.container}>
      <h3>Controller {deviceId} bearbeiten</h3>
      <div className={styles.content}>
        <div className={styles.controllerProps}>
          <p>IP</p>
          <input
            type="text"
            value={newIp || ""}
            className={styles.editInput}
            onChange={(e) => setNewIp(e.target.value)}
          />
        </div>
        <div className={styles.controllerProps}>
          <p>Regal</p>
          <select
            value={newShelf || ""}
            className={styles.shelfSelection}
            onChange={(e) => setNewShelf(e.target.value)}
          >
            <option value=""> Regal auswählen</option>
            {shelfList.result != undefined
              ? shelfList.result.map((s) => (
                  <option value={s.shelfid} key={s.shelfid}>
                    {s.shelfname}
                  </option>
                ))
              : ""}
          </select>
        </div>
      </div>
      <div>
        <div className={styles.buttonContainer}>
          <button className="secondaryButton" onClick={onClose}>
            Abbrechen
          </button>
          <button
            disabled={!updateEnabled}
            className={updateEnabled ? "primaryButton" : "disabledButton"}
            onClick={UpdateLedController}
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};
EditDeviceForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  ip: PropTypes.node.isRequired,
  shelfid: PropTypes.node.isRequired,
  deviceId: PropTypes.node.isRequired,
};
export default EditDeviceForm;
