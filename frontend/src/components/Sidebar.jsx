import React, { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import MainNav from "./MainNav.jsx";
import styles from "../styles/Sidebar/sidebar.module.css";

const Sidebar = () => {
  const [version, setVersion] = useState("");

  useEffect(() => {
    fetch("/package.json")
      .then((response) => response.json())
      .then((data) => {
        setVersion(data.version);
      })
      .catch((error) => {
        console.error("Error fetching version:", error);
      });
  }, []);

  return (
    <aside className={styles.container}>
      <div className={styles.content}>
        <Logo />
        <MainNav />
      </div>
      <p style={{ color: "White" }}>Version {version}</p>
    </aside>
  );
};

export default Sidebar;
