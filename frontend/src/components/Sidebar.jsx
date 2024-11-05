import React, { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import MainNav from "./MainNav.jsx";
import styles from "../styles/Sidebar/sidebar.module.css";

const Sidebar = () => {
  // Initialize state within the component
  const [version, setVersion] = useState("");

  useEffect(() => {
    setVersion(__APP_VERSION__);
  }, []);

  return (
    <aside className={styles.container}>
      <div className={styles.content}>
        <Logo />
        <MainNav />
       </div>
      <p style={{ color: "White", marginLeft: "1rem" }}>V.{version}</p>
    </aside>
  );
};

export default Sidebar;
