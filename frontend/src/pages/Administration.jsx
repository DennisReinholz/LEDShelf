import React, { useState } from "react";
import UserLayout from "./UserLayout";
import DeviceLayout from "./DeviceLayout";
import ServiceLayout from "./ServiceLayout";
import CategoryLayout from "./CategoryLayout";
import { HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineSignal } from "react-icons/hi2";
import { HiOutlineQrCode } from "react-icons/hi2";
import { MdOutlineContactSupport } from "react-icons/md";
import { HiOutlineCircleStack } from "react-icons/hi2";
import styles from "../styles/administration.module.css";
import DatabaseLayout from "./DatabaseLayout.jsx";

const Administration = () => {
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${
            activeTab === "1" ? styles.activeTab : ""
          }`}
          onClick={() => handleTabChange("1")}
        >
          <p>Benutzer</p>
          <HiOutlineUsers />
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "2" ? styles.activeTab : ""
          }`}
          onClick={() => handleTabChange("2")}
        >
          <p>Geräte</p>
          <HiOutlineSignal />
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "3" ? styles.activeTab : ""
          }`}
          onClick={() => handleTabChange("3")}
        >
          <p>Service</p>
          <MdOutlineContactSupport />
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "4" ? styles.activeTab : ""
          }`}
          onClick={() => handleTabChange("4")}
        >
          <p>Kategorie</p>
          <HiOutlineQrCode />
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "5" ? styles.activeTab : ""
          }`}
          onClick={() => handleTabChange("5")}
        >
          <p>Datenbank</p>
          <HiOutlineCircleStack />
        </div>
      </div>
      <div className={styles.tabContent}>
        {activeTab === "1" && (
          <div>
            <UserLayout />
          </div>
        )}
        {activeTab === "2" && (
          <div>
            <DeviceLayout />
          </div>
        )}
        {activeTab === "3" && (
          <div>
            <ServiceLayout />
          </div>
        )}
        {activeTab === "4" && (
          <div>
            <CategoryLayout />
          </div>
        )}
        {activeTab === "5" && (
          <div>
            <DatabaseLayout />
          </div>
        )}
      </div>
    </div>
  );
};

export default Administration;
