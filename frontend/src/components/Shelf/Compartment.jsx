import React, { useEffect, useState } from "react";
import styles from "../../styles/Shelf/compartment.module.css";

const Compartment = ({ isActive, comp, count, compId }) => {
  const [article, setArticle] = useState();
  const getCompartmentArticle = async () => {
    console.log(compId);

    const response = await fetch(
      `http://localhost:3000/getArticleInCompartment`,
      {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
        body: JSON.stringify({
          compId,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setArticle(data[0]);
        }
      });
  };
  useEffect(() => {
    getCompartmentArticle();
  }, []);
  return (
    <div className={isActive ? styles.containerIsActive : styles.container}>
      <div className={styles.content}>
        <p>{comp}</p>
        <p>
          Artikel:{" "}
          {article != undefined && article != undefined
            ? article.articlename
            : ""}
        </p>
        <p>
          {" "}
          {article != undefined && article != undefined
            ? article.count
            : ""}{" "}
          {article != undefined && article != undefined ? article.unit : ""}
        </p>
        <div className={styles.buttonContainer}>
          <button className={styles.articleButton}>-</button>
          <p>0</p>
          <button className={styles.articleButton}>+</button>
        </div>
      </div>
    </div>
  );
};

export default Compartment;
