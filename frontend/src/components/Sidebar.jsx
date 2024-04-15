import React from "react";
import Logo from "../components/Logo.jsx";
import MainNav from "./MainNav.jsx";
import styles from "../styles/Sidebar/sidebar.module.css";

const Sidebar = () => {
  return (
    <aside className={styles.container}>
      <Logo />
      <MainNav />
    </aside>
  );
};

export default Sidebar;
