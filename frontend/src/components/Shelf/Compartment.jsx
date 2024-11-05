import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "../../styles/Shelf/compartment.module.css";
import RemovalCompartment from "./RemovalCompartment";
import PropTypes from "prop-types";
import { useConfig } from "../../ConfigProvider";

const Compartment = ({ isActive = false, comp, compId, handleIsActive }) => {
  const [article, setArticle] = useState();
  const [counter, setCounter] = useState(0);
  const [ip, setIp] = useState();
  const [controllerFunction, setControllerFunction] = useState();
  const [controllerAvaiable, setControllerAvaiable] = useState();
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const config = useConfig();
  const { backendUrl } = config || {};

  const getCompartmentArticle = async () => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/getArticleInCompartment`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        compId,
      }),
    })
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
        await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/updateArticleCount`, {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-cache",
          body: JSON.stringify({
            newArticleCount,
            articleid,
          }),
        }).then((response) => {
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
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/getControllerFunction`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        compId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setControllerAvaiable(false);
        }
        if (data[0] != null || data[0] != undefined) {
          setControllerAvaiable(true);
          setIp(data[0].ipAdresse);
          setControllerFunction(data[0].functionName);
        }
      });
  };
  const handleLedOn = async () => {
    if (controllerAvaiable) {
      try {
        const response = await fetch(`http://${ip}/${controllerFunction}`,{
          mode: "no-cors"
        });
        if (response.status !== 200) {
          console.log("Network response was not ok");
        }
      } catch (error) {
        console.log("There was a problem with the fetch operation:");
      }
    }
  };

  useEffect(() => {
    getCompartmentArticle();
    getControllerFunction();
  }, [article, ip, controllerAvaiable]);

  return (
    <div
      className={styles.compartContainer}
      onClick={() => !loading && handleLedOn()}
    >
      <div
        className={isActive ? styles.containerIsActive : styles.container}
        onClick={() => handleIsActive(compId)}
      >
        <div className={styles.content}>
          <p>{comp}</p>        
          <p>
            {article != undefined
              ? article.articlename
              : "Kein Artikel eingelagert"}
          </p>
          <p
            className={
              article != undefined && article.minRequirement >= article.count
                ? styles.articleLow
                : styles.articleRequirement
            }
          >
            {article != undefined ? article.count : ""}{" "}
            {article != undefined ? article.unit : ""}
          </p>
        </div>
      </div>
      { isActive && (
        <RemovalCompartment
          UpdateArticleCount={UpdateArticleCount}
          article={article ? article : {}}
          counter={counter}
          setCounter={setCounter}
        />
      )}
    </div>
  );
};
Compartment.propTypes = {
  handleIsActive: PropTypes.func.isRequired,
  compId: PropTypes.node.isRequired,
  comp: PropTypes.node.isRequired,
  isActive: PropTypes.bool.isRequired,
};
export default Compartment;
