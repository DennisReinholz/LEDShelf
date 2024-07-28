import React from "react";
import styles from "../../styles/Article/deleteArticleForm.module.css";

const DeleteArticleForm = ({ artikelname, setDelete, onClose }) => {
  const handleDelete = () => {
    setDelete(true);
    onClose();
  };
  const handleAbort = () => {
    onClose();
  };
  return (
    <div className={styles.container}>
      <h3>Artikel löschen</h3>
      <div className={styles.content}>
        <p>
          {artikelname === undefined
            ? "Artikel wurde nicht gefunden"
            : "Wollen Sie den Artikel: " +
              artikelname.articlename +
              " wirklich löschen?"}
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

export default DeleteArticleForm;
