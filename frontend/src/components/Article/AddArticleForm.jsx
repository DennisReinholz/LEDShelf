import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "../../styles/Article/addArticleForm.module.css";
import PropTypes from "prop-types";

const AddArticleForm = ({ onClose, setArticleCreated, token }) => {
  const [articlename, setArticlename] = useState("");
  const [amount, setAmount] = useState(0);
  const [unit, setUnit] = useState();
  const [shelf, setShelf] = useState();
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [compartment, setCompartment] = useState();
  const [selectedCompartment, setSelectedCompartment] = useState();
  const [enableCreateButton, setEnableCreateButton] = useState(true);
  const [categoryList, setCategoryList] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [commissiongoods, setCommissiongoods] = useState("");
  const [minRequirement, setMinRequirement] = useState();
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState();

  const getShelf = async () => {
    await fetch(`http://localhost:3000/getShelf`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((shelf) => {
        if (shelf !== undefined) {
          setShelf(shelf);
        }
      });
  };
  const getCompartments = async (shelfid) => {
    await fetch(`http://localhost:3000/getArticleCompartments`, {
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
    await fetch(`http://localhost:3000/getCategory`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((data) => {
        setCategoryList(data.data.result);
      });
  };
  const getCompany = async () => {
    await fetch(`http://localhost:3000/getCompany`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((data) => {
        setCompanyList(data.data.result);
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
        selectedShelf: selectedShelf,
        selectedCompartment:
          selectedCompartment === undefined
            ? selectedCompartment === "null"
            : selectedCompartment,
        selectedCategory,
        selectedCompany,
        commissiongoods,
        minRequirement,
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
      (articlename !== null ||
        articlename !== undefined ||
        articlename.length >= 0) &&
      (amount !== null || amount !== undefined) &&
      (unit !== "undefined" || unit !== undefined) &&
      minRequirement === undefined
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
    if (shelf == undefined) {
      getShelf();
    }
    checkFrom();
    if (categoryList == undefined) {
      getCategory();
    }
    if (companyList.length == 0) {
      getCompany();
    }
  }, [
    articlename,
    selectedCompartment,
    selectedShelf,
    selectedCompartment,
    amount,
    unit,
    enableCreateButton,
  ]);
  return (
    <div className={styles.container}>
      <h2>Erstelle einen Artikel</h2>
      <fieldset className={styles.fieldsetStyle}>
        <legend>Erstellung</legend>
        <div className={styles.content}>
          <p>Artikelname</p>
          <input
            className={styles.inputArticleName}
            type="text"
            placeholder="Artikelname"
            value={articlename}
            onChange={(e) => setArticlename(e.target.value)}
          />
        </div>
        <div className={styles.content}>
          <p>Menge:</p>
          <input
            className={styles.inputAmount}
            type="number"
            placeholder="Menge"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className={styles.content}>
          <p>Mindestbestand</p>
          <input
            className={styles.inputMinRequiment}
            type="number"
            value={minRequirement || 0}           
            onChange={(e) => setMinRequirement(e.target.value)}
          />
        </div>
        <div className={styles.content}>
          <p>Einheit</p>
          <select
            className={styles.unitSelection}
            value={unit || ""}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="undefined">Einheit</option>
            <option value="Stück">Stück</option>
            <option value="Meter">Meter</option>
            <option value="Zentimeter">Zentimeter</option>
            <option value="Kilogramm">Kilogramm</option>
          </select>
        </div>
        <div className={styles.content}>
          <p>Kategorie</p>
          <select
            className={styles.categorySelect}
            value={selectedCategory || ""}          
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option>Keine Kategorie</option>
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
      </fieldset>
      <fieldset className={styles.fieldsetStyle}>
        <legend>Lagerung (optional)</legend>
        <div className={styles.content}>
          <p>Firma</p>
          <select
            className={styles.shelfSelect}
            value={selectedCompany || ""}           
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option>Auswählen</option>
            {companyList !== undefined ? (
              companyList.map((s) => (
                <option key={s.companyId} value={s.companyId}>
                  {s.companyName}
                </option>
              ))
            ) : (
              <option>Keine Firma gefunden</option>
            )}
          </select>
        </div>
        <div className={styles.content}>
          <p>Kommission</p>
          <input
            className={styles.inputCompany}
            type="text"
            placeholder="Kommission"
            value={commissiongoods}
            onChange={(e) => setCommissiongoods(e.target.value)}
          />
        </div>

        <div className={styles.content}>
          <p>Regal</p>
          <select
            className={styles.shelfSelect}
            value={selectedShelf || ""}         
            onChange={(e) => handleShelfSelection(e.target.value)}
          >
            <option>Kein Regal</option>
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
        </div>
        <div className={styles.content}>
          <p>Fach</p>
          <select
            className={styles.compartmentSelect}
            value={selectedCompartment || ""}
            onChange={(e) => setSelectedCompartment(e.target.value)}
          >
            {compartment !== undefined && compartment.length === 0 ? (
              <option>Kein freies Fach</option>
            ) : (
              ""
            )}
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
      </fieldset>

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
AddArticleForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  setArticleCreated: PropTypes.func.isRequired,
  token: PropTypes.node.isRequired,
};
export default AddArticleForm;
