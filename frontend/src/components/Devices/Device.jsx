import React from "react";
import styles from "../../styles/Device/device.module.css";

const Device = () => {
  return (
    <div className={styles.container}>
      <div className={styles.containerParameter}>
        <p>Zugewiesenes Regal:</p>
        <p>IP-Adresse:</p>
        <p>Verfügbare Fächer:</p>
        <p>Status:</p>
      </div>
      <div className={styles.containerValues}>
        <p>Regal 1</p>
        <p>127.0.0.0.1</p>
        <p>15</p>
        <p>Nicht verbunden</p>
      </div>
      <div className={styles.declareShelf}>
        <button className="primaryButton" style={{ width: "7rem" }}>
          Regal zuweisen
        </button>
        <select style={{ width: "7rem", height: "2rem" }}>
          <option>Regal1</option>
          <option>Regal2</option>
          <option>Regal3</option>
        </select>
      </div>
    </div>
  );
};

export default Device;
