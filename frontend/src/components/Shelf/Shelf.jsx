import React from "react";
import styles from "../../styles/Shelf/shelf.module.css";
import { useNavigate } from "react-router-dom";

const Shelf = ({ shelfname, place, compantments, article, shelfId }) => {
  const navigate = useNavigate();
  return (
    <div
      className={styles.container}
      onClick={() => navigate(`/regale/${shelfId}`)}
    >
      <div className={styles.content}>
        <p>{shelfname} </p>
        <p>Ort: {place}</p>
      </div>
    </div>
  );
};

export default Shelf;
