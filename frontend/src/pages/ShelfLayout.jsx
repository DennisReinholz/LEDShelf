import React, { useEffect, useState, useContext } from "react";
import Shelf from "../components/Shelf/Shelf";
import Modal from "../components/common/Modal";
import AddShelfForm from "../components/Shelf/AddShelfForm";
import styles from "../styles/shelfLayout.module.css";
import { UserContext } from "../helpers/userAuth.jsx";

const ShelfLayout = () => {
  const [user, setUser] = useContext(UserContext);
  const [shelfList, setShelfList] = useState();
  const [isShelfOpen, setIsShelfOpen] = useState(false);

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
        {user != undefined
          ? user[0].role == 1 && (
              <button
                className="primaryButton"
                onClick={() => setIsShelfOpen((o) => !o)}
              >
                Add Regal
              </button>
            )
          : ""}
      </div>
      <div className={styles.content}>
        {shelfList != undefined
          ? shelfList.map((c) => (
              <Shelf
                key={c.shelfid}
                shelfname={c.shelfname}
                place={c.place}
                compantments={c.countCompartment}
                shelfId={c.shelfid}
              />
            ))
          : "Keine Regale vorhanden"}
      </div>
      {isShelfOpen && (
        <Modal onClose={() => setIsShelfOpen(false)}>
          <AddShelfForm
            onClose={() => setIsShelfOpen(false)}
            setShelflist={setShelfList}
            shelflist={shelfList}
          />
        </Modal>
      )}
    </div>
  );
};

export default ShelfLayout;
