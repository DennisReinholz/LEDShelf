import React from "react";
import styles from "../../styles/User/deleteUserForm.module.css";
import toast from "react-hot-toast";

const DeleteUserForm = ({ onClose, setDeleteUser, name, userid }) => {
  const handleDelete = () => {
    deleteUser();
  };
  const handleAbort = () => {
    setDeleteUser(false);
    onClose();
  };
  const deleteUser = async () => {
    const response = await fetch(`http://localhost:3000/deleteUser`, {
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
            : "Wollen Sie den " + name + " wirklich entfernen?"}
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

export default DeleteUserForm;
