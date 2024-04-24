import React from "react";
import styles from "../../styles/Article/editArticleForm.module.css";

const EditArticleForm = ({ onClose, article, shelf }) => {
  const [compartment, setCompartment] = useState();

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
  const handleShelfSelction = (shelfid) => {
    getCompartments(shelfid);
  };
  return (
    <div className={styles.container}>
      <h2>Artikel bearbeiten</h2>
      <div className={styles.content}>
        <input type="text" placeholder={article.articlename} />
        <select placeholder="Einheit" value={article.unit}>
          <option>Meter</option>
          <option>Kilo</option>
          <option>Stück</option>
        </select>
      </div>
      <div className={styles.content}>
        <select onChange={(e) => handleShelfSelction(e.target.value)}>
          {shelf.result != undefined ? (
            shelf.result.map((s) => (
              <option key={s.shelfid} value={s.shelfname}>
                {s.shelfname}
              </option>
            ))
          ) : (
            <option>Keine Regale gefunden</option>
          )}
        </select>
        <select>
          {compartment != undefined ? (
            compartment.map((c) => (
              <option key={c.compartmentid} value={c.compartmentname}>
                {c.compartmentname}
              </option>
            ))
          ) : (
            <option>Keine Fächer gefunden</option>
          )}
        </select>
      </div>
    </div>
  );
};

export default EditArticleForm;
