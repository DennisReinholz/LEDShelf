import React, { useEffect, useState } from "react";
import styles from "../../styles/Device/addDeviceForm.module.css";
import toast from "react-hot-toast";
import Spinner from "../common/Spinner.jsx";
import PropTypes from "prop-types";
import { useConfig } from "../../ConfigProvider";

const AddDeviceForm = ({ onClose }) => {
  const [ipAdress, setIpAdress] = useState();
  const [countCompartment, setCountCompartment] = useState(0);
  const [loading, setLoading] = useState(false);
  const config = useConfig();
  const { backendUrl } = config || {};

  const createController = async () => {
    setLoading(true);
    try {
      const isAvaiable = await pingController();
      if (isAvaiable) {
        await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/createLedController`, {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-cache",
          body: JSON.stringify({
            ipAdress: ipAdress,
            countCompartment: countCompartment,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.serverStatus === 2) {
              toast.success("Controller wurde erfolgreich hinzugefügt");
              onClose();
            } else if (data.serverStatus !== 2) {
              toast.error("Controller wurde nicht hinzugefügt");
            }
          });
      }
    } catch (error) {
      toast.error("Controller nicht erreichbar", error);
    } finally {
      setLoading(false);
    }
  };
  const pingController = async () => {
    try {
      const response = await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/pingController`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ip: ipAdress }),
        cache: "no-cache",
      });
      const data = await response.json();
      console.log("Ping controller: ",data);
      return data.serverStatus === 2;
    } catch (error) {
      console.error("Error pinging the controller:", error);
      return false;
    }
  };

  useEffect(() => {
  }, []);
  
  return (
    <React.Fragment>
      <div className={styles.container}>
        <h3>Gerät hinzufügen</h3>
        {loading ? (
          <Spinner spinnerText="Ping Controller..."/>
        ) : (
          <React.Fragment>
            <div className={styles.content}>
              <input
                placeholder="Ip Adresse"
                size="small"
                style={{ width: "15.5rem", height: "2rem" }}
                className={styles.input}
                onChange={(e) => setIpAdress(e.target.value)}
              />
              <div className={styles.shelfContainer}>
                <p>Anzahl Fächer:</p>
                <input type="number" className={styles.compartmentNumberInput} value={countCompartment}
                onChange={(e)=>setCountCompartment(e.target.value)} />                
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <button className="secondaryButton" onClick={onClose}>
                Abbrechen
              </button>
              <button
                className="primaryButton"
                onClick={() => createController()}
              >
                Hinzufügen
              </button>
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};
AddDeviceForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};
export default AddDeviceForm;
