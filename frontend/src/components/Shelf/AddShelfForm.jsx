import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from "../../styles/Shelf/addShelfForm.module.css";

const AddShelfForm = ({ onClose, shelflist, setShelflist }) => {
  const [CountCompartment, setCountCompartment] = useState();
  const [shelfname, setShelfname] = useState();
  const [shelfPlace, setShelfPlace] = useState();
  const [createButtonEnabled, setCreateButtonEnabled] = useState(true);

  const createShelf = async () => {
    return await fetch(`http://localhost:3000/createShelf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify({ shelfname, shelfPlace, CountCompartment }),
    }).then((result) => {
      if (result.status === 200) {
        toast.success("Ein neues Regal wurde erstellt");
        onClose();
      } else {
        toast.error("Es konnte kein Regal erstellt werden");
      }
    });
  };
  const handleCreateButtonEnabled = () => {
    if (
      shelfname != undefined &&
      shelfname.length > 0 &&
      shelfPlace != undefined &&
      shelfPlace.length > 0 &&
      CountCompartment != undefined &&
      CountCompartment >= 0
    ) {
      setCreateButtonEnabled(false);
    } else {
      setCreateButtonEnabled(true);
    }
  };

  useEffect(() => {
    handleCreateButtonEnabled();
  }, [shelfname, shelfPlace, CountCompartment]);

  return (
    <div className={styles.container}>
      <h2 style={{ color: "white" }}>Erstelle ein Regal</h2>
      <div className={styles.content}>
        <p>Wie soll das Regal heißen?</p>
        <input
          className={styles.formInput}
          placeholder="Regalname"
          value={shelfname}
          onChange={(e) => setShelfname(e.target.value)}
        />
      </div>
      <div className={styles.content}>
        <p>Wo steht das Regal?</p>
        <input
          className={styles.formInput}
          placeholder="Ort im Gebäude"
          value={shelfPlace}
          onChange={(e) => setShelfPlace(e.target.value)}
        />
      </div>
      <div className={styles.content}>
        <p>Wie viele Fächer hat das Regal?</p>
        <input
          className={styles.inputNumber}
          type="number"
          defaultValue={1}
          value={CountCompartment}
          onChange={(e) => setCountCompartment(e.target.value)}
        />
      </div>
      <div className={styles.buttonContainer}>
        <button className="secondaryButton" onClick={onClose}>
          Abbrechen
        </button>
        <button
          className={!createButtonEnabled ? "primaryButton" : "disabledButton"}
          disabled={createButtonEnabled}
          onClick={createShelf}
        >
          Erstellen
        </button>
      </div>
    </div>
  );
};

export default AddShelfForm;
