import React from "react";
import styles from "../../styles/Shelf/shelf.module.css";

const Shelf = ({ shelfname, place, compantments, article }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p>{shelfname} - Regal</p>
        <p>Ort: {place}</p>
        <p>Anzahl Fächer: {compantments}</p>
        <p>Anzahl Artikel: {article}</p>
      </div>
    </div>
  );
};

export default Shelf;
