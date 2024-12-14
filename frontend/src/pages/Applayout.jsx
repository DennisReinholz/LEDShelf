import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

const Applayout = () => {
  return (
    <div className="d-flex flex-row vh-100 vw-100">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column bg-dark text-white">
        <Header />
        <div className="flex-grow-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Applayout;
