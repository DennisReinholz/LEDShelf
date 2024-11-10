import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../helpers/userAuth.jsx";
import styles from "../styles/databaseLayout.module.css";
import DatabaseBackup from "../components/Database/DatabaseBackup";
import RecoryDatabase from "../components/Database/RecoryDatabase.jsx";

const DatabaseLayout = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const {user, setUser, token} = useContext(UserContext);

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
      <RecoryDatabase />
    </div>
  );
};

export default DatabaseLayout;
