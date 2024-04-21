import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Compartment from "../components/Shelf/Compartment";
import styles from "../styles/compartmentLayout.module.css";

const CompartmentLayout = () => {
  let { shelfid } = useParams();
  const [compartments, setCompartments] = useState();
  const [activeCompartments, setActiveCompartments] = useState([]);

  const handleIsActive = (index) => {
    setActiveCompartments((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };
  const hanleAllOff = () => {
    setActiveCompartments(Array(compartments.length).fill(false));
  };

  const getCompartments = async () => {
    const response = await fetch(`http://localhost:3000/getCompartment`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        shelfid,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.result.sort((a, b) => {
          if (a.number < b.number) return -1;
          if (a.number > b.number) return 1;
          return 0;
        });
        setCompartments(sortedData);
        setActiveCompartments(Array(data.result.length).fill(false));
      });
  };
  useEffect(() => {
    getCompartments();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <h2 style={{ color: "white" }}>
          {compartments != undefined ? compartments[0].shelfname : ""}- Regal
        </h2>
        <input className={styles.input} placeholder="Artikel suchen" />
      </div>
      <button
        className="primaryButton"
        style={{ marginLeft: "2rem" }}
        onClick={hanleAllOff}
      >
        All off
      </button>
      <div className={styles.content}>
        {compartments != undefined
          ? compartments.map((c, index) => (
              <div
                className={styles.containerCompartment}
                key={c.compartment}
                onClick={() => handleIsActive(index)}
              >
                <Compartment
                  isActive={activeCompartments[index]}
                  comp={c.compartmentname}
                  article={c.articlename}
                  count={c.count}
                />
              </div>
            ))
          : "Keine Regale vorhanden"}
      </div>
    </div>
  );
};

export default CompartmentLayout;
