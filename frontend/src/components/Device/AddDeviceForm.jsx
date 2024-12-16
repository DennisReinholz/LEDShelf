import React, { useState } from "react";
import styles from "../../styles/Device/addDeviceForm.module.css";
import { useConfig } from "../../ConfigProvider";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

const AddDeviceForm = ({ onClose }) => {
    const [ipAddress, setIpAddress] = useState();
    const config = useConfig();
    const { backendUrl } = config || {};

      const createController = async () => {    
        try {
          const response = await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/createLedController`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ip: ipAddress }),
            cache: "no-cache",
          });
          const data = await response.json();
          if (data.serverStatus === 2) {
            toast.success("Led-Controller hinzugefügt");
            onClose();
          }
          else{
            toast.error("Led-Controller konnte nicht hinzugefügt werden");
          }
        } catch (error) {
          console.error("Error pinging the controller:", error);
          return false;
        }
      };

  return (
    <div className={styles.container}>
        <h3>LEDController hinzufügen</h3>       
        <div className={styles.inputRow}>
            <p>Ip-Adresse:</p>
            <input type="text" placeholder="IP-Adresse" onChange={(e)=>setIpAddress(e.target.value)}/>
        </div>
        <div className={styles.buttonContainer}>
        <button className="primaryButton" onClick={()=>createController()}>Hinzufügen</button>
        <button className="secondaryButton" onClick={onClose}>Abrechen</button>
        </div>
    </div>
  );
};
AddDeviceForm.propTypes = {
    onClose: PropTypes.func.isRequired
    };
export default AddDeviceForm;