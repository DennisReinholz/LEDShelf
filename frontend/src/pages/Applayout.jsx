import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import styles from "../styles/applayout.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Applayout = () => {
  return (
    <div className="container-fluid d-flex p-0">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column bg-dark">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default Applayout;
