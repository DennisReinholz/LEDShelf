import React, { Fragment, useEffect, useState } from "react";
import styles from "../styles/userLayout.module.css";
import { Toaster } from "react-hot-toast";
import User from "../components/User/User";
import Modal from "../components/common/Modal.jsx";
import AddUserForm from "../components/User/AddUserForm.jsx";
import Main from "./Main.jsx";

const UserLayout = () => {
  const [users, setUsers] = useState();
  const [addUserIsOpen, setAddUserIsOpen] = useState();
  const [createUser, setCreateUser] = useState();
  const [deleteUser, setDeleteUser] = useState();
  const [editUser, setEditUser] = useState();

  const getUser = async () => {
    const response = await fetch(`http://localhost:3000/getAllUser`, {
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
  }, [createUser, deleteUser, editUser]);
  return (
    <div className={styles.content}>
      <button
        style={{ marginLeft: "1rem" }}
        className="primaryButton"
        onClick={() => setAddUserIsOpen((o) => !o)}
      >
        Add User
      </button>
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <div className={styles.contentHeader}>
            <h3>Benutzer verwalten</h3>
          </div>
          <div className={styles.userContainer}>
            {users !== undefined
              ? users.map((u, index) => (
                  <Fragment key={index}>
                    <User
                      userid={u.userid}
                      name={u.username}
                      role={u.name}
                      setDeleteUser={setDeleteUser}
                      setEditUser={setEditUser}
                    />
                  </Fragment>
                ))
              : "kein user angemeldet"}
          </div>
          {/* <Main /> */}
        </div>
        {addUserIsOpen && (
          <Modal onClose={() => setAddUserIsOpen(false)}>
            <AddUserForm
              onClose={() => setAddUserIsOpen(false)}
              setCreateUser={setCreateUser}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default UserLayout;
