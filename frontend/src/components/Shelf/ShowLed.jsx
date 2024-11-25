import React from "react";
import styles from "../../styles/Shelf/showLed.module.css";
import PropTypes from "prop-types";

const ShowLed = ({ numberLed, isEditing }) => {
  const leds = Array.from({ length: numberLed }, (_, index) => `led.${index + 1}`);

  return (
    <div className={styles.container}>
      {leds.map((led, index) => (
        <div key={index} className={!isEditing ? styles.led : styles.ledOn}></div>
      ))}
    </div>
  );
};

ShowLed.propTypes = {
  numberLed: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired
};

export default ShowLed;
