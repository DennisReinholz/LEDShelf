import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import styles from "../../styles/Shelf/compartment.module.css";

const Compartment = ({ isActive, comp, count, compId, handleIsActive }) => {
  const [article, setArticle] = useState();
  const [counter, setCounter] = useState(0);
  const [ip, setIp] = useState();
  const [controllerFunction, setControllerFunction] = useState();

  const decrease = () => {
    setCounter((c) => c - 1);
  };
  const increase = () => {
    setCounter((c) => c + 1);
  };

  const getCompartmentArticle = async () => {
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
  const UpdateArticleCount = async (articleid) => {
    if (article !== undefined) {
      let newArticleCount = article.count + counter;
      if (newArticleCount < 0) {
        toast.error("Es ist kein Artikel vorhanden.");
      } else {
        const response = await fetch(
          `http://localhost:3000/updateArticleCount`,
          {
            method: "Post",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-cache",
            body: JSON.stringify({
              newArticleCount,
              articleid,
            }),
          }
        ).then((response) => {
          if (response.status === 200) {
            toast.success("Artikel wurde aktualisiert.");
            handleIsActive(compId);
            setCounter(0);
          } else {
            toast.error("Artikel konnte nicht aktualisiert werden.");
          }
        });
      }
    } else {
      handleIsActive(compId);
      setCounter(0);
      toast.error("Es wurde kein Artikel gefunden");
    }
  };
  const getControllerFunction = async () => {
    const response = await fetch(
      `http://localhost:3000/getControllerFunction`,
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
        setIp(data[0].ipAdresse);
        setControllerFunction(data[0].functionName);
      });
  };
  const handleLedOn = async () => {
    try {
      const response = await fetch(`http://${ip}/${controllerFunction}`);
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      // Optional: Handle response if needed
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  useEffect(() => {
    getCompartmentArticle();
    getControllerFunction();
  }, [article, ip, controllerFunction]);

  return (
    <div className={styles.compartContainer} onClick={() => handleLedOn()}>
      <div
        className={isActive ? styles.containerIsActive : styles.container}
        onClick={() => handleIsActive(compId)}
      >
        <div className={styles.content}>
          <p>{comp}</p>
          <p>
            {article != undefined && article != undefined
              ? article.articlename
              : "Kein Artikel eingelagert"}
          </p>
          <p>
            {" "}
            {article != undefined && article != undefined
              ? article.count
              : ""}{" "}
            {article != undefined && article != undefined ? article.unit : ""}
          </p>
        </div>
      </div>
      {isActive && (
        <div style={{ display: "flex", alignItems: "center" }}>
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
      )}
    </div>
  );
};

export default Compartment;
