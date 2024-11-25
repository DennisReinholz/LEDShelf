import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { BsTrash } from "react-icons/bs";
import styles from "../../styles/Shelf/editConfigurationShelf.module.css";

const EditConfigurationShelf = ({ currentCompartment, height, onHeightChange, removeShelf, numberLed }) => {
    
    const handleIncreaseHeight = () => {
        onHeightChange(currentCompartment, height + 5.5);
    };
    const handleDecreaseHeight = () => {
        if (height > 5.5) {
            onHeightChange(currentCompartment, height - 5.5);
        }
    };
    useEffect(()=>{},[numberLed]);

    return (
        <div className={styles.container}>
            <p>Fach - {currentCompartment + 1}</p>
            <div className={styles.buttonContainer}>                
                <button disabled={numberLed > 120} className={styles.editButton} onClick={handleIncreaseHeight}>▲</button>
                <p>{height}cm</p>                
                <button className={styles.editButton} onClick={handleDecreaseHeight}>▼</button>
            </div>
            <div className={styles.deleteContainer}>
            <BsTrash
                className="delete"
                style={{ cursor: "pointer", fontSize:"2rem" }}
                onClick={()=>removeShelf()}
            />
            </div>
        </div>
    );
};

EditConfigurationShelf.propTypes = {
    currentCompartment: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onHeightChange: PropTypes.func.isRequired,
    removeShelf: PropTypes.func.isRequired,
    numberLed: PropTypes.number.isRequired
};

export default EditConfigurationShelf;
