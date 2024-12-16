import React from "react";
import styles from "../../styles/Device/deleteDeviceForm.module.css";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { useConfig } from "../../ConfigProvider";

const DeleteDeviceForm = ({ onClose, ip, setDeleteDevice, deviceId }) => {
  const config = useConfig();
  const { backendUrl } = config || {};

  const deleteDevice = async () => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/deleteLedController`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        deviceId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.serverStatus == 2) {
          toast.success("Controller wurde gelöscht.");
          onClose();
        } else {
          toast.error("Artikel konnte nicht gelöscht werden.");
        }
      });
  };
  const handleDeleteDevice = () => {
    setDeleteDevice(true);
    deleteDevice();
    onClose();
  };

  return (
    <div className={styles.container}>
      <h3>Controller {deviceId} löschen?</h3>

      <div className={styles.content}>
        <p>Controller mit der IP-Adresse: {ip} wirklich löschen?</p>
      </div>
      <div className={styles.buttonContainer}>
        <button className="secondaryButton" onClick={onClose}>
          Nein
        </button>
        <button className="primaryButton" onClick={handleDeleteDevice}>
          Ja
        </button>
      </div>
    </div>
  );
};
DeleteDeviceForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  ip: PropTypes.node.isRequired,
  setDeleteDevice: PropTypes.func.isRequired,
  deviceId: PropTypes.node.isRequired,
};

export default DeleteDeviceForm;
