import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Shelf from "../components/Shelf/Shelf";
import styles from "../styles/shelfLayout.module.css";

const ShelfLayout = () => {
  const [shelfList, setShelfList] = useState();
  const navigate = useNavigate();
  const getShelfs = async () => {
    const response = await fetch(`http://localhost:3000/getShelf`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });
    const data = await response.json();
    setShelfList(data.result);
  };
  useEffect(() => {
    getShelfs();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <button className="button" onClick={() => console.log(shelfList)}>
          Add Regal
        </button>
      </div>
      <div className={styles.content}>
        {shelfList != undefined
          ? shelfList.map((c) => (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/regale/${c.shelfid}`)}
                key={c.shelfid}
              >
                <Shelf
                  shelfname={c.shelfname}
                  place={c.place}
                  compantments={c.countCompartment}
                />
              </div>
            ))
          : "Keine Regale vorhanden"}
      </div>

      {/* <Shelf
        shelfname={"Schrauben"}
        place={"Büro"}
        compantments={3}
        article={25}
      /> */}
    </div>
  );
};

export default ShelfLayout;
