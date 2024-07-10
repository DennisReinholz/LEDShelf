import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from "../../styles/Article/addArticleForm.module.css";

const AddArticleForm = ({ onClose, setArticleCreated }) => {
  const [articlename, setArticlename] = useState("");
  const [amount, setAmount] = useState(0);
  const [unit, setUnit] = useState();
  const [shelf, setShelf] = useState();
  const [selectedShelf, setSelectedShelf] = useState();
  const [compartment, setCompartment] = useState();
  const [selectedCompartment, setSelectedCompartment] = useState();
  const [enableCreateButton, setEnableCreateButton] = useState(true);
  const [categoryList, setCategoryList] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [companyName, setCompanyName] = useState();
  const [commissiongoods, setCommissiongoods] = useState();

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
        if (selectedShelf === undefined) {
          handleShelfSelection(shelf.result[0].shelfid);
        }
      });
  };
  const getCompartments = async (shelfid) => {
    const response = await fetch(
      `http://localhost:3000/getArticleCompartments`,
      {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
        body: JSON.stringify({
          shelfid,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.result != undefined) {
          if (data.result[0] != undefined) {
            setCompartment(
              [...data.result].sort((a, b) => a.number - b.number)
            );
            if (selectedCompartment === undefined) {
              setSelectedCompartment(data.result[0].compartmentId);
            }
          } else {
            setCompartment([]);
          }
        }
      });
  };
  const getCategory = async () => {
    const response = await fetch(`http://localhost:3000/getCategory`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((data) => {
        setCategoryList(data.data.result);
        setSelectedCategory(data.data.result[0].categoryid);
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
        selectedCategory,
        companyName,
        commissiongoods,
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
      (articlename === null ||
        articlename === undefined ||
        articlename.length === 0) &&
      (amount === null || amount === undefined) &&
      (unit === "undefinded" || unit === undefined) &&
      (selectedShelf === null || selectedShelf === undefined) &&
      (selectedCompartment === null || selectedCompartment === undefined)
    ) {
      setEnableCreateButton(true);
    } else {
      setEnableCreateButton(false);
    }
  };
  const handleShelfSelection = (e) => {
    setSelectedShelf(e);
    getCompartments(e);
  };

  useEffect(() => {
    getShelf();
    checkFrom();
    getCategory();
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
        />
        <div>
          <input
            style={{ width: "3rem" }}
            className="inputText"
            type="number"
            placeholder="Menge"
            defaultValue={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            className={styles.unitSelection}
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="undefined">Einheit</option>
            <option value="Stück">Stück</option>
            <option value="Meter">Meter</option>
            <option value="Zentimeter">Zentimeter</option>
            <option value="Kilogramm">Kilogramm</option>
          </select>
        </div>
      </div>
      <div className={styles.addFormRow}>
        <input
          className="inputText"
          type="text"
          placeholder="Firma"
          defaultValue={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          style={{ width: "17rem" }}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            className="inputText"
            placeholder="Kommissions text"
            type="text"
            value={commissiongoods}
            onChange={(e) => setCommissiongoods(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.shelfSelection}>
        <select
          className={styles.shelfSelect}
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
          className={styles.compartmentSelect}
          value={selectedCompartment}
          onChange={(e) => setSelectedCompartment(e.target.value)}
        >
          {compartment.length === 0 ? <option>Kein freies Regal</option> : ""}
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
        {/* Category */}
        <select
          className={styles.categorySelect}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="null">Keine Kategorie</option>
          {categoryList !== undefined ? (
            categoryList.map((c) => (
              <option key={c.categoryid} value={c.categoryid}>
                {c.categoryname}
              </option>
            ))
          ) : (
            <option>Keine Kategorie gefunden</option>
          )}
        </select>
      </div>
      <div className={styles.buttonContainer}>
        <button className="secondaryButton" onClick={onClose}>
          Abbrechen
        </button>
        <button
          className={enableCreateButton ? "disabledButton" : "primaryButton"}
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
