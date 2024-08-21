import React from "react";
import styles from "../styles/Sidebar/logo.module.css";

const Logo = () => {
  return (
    <div className={styles.content}>
      <div className={styles.logo}>
        <p className={styles.name}>LedShelf</p>
      </div>
    </div>
  );
};

export default Logo;
