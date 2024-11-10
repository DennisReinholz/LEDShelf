import React,{ useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/deviceLayout.module.css";
import Device from "../components/Device/Device";
import Modal from "../components/common/Modal";
import AddDeviceForm from "../components/Device/AddDeviceForm";
import { UserContext } from "../helpers/userAuth";
import { useConfig } from "../ConfigProvider";

const DeviceLayout = () => {
   // eslint-disable-next-line no-unused-vars
  const [shelfList, setShelfList] = useState([]);
   // eslint-disable-next-line no-unused-vars
   const [controllerList, setControllerList] = useState([]);
   // eslint-disable-next-line no-unused-vars
  const {user, setUser, token} = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const config = useConfig();
  const navigate = useNavigate();
  const { backendUrl } = config || {};

  const getShelf = async () => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/getShelf`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((shelf) => {
        setShelfList(shelf);
      });
  };
  const getController = async () => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/getController`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((controller) => {
        setControllerList(controller);
      });
  };

  useEffect(() => {
    getShelf();
    getController();
    const userStorage = localStorage.getItem("user");
    if (
      userStorage !== undefined ||
      (userStorage !== null && user === undefined)
    ) {
      setUser(JSON.parse(userStorage));
    }
    if (userStorage === null) {
      navigate("/login");
    }
  }, [controllerList]);

  return (
    <div className={styles.container}>
      <button
        className="primaryButton"
        style={{ marginLeft: "1rem", marginTop: "1rem", width: "10rem" }}
        onClick={() => setIsModalOpen(true)}
      >
        Hinzufügen
      </button>
      <div className={styles.content}>
        {controllerList != undefined
          ? controllerList.map((controller) => (
              <Device
                key={controller.ledControllerid}
                deviceId={controller.ledControllerid}
                ip={controller.ipAdresse}
                compartment={controller.numberCompartment}
                status={controller.status}
                shelfName={controller.shelfname}
                shelfid={controller.shelfid}
                place={controller.place}
                setEditModalIsOpen={setEditModalIsOpen}
                editModalIsOpen={editModalIsOpen}
                onClose={() => setEditModalIsOpen(false)}
              />
            ))
          : "Keine Controller gefunden"}
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <AddDeviceForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default DeviceLayout;
