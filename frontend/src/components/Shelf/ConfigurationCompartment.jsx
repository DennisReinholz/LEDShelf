import React from "react";
import PropTypes from "prop-types";
import ShowLed from "./ShowLed";
import styles from "../../styles/Shelf/configurationCompartment.module.css";

const DISPLAY_HEIGHT = 1000;
const steps = 1.375 * 5;

const ConfigurationCompartment = ({
    shelf,
    index,
    calculateLEDs,
    isEditing,
    toggleEditing,
    numberled
}) => {  
    const calculateShelfHeightPercentage = () => {
        if (shelf.height === undefined) {
            return ((numberled * steps / DISPLAY_HEIGHT) * 100);
        } else {
            return (shelf.height / DISPLAY_HEIGHT) * 100;
        }
    };
    return (
        <div
            className={styles.compartment}
            style={{
                height: `${calculateShelfHeightPercentage()}%`,
                backgroundColor: isEditing ? "#e0f7fa" : "#fff",
            }}
            onClick={toggleEditing}
        >
            <ShowLed numberLed={calculateLEDs(shelf.height)} isEditing={isEditing} />
            <div className={styles.content}>
                <p>
                {`Fach - ${index + 1} ${shelf.articleid !== null && shelf.articleid !== undefined ? `< ${shelf.articlename} >` : "< Kein Artikel >"}`}
                </p>
            </div>
        </div>
    );
};

ConfigurationCompartment.propTypes = {
    shelf: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    handleShelfChange: PropTypes.func.isRequired,
    removeShelf: PropTypes.func,
    calculateLEDs: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    setIsEditing: PropTypes.func,
    toggleEditing: PropTypes.func.isRequired,
    numberled: PropTypes.number
};

export default ConfigurationCompartment;
