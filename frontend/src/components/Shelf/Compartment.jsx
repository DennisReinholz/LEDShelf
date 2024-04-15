import React from "react";
import styles from "../../styles/Shelf/compartment.module.css";

const Compartment = ({ comp, article, count }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p>{comp} - Fach</p>
        <p>Artikel: {article} </p>
        <p>Anzahl: {count} </p>
        <button>Aktivieren</button>
      </div>
    </div>
  );
};

export default Compartment;
