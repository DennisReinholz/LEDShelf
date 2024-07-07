import React, { useEffect, useState } from "react";
import styles from "../styles/deviceLayout.module.css";
import Device from "../components/Devices/Device";
import ControllerLayout from "./ControllerLayout";
import Modal from "../components/common/Modal";
import AddDeviceForm from "../components/Devices/AddDeviceForm";

const DeviceLayout = () => {
  const [shelfList, setSehlefList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getShelf = async () => {
    const response = await fetch(`http://localhost:3000/getShelf`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((shelf) => {
        setSehlefList(shelf);
      });
  };
  useEffect(() => {
    getShelf();
  }, []);
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
        <Device shelfList={shelfList} />
        {/* <ControllerLayout /> */}
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
