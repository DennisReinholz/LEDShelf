import React from "react";
import styles from "../../styles/Shelf/removalCompartment.module.css";
import PropTypes from "prop-types";

const RemovalCompartment = ({
  UpdateArticleCount,
  article,
  counter,
  setCounter,
}) => {
  const decrease = () => {
    setCounter((c) => c - 1);
  };
  const increase = () => {
    setCounter((c) => c + 1);
  };
  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <button className={styles.articleButton} onClick={() => decrease()}>
          -
        </button>
        <p style={{ fontSize: "1.25em" }}>{counter}</p>
        <button className={styles.articleButton} onClick={() => increase()}>
          +
        </button>
      </div>
      <button
        className="primaryButton"
        style={{ marginLeft: "1rem" }}
        onClick={() =>
          UpdateArticleCount(article != undefined ? article.articleid : "")
        }
      >
        Speichern
      </button>
    </div>
  );
};
RemovalCompartment.propTypes = {
  UpdateArticleCount: PropTypes.node.isRequired,
  article: PropTypes.node.isRequired,
  counter: PropTypes.node.isRequired,
  setCounter: PropTypes.node.isRequired,
};
export default RemovalCompartment;
