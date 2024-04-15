import React from "react";
import styles from "../styles/Sidebar/logo.module.css";

const Logo = () => {
  return (
    <div className={styles.content}>
      <div className={styles.logo}>
        <p className={styles.name}>haseloff</p>
        <p className={styles.tag}>3D²</p>
      </div>
    </div>
  );
};

export default Logo;
