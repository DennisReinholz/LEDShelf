import React, { useContext } from "react";
import styles from "../styles/header.module.css";
import { UserContext } from "../helpers/userAuth.jsx";

const Header = () => {
  // eslint-disable-next-line no-unused-vars
  const {user, setUser, token} = useContext(UserContext);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.username}>
          {user != undefined ? user.username : "Unbekannt"}
        </p>
        <p>Rolle: {user != undefined ? user.role : "keine Rolle"}</p>
      </div>
    </div>
  );
};

export default Header;
