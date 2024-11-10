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
   // eslint-disable-next-line no-unused-vars
  const { user, setUser, token } = useContext(UserContext);
  const [users, setUsers] = useState();
  const [addUserIsOpen, setAddUserIsOpen] = useState();
  const [createUser, setCreateUser] = useState();
  const [deleteUser, setDeleteUser] = useState();
  const [editUser, setEditUser] = useState();
  const [numberAdmin, setNumberAdmin] = useState(0);
  const config = useConfig();
  const { backendUrl } = config || {};
  const navigate = useNavigate();

  const getNumberOfAdmins = (list) => {
    const adminCount = list.filter((element) => element.role === 1).length;
    setNumberAdmin(adminCount);
  };

  const getUser = async () => {
    await fetch(`http://${backendUrl || config.localhost}:3000/getAllUser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.serverStatus === 2) {
          setUsers(data.result);
          getNumberOfAdmins(data.result);
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
    if (userStorage && user === undefined) {
      setUser(JSON.parse(userStorage));
    }
    if (!userStorage) {
      navigate("/login");
    }
  }, [createUser, deleteUser, editUser]);

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
            {users
              ? users.map((u, index) => (
                  <User
                    key={index}
                    userid={u.userid}
                    name={u.username}
                    role={u.role}
                    setDeleteUser={setDeleteUser}
                    setEditUser={setEditUser}
                    lastadmin={numberAdmin === 1 && u.role === 1}
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
