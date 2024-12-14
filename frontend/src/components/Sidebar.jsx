import React, { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import MainNav from "./MainNav.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = () => {
  // Initialize state within the component
  const [version, setVersion] = useState("");

  useEffect(() => {
    setVersion(__APP_VERSION__);
  }, []);

  return (
    <aside className="d-flex flex-column bg-dark text-white p-3 vh-100">
      <div className="flex-grow-1">
        <Logo />
        <MainNav />
      </div>
      <p className="text-white m-0">V.{version}</p>
    </aside>
  );
};

export default Sidebar;
