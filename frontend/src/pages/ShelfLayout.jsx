import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Shelf from "../components/Shelf/Shelf";
import styles from "../styles/shelfLayout.module.css";
import { UserContext } from "../helpers/userAuth.jsx";
import { useConfig } from "../ConfigProvider";
import "bootstrap/dist/css/bootstrap.min.css";


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
    <div className="container">
    {user != undefined && user.roleid == 1 && (
      <div className="d-flex justify-content-end mb-3">
        <button
          disabled={isEdit}
          className={`btn ${!isEdit ? "btn-primary" : "btn-secondary"}`}
          onClick={() => navigate("/regale/konfigurieren")}
        >
          Erstellen
        </button>
        <button className="btn btn-primary ms-2" onClick={activateEdit}>
          Bearbeiten
        </button>
      </div>
    )}

    <div className="row g-3">
      {shelfList != undefined
        ? shelfList.map((c) => (
            <div key={c.shelfid} className="col-md-6 col-lg-4">
              <Shelf
                shelfname={c.shelfname}
                place={c.place}
                compantments={c.countCompartment}
                shelfId={c.shelfid}
                isEdit={isEdit}
                setShelfUpdated={setShelfUpdated}
              />
            </div>
          ))
        : <div className="text-center">Keine Regale vorhanden</div>}
    </div>
  </div>
  );
};

export default ShelfLayout;
