import React, { useState } from "react";
import styles from "../../styles/Shelf/EditShelfForm.module.css";
import PropTypes from "prop-types";

const EditShelfForm = ({onClose, inputValue, updateFunction, value, caption, question, inputEnable}) => {
  const [newValue, setNewValue] = useState();
  return (
    <div className={styles.container}>
        <h2>{caption}</h2>
        <div className={styles.contentContainer}>
            <h3>{question}</h3>
           {inputEnable && 
            <input className={styles.placeInput}
            placeholder={inputValue || value} 
            type="text" value={newValue} 
            onChange={(e)=>setNewValue(e.target.value)}/>}
        </div>
        <div className={styles.buttonContainer}>
            <button className="secondaryButton" onClick={() => onClose()}>Abbrechen</button>
            <button className="primaryButton" onClick={() => updateFunction(newValue)}>Speichern</button>
        </div>
    </div>
  );
};
EditShelfForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    question: PropTypes.string.isRequired,
    updateFunction: PropTypes.bool.isRequired,
    inputValue: PropTypes.bool.isRequired,
    value: PropTypes.bool.isRequired,
    caption: PropTypes.string.isRequired,
    inputEnable: PropTypes.bool.isRequired
  };
export default EditShelfForm;