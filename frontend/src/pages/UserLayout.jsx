import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/userLayout.module.css";
import { Toaster } from "react-hot-toast";
import User from "../components/User/User";
import Modal from "../components/common/Modal.jsx";
import AddUserForm from "../components/User/AddUserForm.jsx";
import { UserContext } from "../helpers/userAuth.jsx";
import { useConfig } from "../ConfigProvider";

const UserLayout = () => {
  const {user, setUser, token} = useContext(UserContext);
  const [users, setUsers] = useState();
  const [addUserIsOpen, setAddUserIsOpen] = useState();
  const [createUser, setCreateUser] = useState();
  const [deleteUser, setDeleteUser] = useState();
  const [editUser, setEditUser] = useState();
  const config = useConfig();
  const { backendUrl } = config || {};
  const navigate = useNavigate();

  const getUser = async () => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/getAllUser`, {
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
  }, [createUser, deleteUser, editUser, users]);
  return (
    <div className={styles.content}>
      <button
        style={{ marginLeft: "1rem", marginTop: "1rem" }}
        className="primaryButton"
        onClick={() => setAddUserIsOpen((o) => !o)}
      >
        Add User
      </button>
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <div className={styles.userContainer}>
            {users !== undefined
              ? users.map((u, index) => (                 
                    <User key={index}
                      userid={u.userid}
                      name={u.username}
                      role={u.name}
                      setDeleteUser={setDeleteUser}
                      setEditUser={setEditUser}
                    />                 
                ))
              : "kein user angemeldet"}
          </div>
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
