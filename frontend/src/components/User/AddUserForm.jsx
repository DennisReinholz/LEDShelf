import React, { useEffect, useState } from "react";
import styles from "../../styles/User/addUserForm.module.css";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

const AddUserForm = ({ onClose, setCreateUser }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [createEnabled, setCreateEnabled] = useState(false);
  const [roles, setRoles] = useState();
  const [selectedRole, setSelectedRole] = useState(1);

  const handleCreateUser = () => {
    if (
      name != null &&
      name != undefined &&
      name.length > 0 &&
      password != null &&
      password != undefined &&
      password.length > 0
    ) {
      setCreateEnabled(true);
    } else {
      setCreateEnabled(false);
    }
  };
  const createUser = async () => {
    return await fetch(`http://localhost:3000/createUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify({ name, password, roleid: selectedRole }),
    }).then((result) => {
      if (result.status === 200) {
        toast.success("Benutzer wurde erstellt.");
        setCreateUser(true);
        onClose();
      } else {
        toast.error("Benutzer konnte nicht erstellt werden.");
        setCreateUser(false);
      }
    });
  };
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
  useEffect(() => {
    getRoles();
    handleCreateUser();
  }, [name, password]);

  return (
    <div className={styles.container}>
      <h3>Benutzer hinzufügen</h3>
      <div className={styles.contentContainer}>
        <p>Benutzername:</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="Text"
          placeholder="name"
          className={styles.inputField}
        />
      </div>

      <div className={styles.contentContainer}>
        <p>Passwort:</p>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          className={createEnabled ? "primaryButton" : "disabledButton"}
          disabled={!createEnabled}
          onClick={() => createUser()}
        >
          Erstellen
        </button>
      </div>
    </div>
  );
};
AddUserForm.propTypes = {
  onClose: PropTypes.node.isRequired,
  setCreateUser: PropTypes.node.isRequired,
};
export default AddUserForm;
