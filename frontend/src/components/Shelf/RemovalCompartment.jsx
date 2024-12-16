import React, { useEffect } from "react";
import styles from "../../styles/Shelf/removalCompartment.module.css";
import PropTypes from "prop-types";

const RemovalCompartment = ({
  UpdateArticleCount,
  article,
  counter,
  setCounter,
  setIsBlocked,
  isBlocked
}) => {

  const decrease = () => {
    setCounter((c) => c - 1);
  };
  const increase = () => {
    setCounter((c) => c + 1);
  };

  useEffect(()=>{

  },[isBlocked]);
  
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
      <div className={styles.removeButtonContainer}>
        {isBlocked ?<button className="primaryButton" onClick={()=>setIsBlocked((blocked)=>!blocked)}>Zurücklegen</button> :
        <button className="primaryButton" onClick={()=>setIsBlocked((blocked)=>!blocked)}>Entnehmen</button>}
      </div>
    </div>
  );
};
RemovalCompartment.propTypes = {
  UpdateArticleCount: PropTypes.func.isRequired,
  article: PropTypes.object.isRequired,
  counter: PropTypes.node.isRequired,
  setCounter: PropTypes.func.isRequired,
  setIsBlocked: PropTypes.func.isRequired,
  isBlocked: PropTypes.bool.isRequired,
};
export default RemovalCompartment;
