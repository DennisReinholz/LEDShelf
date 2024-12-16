import React, { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import { TfiReload } from "react-icons/tfi";
import styles from "../../styles/Device/device.module.css";
import EditDeviceForm from "../../components/Device/EditDeviceForm";
import Modal from "../../components/common/Modal";
import DeleteDeviceForm from "../../components/Device/DeleteDeviceForm";
import { useConfig } from "../../ConfigProvider";
import PropTypes from "prop-types";

const Device = ({ ip, shelfName, shelfid, deviceId }) => {
  const [deleteFormIsOpen, setDeleteFormIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [ControllerStatus, setControllerStatus] = useState();

  // eslint-disable-next-line no-unused-vars
  const [assignedShelf, setAssignedShelf] = useState();
  // eslint-disable-next-line no-unused-vars
  const [assignedIsOpen, setAssignedIsOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [deleteDevice, setDeleteDevice] = useState(false);
  const config = useConfig();
  const { backendUrl } = config || {};

  const pingController = async () => {
    try { 
      setControllerStatus("Suche LedController");
      await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/pingController`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ip }),
        cache: "no-cache",
      })
        .then((response) => response.json())
        .then((controller) => {
          if (controller.serverStatus !== 2) {
            setControllerStatus("Nicht verbunden");
          } else if (controller.serverStatus === 2) {
            setControllerStatus("Verbunden");
          } else if (controller.status === 500) {
            console.log("Serverfehler");
          }
        })
        .catch((error) => {
          console.log(`Controller wurde nicht gefunden: ${error}`);
        });
    } catch (error) {
      setResponse(null);
      console.log("Fehler beim Abrufen des Controllers:", error);
    }
  };

  useEffect(() => {
    pingController();
  }, [assignedShelf, ControllerStatus]);
  return (
    <div
      className={
        assignedIsOpen ? styles.container : styles.assignedIsOpenContainer
      }
    >
      <Tooltip anchorSelect=".reconnect" place="left">
        Mit Controller verbinden
      </Tooltip>
      <Tooltip anchorSelect=".edit" place="left">
        Bearbeiten des Controllers
      </Tooltip>
      <Tooltip anchorSelect=".delete" place="left">
        Löscht den Controller
      </Tooltip>
      <div className={styles.containerParameter}>
        <p>ID</p>
        <p>Zugewiesenes Regal</p>
        <p>IP-Adresse</p>
        <p>Status</p>
      </div>
      <div className={styles.containerValues}>
        <p>{deviceId}</p>
        <p>{shelfName == null ? "Nicht zugewiesen" : shelfName}</p>
        <p>{ip}</p>
        {!ControllerStatus ? <p>Ping Controller..</p> :
        <p>{ControllerStatus != undefined ? ControllerStatus : ""}</p>}
      </div> 
      <div className={styles.editContainer}>
        <TfiReload  className="reconnect"
          style={{ cursor: "pointer" }}
          onClick={() => pingController()}/>
          <FiEdit2
          className="edit"
          style={{ cursor: "pointer" }}
          onClick={() => setEditModalIsOpen(true)}
        />
        <BsTrash
          className="delete"
          style={{ cursor: "pointer" }}
          onClick={() => setDeleteFormIsOpen(true)}
        />        
      </div>
     
      {editModalIsOpen && (
        <Modal onClose={() => setEditModalIsOpen(false)}>
          <EditDeviceForm
            onClose={() => setEditModalIsOpen(false)}
            ip={ip}
            shelfName={shelfName}
            shelfid={shelfid}
            deviceId={deviceId}
          />
        </Modal>
      )}
      {deleteFormIsOpen && (
        <Modal onClose={() => setDeleteFormIsOpen(false)}>
          <DeleteDeviceForm
            ip={ip}
            onClose={() => setDeleteFormIsOpen(false)}
            setDeleteDevice={setDeleteDevice}
            deviceId={deviceId}
          />
        </Modal>
      )}
    </div>
  );
};
Device.propTypes = {
  ip: PropTypes.node.isRequired,
  shelfName: PropTypes.node.isRequired,
  shelfid: PropTypes.node.number,
  deviceId: PropTypes.node.isRequired,
};
export default Device;
