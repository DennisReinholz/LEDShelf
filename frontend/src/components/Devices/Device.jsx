import React, { useEffect, useState } from "react";
import styles from "../../styles/Device/device.module.css";

const Device = ({ shelfList }) => {
  const [assignedShelf, setAssignedShelf] = useState();
  const [assignedIsOpen, setAssignedIsOpen] = useState(false);
  const [wasAssigned, setWasAssigned] = useState(false);

  const handleAssignOpen = () => {
    if (assignedIsOpen) {
      //API CALL
      setShelfToController();
      setWasAssigned(true);
      setAssignedIsOpen(false);
    } else {
      setAssignedIsOpen(true);
    }
  };
  const setShelfToController = async () => {};
  useEffect(() => {}, [assignedShelf, wasAssigned]);
  return (
    <div
      className={
        assignedIsOpen ? styles.container : styles.assignedIsOpenContainer
      }
    >
      <div className={styles.containerParameter}>
        <p>Zugewiesenes Regal:</p>
        <p>IP-Adresse:</p>
        <p>Verfügbare Fächer:</p>
        <p>Status:</p>
      </div>
      <div className={styles.containerValues}>
        <p>{!wasAssigned ? "Kein Regal zugewiesen" : assignedShelf}</p>
        <p>127.0.0.0.1</p>
        <p>15</p>
        <p>Nicht verbunden</p>
      </div>
      <div
        className={assignedIsOpen ? styles.declareShelf : styles.assignedIsOpen}
      >
        <button className="primaryButton" onClick={handleAssignOpen}>
          {assignedIsOpen ? "Setzen" : "Zuweisen"}
        </button>
        {assignedIsOpen && (
          <select
            className={styles.shelfSelection}
            value={assignedShelf}
            onChange={(e) => setAssignedShelf(e.target.value)}
          >
            {shelfList.result !== undefined ? (
              shelfList.result.map((s) => (
                <option key={s.shelfid} value={s.shelfname}>
                  {s.shelfname}
                </option>
              ))
            ) : (
              <option>Kein Regal gefunden</option>
            )}
          </select>
        )}
      </div>
    </div>
  );
};

export default Device;
