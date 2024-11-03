import React from "react";
import styles from "../../styles/User/deleteUserForm.module.css";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { useConfig } from "../../ConfigProvider";

const DeleteUserForm = ({ onClose, setDeleteUser, name, userid }) => {
  const config = useConfig();
  const { backendUrl } = config || {};

  const handleDelete = () => {
    deleteUser();
  };
  const handleAbort = () => {
    setDeleteUser(false);
    onClose();
  };
  const deleteUser = async () => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/deleteUser`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        userid,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.serverStatus == 2) {
          toast.success("Benutzer wurde gelöscht.");
          setDeleteUser(true);
          onClose();
        } else {
          toast.error("Benutzer konnte nicht gelöscht werden.");
          setDeleteUser(false);
        }
      });
  };
  
  return (
    <div className={styles.container}>
      <h3>Benutzer entfernen</h3>
      <div className={styles.content}>
        <p>
          {name === undefined
            ? "Benutzer wurde nicht gefunden"
            : "Wollen Sie den Benutzer " + name + " wirklich entfernen?"}
        </p>
        <div className={styles.buttonContainer}>
          <button className="secondaryButton" onClick={handleAbort}>
            Nein
          </button>
          <button className="primaryButton" onClick={handleDelete}>
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteUserForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  userid: PropTypes.node.isRequired,
  name: PropTypes.node.isRequired,
  setDeleteUser: PropTypes.func.isRequired,
};

export default DeleteUserForm;
