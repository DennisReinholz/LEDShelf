import React, { useEffect, useState } from "react";
import styles from "../../styles/Device/device.module.css";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";
import EditDeviceForm from "../../components/Device/EditDeviceForm";
import Modal from "../../components/common/Modal";
import DeleteDeviceForm from "../../components/Device/DeleteDeviceForm";

const Device = ({ ip, status, shelfName, shelfid, deviceId }) => {
  const [assignedShelf, setAssignedShelf] = useState();
  const [assignedIsOpen, setAssignedIsOpen] = useState(false);
  const [deleteFormIsOpen, setDeleteFormIsOpen] = useState(false);
  const [deleteDevice, setDeleteDevice] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [ControllerStatus, setControllerStatus] = useState();

  const pingController = async () => {
    try {
      const response = await fetch(`http://localhost:3000/pingController`, {
        method: "Get",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      })
        .then((response) => response.json())
        .then((controller) => {
          if (controller.serverStatus !== 2) {
            setControllerStatus("Nicht verbunden");
          } else if (controller.serverStatus === 2) {
            setControllerStatus("Verbunden");
          } else if (controller.status === 500) {
          }
        })
        .catch(console.log(`Contoller wurde nicht gefunden: ${ip}`));
    } catch (error) {
      console.log("Error:", err.message);
      setResponse(null);
    }
  };

  useEffect(() => {
    pingController();
  }, [assignedShelf, ip]);
  return (
    <div
      className={
        assignedIsOpen ? styles.container : styles.assignedIsOpenContainer
      }
    >
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
        <p>{ControllerStatus != undefined ? ControllerStatus : ""}</p>
      </div>
      <div className={styles.editContainer}>
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

export default Device;
