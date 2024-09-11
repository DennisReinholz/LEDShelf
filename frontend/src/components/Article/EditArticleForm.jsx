import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "../../styles/Article/editArticleForm.module.css";

const EditArticleForm = ({ onClose, article, shelf, setUpdateArticle }) => {
  const [compartment, setCompartment] = useState();
  const [articleStatus, setArticleStatus] = useState();
  const [newArticleName, setNewArticleName] = useState();
  const [newCount, setNewCount] = useState();
  const [newUnit, setNewUnit] = useState();
  const [newShelf, setNewShelf] = useState();
  const [newCompartment, setNewCompartment] = useState();
  const [category, setCategory] = useState();
  const [newCategory, setNewCategory] = useState();
  const [newMinRequirement, setNewMinRequirement] = useState();

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
        setCompartment(data.result);
      });
  };
  const getArticle = async () => {
    const response = await fetch(`http://localhost:3000/getSelectedArticle`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        articleid: article.articleid,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setArticleStatus(data[0]);
        } else {
          toast.error("Artikel konnte nicht geladen werden.");
        }
      });
  };
  const updateArticle = async () => {
    const response = await fetch(`http://localhost:3000/upateArticle`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        articleid: article.articleid,
        articlename:
          newArticleName != undefined && newArticleName.length != 0
            ? newArticleName
            : articleStatus.articlename,
        unit:
          newUnit != undefined && newUnit.length != 0
            ? newUnit
            : articleStatus.unit,
        amount:
          newCount != undefined && newCount.length != 0
            ? newCount
            : articleStatus.count,
        shelf:
          newShelf != undefined && newShelf.length != 0
            ? newShelf
            : articleStatus.shelf,
        compartment:
          newCompartment != undefined && newCompartment.length != 0
            ? newCompartment
            : articleStatus.compartment,
        category:
          newCategory != undefined && newCategory.length != 0
            ? parseInt(newCategory)
            : articleStatus.categoryid,
        minRequirement:
          newMinRequirement != undefined && newMinRequirement.length != 0
            ? newMinRequirement
            : articleStatus.minRequirement,
      }),
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.serverStatus === 2) {
          toast.success("Artikel wurde aktualisiert.");
          setUpdateArticle(true);
          onClose();
        } else {
          toast.error("Artikel konnte nicht geladen werden.");
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
        if (data.data.serverStatus === 2) {
          setCategory(data.data.result);
        }
      });
  };
  const handleShelfSelction = (shelfid) => {
    setNewShelf(shelfid);
    getCompartments(shelfid);
  };

  useEffect(() => {
    getArticle();
    getCategory();
  }, []);

  return (
    <div className={styles.container}>
      <h2>Artikel bearbeiten</h2>
      <div className={styles.content}>
        <div className={styles.contentRow}>
          <p>Artikelname</p>
          <input
            className={styles.inputArticlename}
            type="text"
            placeholder={
              articleStatus !== undefined ? articleStatus.articlename : ""
            }
            value={newArticleName}
            onChange={(e) => setNewArticleName(e.target.value)}
          />
        </div>
        <div className={styles.contentRow}>
          <p>Menge</p>
          <input
            className={styles.inputNumber}
            placeholder={articleStatus !== undefined ? articleStatus.count : ""}
            type="number"
            value={newCount}
            onChange={(e) => setNewCount(e.target.value)}
          />
        </div>
        <div className={styles.contentRow}>
          <p>Mindestbestand</p>
          <input
            className={styles.inputMinRequirement}
            type="number"
            placeholder={
              articleStatus !== undefined &&
              articleStatus.minRequirement !== null
                ? articleStatus.minRequirement
                : "0"
            }
            value={newMinRequirement}
            onChange={(e) => setNewMinRequirement(e.target.value)}
          />
        </div>
        <div className={styles.contentRow}>
          <p>Kategorie</p>
          <select
            className={styles.selection}
            placeholder={
              article !== undefined && article.category !== null
                ? article.category
                : ""
            }
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          >
            {article?.category == null && (
              <option value="">Kategorie auswählen</option>
            )}
            {category !== undefined
              ? category.map((c) => (
                  <option key={c.categoryid} value={parseInt(c.categoryid)}>
                    {c.categoryname}
                  </option>
                ))
              : ""}
          </select>
        </div>
        <div className={styles.contentRow}>
          <p>Einheit</p>{" "}
          <select
            className={styles.selection}
            placeholder={
              articleStatus !== undefined
                ? articleStatus.unit
                : "Einheit auswählen"
            }
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
            defaultValue={
              article !== undefined && article.unit !== null ? article.unit : ""
            }
          >
            {article?.unit === null && (
              <option value="">Einheit auswählen</option>
            )}
            <option value="Meter">Meter</option>
            <option value="Kilo">Kilo</option>
            <option value="Stück">Stück</option>
          </select>
        </div>
        <div className={styles.contentRow}>
          <p>Regal</p>
          <select
            className={styles.selection}
            defaultValue={
              article !== undefined && article.shelf !== null
                ? article.shelf
                : ""
            }
            value={newShelf}
            onChange={(e) => handleShelfSelction(e.target.value)}
          >
            {article?.shelf === null && (
              <option value="">Regal auswählen</option>
            )}
            {shelf.result !== undefined ? (
              shelf.result.map((s) => (
                <option key={s.shelfid} value={s.shelfid}>
                  {s.shelfname}
                </option>
              ))
            ) : (
              <option value="1">Keine Regale gefunden</option>
            )}
          </select>
        </div>
        <div className={styles.contentRow}>
          <p>Fach</p>
          <select
            className={styles.selection}
            value={newCompartment}
            onChange={(e) => setNewCompartment(e.target.value)}
          >
            {compartment != undefined ? (
              compartment.map((c) => (
                <option key={c.compartmentid} value={c.compartmentid}>
                  {c.compartmentname}
                </option>
              ))
            ) : (
              <option>Keine Fächer gefunden</option>
            )}
          </select>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className="secondaryButton" onClick={onClose}>
          Abbrechen
        </button>
        <button className="primaryButton" onClick={updateArticle}>
          Speichern
        </button>
      </div>
    </div>
  );
};

export default EditArticleForm;
