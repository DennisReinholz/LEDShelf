import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from "../../styles/Shelf/compartment.module.css";
import RemovalCompartment from "./RemovalCompartment";

const Compartment = ({ isActive, comp, count, compId, handleIsActive }) => {
  const [article, setArticle] = useState();
  const [counter, setCounter] = useState(0);
  const [ip, setIp] = useState();
  const [controllerFunction, setControllerFunction] = useState();

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
        if (data[0] != null || data[0] != undefined) {
          setIp(data[0].ipAdresse);
          setControllerFunction(data[0].functionName);
        }
      });
  };
  const handleLedOn = async () => {
    try {
      const response = await fetch(`http://${ip}/${controllerFunction}`);
      if (response.status !== 200) {
        console.log("Network response was not ok");
      } else {
        console.log("test");
      }
      // Optional: Handle response if needed
    } catch (error) {
      console.log("There was a problem with the fetch operation:");
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
        <RemovalCompartment
          UpdateArticleCount={UpdateArticleCount}
          article={article}
          counter={counter}
          setCounter={setCounter}
        />
      )}
    </div>
  );
};

export default Compartment;
