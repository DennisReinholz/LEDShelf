import React, { useState } from "react";
import { TbPlugConnected } from "react-icons/tb";
import { Tooltip } from "react-tooltip";
import styles from "../../styles/Device/foundedDevices.module.css";
import PropTypes from "prop-types";
import { useConfig } from "../../ConfigProvider";
import toast from "react-hot-toast";

const FoundedDevice = ({ deviceName, deviceAddress, setControllerAdded, onClose }) => {
    const [loading, setLoading] = useState(false);
     // eslint-disable-next-line no-unused-vars
    const [countCompartment, setCountCompartment] = useState();
    const config = useConfig();
    const { backendUrl } = config || {};

    const createController = async () => {
        setLoading(true);
        try {
            const isAvaiable = await pingController();
            await new Promise(resolve => setTimeout(resolve, 2000));
            if (isAvaiable) {
                await fetch(`http://${backendUrl === undefined ? config.localhost : backendUrl}:3000/createLedController`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "no-cache",
                    body: JSON.stringify({
                        ipAdress: deviceAddress,
                        countCompartment: countCompartment,
                    }),
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.serverStatus === 2) {
                        setControllerAdded(true);
                        toast.success("Controller wurde erfolgreich hinzugefügt");
                        onClose();
                    } else if (data.serverStatus !== 2) {
                        toast.error("Controller wurde nicht hinzugefügt");
                        setControllerAdded(false);
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
            const response = await fetch(`http://${backendUrl === undefined ? config.localhost : backendUrl}:3000/pingController`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ip: deviceAddress }),
                cache: "no-cache",
            });
            const data = await response.json();          
            return data.serverStatus === 2;
        } catch (error) {
            console.error("Error pinging the controller:", error);
            return false;
        }
    };

    return (
        <div className={styles.deviceContainer}>
            <div className={styles.content}>
                <p>{deviceName}</p>
                <p>{deviceAddress}</p>
            </div>           
            <div className={styles.connectContainer}>
                <Tooltip anchorSelect=".connectIcon" place="left">
                    Mit Controller verbinden
                </Tooltip>

                {loading ? (
                    <div className={styles.loadingBar}></div>
                ) : (
                    
                    <TbPlugConnected
                        className="connectIcon"
                        style={{ fontSize: "2rem", cursor: "pointer" }}
                        onClick={() => createController()}/>                            
                )}
            </div>
        </div>
    );
};

FoundedDevice.propTypes = {
    deviceName: PropTypes.string.isRequired,
    deviceAddress: PropTypes.string.isRequired,
    setControllerAdded: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default FoundedDevice;
