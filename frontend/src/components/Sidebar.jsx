import React, { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import MainNav from "./MainNav.jsx";
import styles from "../styles/Sidebar/sidebar.module.css";

useEffect(() => {
  fetch("/package.json")
  .then((response) => response.json())
  .then((data) => {
  setDevVersion(data.version);
  })
  .catch((error) => {
  console.error("Error fetching version:", error);
  });
  }, []);

  const Sidebar = () => {
  // Initialize state within the component
  const [devVersion, setDevVersion] = useState("");
  
  // Use the injected version from the environment variable
  const version = process.env.REACT_APP_VERSION || devVersion;

  return (
    <aside className={styles.container}>
      <div className={styles.content}>
        <Logo />
        <MainNav />
      </div>
      <p style={{ color: "White" }}>v.{version}</p>
    </aside>
  );
};

export default Sidebar;
