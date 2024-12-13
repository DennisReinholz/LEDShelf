import React, {useEffect, useState} from "react";
import styles from "../../styles/Device/searchDeviceForm.module.css";
import { useConfig } from "../../ConfigProvider";
import FoundedDevice from "./FoundedDevice";
import PropTypes from "prop-types";

const SearchDeviceForm = ({onClose}) => {
    const [searchDevice, setSearchDevice] = useState([]);
    const [controllerAdded, setControllerAdded] = useState();
    const config = useConfig();
    const { backendUrl } = config || {};

    const searchDevices = async () => {
        try {
          await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/searchDevice`, {
          method: "Get",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-cache",
        })
          .then((response) => response.json())
          .then((device) => {
            setSearchDevice(device.devices);
          });
        } catch (error) {
          console.log(error);
        }
      };

      useEffect(() => {
        if (searchDevice !== undefined && searchDevice.length === 0) {
          searchDevices();          
        }
    }, [searchDevice, controllerAdded]);

  return (
    <div className={styles.container}>
        <div className={styles.headerContainer}>
            <h2>Controller suchen</h2>
        </div>
        <div className={styles.deviceList}>          
          {searchDevice !== undefined && searchDevice.length > 0 ? (
            searchDevice.map((d) => (           
                <FoundedDevice key={d.index} deviceName={d.name} deviceAddress={d.address} setControllerAdded={setControllerAdded} onClose={onClose}/>
              ))
               ) : (
                <p>Suche Controller...</p>
                )}
           
        </div>
    </div>
  );
};
SearchDeviceForm.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default SearchDeviceForm;