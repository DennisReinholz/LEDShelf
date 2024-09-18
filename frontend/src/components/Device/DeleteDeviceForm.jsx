import React from "react";
import styles from "../../styles/Device/deleteDeviceForm.module.css";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

const DeleteDeviceForm = ({ onClose, ip, setDeleteDevice, deviceId }) => {
  const deleteDevice = async () => {
    await fetch(`http://localhost:3000/deleteLedController`, {
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
  onClose: PropTypes.node.isRequired,
  ip: PropTypes.node.isRequired,
  setDeleteDevice: PropTypes.node.isRequired,
  deviceId: PropTypes.node.isRequired,
};

export default DeleteDeviceForm;
