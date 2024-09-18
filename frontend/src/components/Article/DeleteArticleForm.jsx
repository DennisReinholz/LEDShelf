import React from "react";
import styles from "../../styles/Article/deleteArticleForm.module.css";
import PropTypes from "prop-types";

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
          {artikelname === undefined ? (
            "Artikel wurde nicht gefunden"
          ) : (
            <>
              Wollen Sie den Artikel: <strong>{artikelname.articlename}</strong>{" "}
              wirklich löschen?
            </>
          )}
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
DeleteArticleForm.propTypes = {
  artikelname: PropTypes.node.isRequired,
  setDelete: PropTypes.node.isRequired,
  onClose: PropTypes.node.isRequired,
};
export default DeleteArticleForm;
