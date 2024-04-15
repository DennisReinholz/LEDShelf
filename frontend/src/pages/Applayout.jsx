import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import styles from "../styles/applayout.module.css";

const Applayout = () => {
  return (
    <div className={styles.applayout}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default Applayout;
