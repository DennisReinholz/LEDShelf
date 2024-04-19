import React, { Fragment, useEffect, useState } from "react";
import styles from "../styles/userLayout.module.css";
import { Toaster } from "react-hot-toast";
import User from "../components/User/User";
const UserLayout = () => {
  const [users, setUsers] = useState();
  const [addUserIsOpen, setAddUserIsOpen] = useState();

  const getUser = async () => {
    const response = await fetch(`http://localhost:3000/getUser`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.serverStatus == 2) {
          setUsers(data.result);
        } else {
          Toaster.error(
            "User konnten nicht geladen werden. Bitte überprüfen Sie den Backend Server."
          );
        }
      });
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={() => console.log("test")}>
        Add User
      </button>
      <div className={styles.contentContainer}>
        <div className={styles.contentHeader}>
          <h3>Benutzer verwalten</h3>
        </div>
        <div className={styles.userContainer}>
          {users !== undefined
            ? users.map((u, index) => (
                <Fragment key={index}>
                  <User name={u.username} role={u.name} />
                </Fragment>
              ))
            : "kein user angemeldet"}
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
