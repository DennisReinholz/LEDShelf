import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from "../../styles/Article/addArticleForm.module.css";

const AddArticleForm = ({ onClose, setArticleCreated }) => {
  const [articlename, setArticlename] = useState("");
  const [amount, setAmount] = useState(0);
  const [unit, setUnit] = useState();
  const [shelf, setShelf] = useState();
  const [selectedShelf, setSelectedShlef] = useState();
  const [compartment, setCompartment] = useState();
  const [selectedCompartment, setSelectedCompartment] = useState();
  const [enableCreateButton, setEnableCreateButton] = useState(true);

  const getShelf = async () => {
    const response = await fetch(`http://localhost:3000/getShelf`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((shelf) => {
        setShelf(shelf);
      });
  };
  const getCompartments = async (shelfid) => {
    const response = await fetch(`http://localhost:3000/getCompartment`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        shelfid,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCompartment([...data.result].sort((a, b) => a.number - b.number));
      });
  };

  const createArticle = async () => {
    return await fetch(`http://localhost:3000/createArticle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify({
        articlename,
        amount,
        unit,
        selectedShelf,
        selectedCompartment,
      }),
    }).then((result) => {
      if (result.status === 200) {
        setArticleCreated(true);
        toast.success("Ein neuer Artikel wurde erstellt");
        onClose();
      } else {
        setArticleCreated(false);
        toast.error("Es konnte kein Artikel erstellt werden");
      }
    });
  };
  const checkFrom = () => {
    if (
      articlename === null ||
      (articlename === undefined && amount === null) ||
      (amount === undefined && unit === null) ||
      (unit == undefined && selectedShelf === null) ||
      (selectedShelf === undefined && selectedCompartment === null) ||
      selectedCompartment === undefined
    ) {
      setEnableCreateButton(true);
    } else {
      setEnableCreateButton(false);
    }
  };

  const handleShelfSelection = (e) => {
    setSelectedShlef(e);
    getCompartments(e);
  };

  useEffect(() => {
    getShelf();
    checkFrom();
  }, [
    articlename,
    selectedCompartment,
    selectedShelf,
    amount,
    unit,
    enableCreateButton,
  ]);
  return (
    <div className={styles.container}>
      <h2>Erstelle einen Artikel</h2>
      <div className={styles.content}>
        <input
          className={styles.input}
          type="text"
          placeholder="Artikelname"
          value={articlename}
          onChange={(e) => setArticlename(e.target.value)}
          style={{ height: "2rem", fontSize: "0.75em" }}
        />
        <input
          className={styles.input}
          type="number"
          placeholder="Menge"
          defaultValue={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ height: "2rem", fontSize: "0.75em" }}
        />
        <select
          style={{ fontSize: "0.75em" }}
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="Stück">Stück</option>
          <option value="Meter">Meter</option>
          <option value="Zentimeter">Zentimeter</option>
          <option value="Kilogramm">Kilogramm</option>
        </select>
      </div>
      <div className={styles.shelfSelection}>
        <select
          style={{ fontSize: "0.75em", height: "2rem", width: "10rem" }}
          value={selectedShelf}
          onChange={(e) => handleShelfSelection(e.target.value)}
        >
          {shelf !== undefined ? (
            shelf.result.map((s) => (
              <option key={s.shelfid} value={s.shelfid}>
                {s.shelfname}
              </option>
            ))
          ) : (
            <option>Kein Regal gefunden</option>
          )}
        </select>
        <select
          style={{ fontSize: "0.75em", height: "2rem", width: "10rem" }}
          value={selectedCompartment}
          onChange={(e) => setSelectedCompartment(e.target.value)}
        >
          {compartment !== undefined ? (
            compartment.map((c) => (
              <option key={c.compartmentId} value={c.compartmentId}>
                {c.compartmentname}
              </option>
            ))
          ) : (
            <option>Kein Fach gefunden</option>
          )}
        </select>
      </div>
      <div className={styles.buttonContainer}>
        <button className="secondaryButton" onClick={onClose}>
          Abbrechen
        </button>
        <button
          className={enableCreateButton ? "disabledButton" : "primaryButton"}
          style={{ marginRight: "1rem" }}
          onClick={createArticle}
          disabled={enableCreateButton}
        >
          Erstellen
        </button>
      </div>
    </div>
  );
};

export default AddArticleForm;
