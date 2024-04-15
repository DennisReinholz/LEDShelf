import React from "react";
import styles from "../styles/button.module.css";

const Button = ({ handleLed, children }) => {
  return (
    <button className={styles.container} onClick={() => handleLed()}>
      {children} ON
    </button>
  );
};

export default Button;
