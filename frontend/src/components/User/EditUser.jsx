import React, { useEffect, useState } from "react";
import styles from "../../styles/User/editUserForm.module.css";
import toast from "react-hot-toast";

const EditUser = ({ userid, onClose, name, role }) => {
  const [newName, setNewName] = useState();
  const [newPassword, setNewPassword] = useState();
  const [roles, setRoles] = useState();
  const [selectedRole, setSelectedRole] = useState();
  const [userData, setUserData] = useState();

  const getRoles = async () => {
    return await fetch(`http://localhost:3000/getRoles`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.length > 0) {
          setRoles(response);
        } else {
          toast.error("Fehler bei Datenbank abfrage.");
        }
      });
  };
  const getUserData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/getUserData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
        body: JSON.stringify({
          userid,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.length > 0) {
            setUserData(response[0]);
          } else if (response === 500) {
            toast.error("Es konnten keine Benutzerdaten geladen werden.");
          }
        })
        .catch((error) =>
          console.error("Fehler beim Abrufen der Benutzerdaten:", error)
        );
    } catch (error) {
      toast.error(
        "Fehler bei Abfrage aus Datenbank, bitte starten Sie den Backend server neu."
      );
    }
  };
  const updateUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/updateUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
        body: JSON.stringify({
          userid,
          username:
            newName != undefined && newName.length != 0
              ? newName
              : userData.username,
          password:
            newPassword != undefined && newPassword.length != 0
              ? newPassword
              : userData.password,
          role:
            selectedRole != undefined && newPassword.length != 0
              ? newPassword
              : userData.role,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.serverStatus === 2) {
            toast.success("Benutzer wurde aktualisiert.");
          } else if (response.serverStatus === -2) {
            toast.error("Aktualisierung fehlgeschlagen.");
          }
        })
        .catch((error) =>
          console.error("Fehler beim Abrufen der Benutzerdaten:", error)
        );
    } catch (error) {
      toast.error(
        "Fehler bei Abfrage aus Datenbank, bitte starten Sie den Backend server neu."
      );
    }
  };

  useEffect(() => {
    getUserData();
    getRoles();
  }, [newPassword, newName, selectedRole]);
  return (
    <div className={styles.container}>
      <h3>Benutzer bearbeiten</h3>
      <div className={styles.contentContainer}>
        <p>Benutzername:</p>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          type="Text"
          placeholder={name}
          className={styles.inputField}
        />
      </div>

      <div className={styles.contentContainer}>
        <p>Passwort:</p>
        <input
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="Text"
          placeholder="passwort"
          className={styles.inputField}
        />
      </div>
      <div className={styles.contentContainer}>
        <p>Rolle:</p>
        <select
          value={selectedRole}
          className={styles.roleSelection}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {roles !== undefined && roles.length >= 0 ? (
            roles.map((r) => (
              <option key={r.roleid} value={r.roleid}>
                {r.name}
              </option>
            ))
          ) : (
            <option>Keine Rolle gefunden</option>
          )}
        </select>
      </div>
      <div className={styles.buttonContainer}>
        <button className="secondaryButton" onClick={onClose}>
          Abbrechen
        </button>
        <button
          className="primaryButton"
          style={{ width: "8rem" }}
          onClick={() => updateUser()}
        >
          Aktualisieren
        </button>
      </div>
    </div>
  );
};

export default EditUser;
