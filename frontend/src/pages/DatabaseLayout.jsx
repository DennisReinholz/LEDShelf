import React, { useState, useEffect, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../helpers/userAuth.jsx";
import styles from "../styles/databaseLayout.module.css";
import DatabaseBackup from "../components/Database/DatabaseBackup";

const DatabaseLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    const userStorage = localStorage.getItem("user");
    if (
      userStorage !== undefined ||
      (userStorage !== null && user === undefined)
    ) {
      setUser(JSON.parse(userStorage));
    }
    if (userStorage === null) {
      navigate("/login");
    }
  }, []);
  return (
    <div className={styles.container}>
      <DatabaseBackup />
    </div>
  );
};

export default DatabaseLayout;
