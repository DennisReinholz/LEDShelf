import React from "react";
import styles from "../styles/deviceLayout.module.css";
import Device from "../components/Devices/Device";

const DeviceLayout = () => {
  return (
    <div className={styles.container}>
      <button
        className="primaryButton"
        style={{ marginLeft: "1rem", marginTop: "1rem", width: "10rem" }}
      >
        Geräte suchen
      </button>
      <div className={styles.content}>
        <Device />
      </div>
    </div>
  );
};

export default DeviceLayout;
