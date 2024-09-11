import React from "react";
import styles from "../styles/Sidebar/logo.module.css";
import logo from "../assets/picture/Logo.jpg";

const Logo = () => {
  return (
    <div className={styles.content}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="ledshelf logo" className={styles.logo} />
      </div>
      <p className={styles.name}>LedShelf</p>
    </div>
  );
};

export default Logo;
