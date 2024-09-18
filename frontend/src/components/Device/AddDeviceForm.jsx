import React, { useEffect, useState } from "react";
import styles from "../../styles/Device/addDeviceForm.module.css";
import toast from "react-hot-toast";
import Spinner from "../common/Spinner.jsx";
import PropTypes from "prop-types";

const AddDeviceForm = ({ onClose }) => {
  const [ipAdress, setIpAdress] = useState();
  const [shelfid, setShelfid] = useState();
  const [shelfList, setShelfList] = useState();
  const [loading, setLoading] = useState(false);

  const getShelf = async () => {
    await fetch(`http://localhost:3000/getShelf`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((shelf) => {
        setShelfList(shelf.result);
      });
  };
  const createController = async () => {
    setLoading(true);
    try {
      const isAvaiable = await pingController();
      if (isAvaiable) {
        await fetch(`http://localhost:3000/createLedController`, {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-cache",
          body: JSON.stringify({
            ipAdress: ipAdress,
            shelf: shelfid !== undefined ? shelfid : "NULL",
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
      } else {
        toast.error("Controller nicht erreichbar");
      }
    } catch (error) {
      toast.error("Controller nicht erreichbar");
    } finally {
      setLoading(false);
    }
  };
  const pingController = async () => {
    try {
      const response = await fetch(`http://localhost:3000/pingController`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ip: ipAdress }),
        cache: "no-cache",
      });
      const data = await response.json();
      return data.serverStatus === 2;
    } catch (error) {
      console.error("Error pinging the controller:", error);
      return false;
    }
  };

  useEffect(() => {
    getShelf();
  }, []);
  return (
    <React.Fragment>
      <div className={styles.container}>
        <h3>Gerät hinzufügen</h3>
        {loading ? (
          <Spinner />
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
                <select
                  className={styles.regalSelection}
                  onChange={(e) => setShelfid(e.target.value)}
                >
                  <option>Regal auswählen</option>
                  {shelfList != undefined ? (
                    shelfList.map((s) => (
                      <option value={s.shelfid} key={s.shelfid}>
                        {s.shelfname}
                      </option>
                    ))
                  ) : (
                    <option>Kein Regal</option>
                  )}
                </select>
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
  onClose: PropTypes.node.isRequired,
};
export default AddDeviceForm;
