import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Shelf from "../components/Shelf/Shelf";
import styles from "../styles/shelfLayout.module.css";
import { UserContext } from "../helpers/userAuth.jsx";
import { useConfig } from "../ConfigProvider";

const ShelfLayout = () => {
  const {user, setUser, token} = useContext(UserContext);
  const [shelfList, setShelfList] = useState();
  const [shelfUpdated, setShelfUpdated] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const config = useConfig();
  const { backendUrl } = config || {};
  const navigate = useNavigate();

  const getShelfs = async () => {
    const response = await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/getShelf`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-cache",
    });
    const data = await response.json();
    setShelfList(data.result);
  };
  const activateEdit = () => {
    setIsEdit((prevEdit) => {
      return !prevEdit;     
    });
  };
  
  useEffect(() => {
    getShelfs();

    const userStorage = localStorage.getItem("user");
    if (
      userStorage !== undefined ||
      (userStorage !== null && user === undefined)
    ) {
      setUser(JSON.parse(userStorage));
    }
    if (userStorage === null) {
      navigate("/login");
    }    
  }, [isEdit, shelfUpdated]);

  return (
    <div className={styles.container}>
        {user != undefined
          ? user.roleid == 1 && (
            <div className={styles.buttonContainer}>
              <button
              disabled={isEdit}
                className={!isEdit ? "primaryButton": "disabledButton"}
                onClick={() => navigate("/regale/konfigurieren")}
              >
                Erstellen
              </button>
                <button className="primaryButton" onClick={activateEdit}>Bearbeiten</button>
              </div>
            )
          : ""}
    
      <div className={styles.content}>
        {shelfList != undefined
          ? shelfList.map((c) => (
              <Shelf
                key={c.shelfid}
                shelfname={c.shelfname}
                place={c.place}
                compantments={c.countCompartment}
                shelfId={c.shelfid}
                isEdit={isEdit}
                setShelfUpdated={setShelfUpdated}
              />
            ))
          : "Keine Regale vorhanden"}
      </div>
    </div>
  );
};

export default ShelfLayout;
