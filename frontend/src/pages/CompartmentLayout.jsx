import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Compartment from "../components/Shelf/Compartment";
import styles from "../styles/compartmentLayout.module.css";

const CompartmentLayout = () => {
  let { shelfid } = useParams();
  const [compartments, setCompartments] = useState();

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
        console.log(data.result);
        setCompartments(data.result);
      });
  };
  useEffect(() => {
    getCompartments();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <h2 style={{ color: "white" }}>{compartments[0].shelfname} - Regal</h2>
        <input className={styles.input} placeholder="Artikel suchen" />
      </div>
      <div className={styles.content}>
        {compartments != undefined
          ? compartments.map((c) => (
              <div style={{ cursor: "pointer" }} key={c.articleid}>
                <Compartment
                  comp={c.compartment}
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
