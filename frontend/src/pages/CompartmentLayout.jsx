import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Compartment from "../components/Shelf/Compartment";
import styles from "../styles/compartmentLayout.module.css";
import { UserContext } from "../helpers/userAuth.jsx";
import toast from "react-hot-toast";
import { useConfig } from "../ConfigProvider";

const CompartmentLayout = () => {
  let { shelfid } = useParams();
  const navigate = useNavigate();
   // eslint-disable-next-line no-unused-vars
  const {user, setUser, token} = useContext(UserContext);
  const [compartments, setCompartments] = useState();
  const [activeCompartments, setActiveCompartments] = useState([]);
  const config = useConfig();
  const { backendUrl } = config || {};

  const handleIsActive = (index) => {
    setActiveCompartments((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };
  const handleAllOff = () => {
    setActiveCompartments(Array(compartments.length).fill(false));
    handleLedOff();
  };
  const handleLedOff = async () => {
    try {
      await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/controllerOff`, {
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
          if (data.serverStatus !== 2) {
            toast.error(
              "Led´s konnten nicht ausgeschaltet werden. Bitte überprüfen Sie die Verbindung zum Controller"
            );
          }
        });
    } catch (error) {
      toast.error("There was a problem with the fetch operation:", error);
    }
  };
  const getCompartments = async () => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/getCompartment`, {
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
        if (data.result !== undefined) {
          const sortedData = data.result.sort((a, b) => {
            if (a.number < b.number) return -1;
            if (a.number > b.number) return 1;
            return 0;
          });
          setCompartments(sortedData);
          setActiveCompartments(Array(data.result.length).fill(false));
        }
      });
  };

  useEffect(() => {
    getCompartments();
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
  }, []);
  
  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <h2 style={{ color: "white" }}>
          {compartments != undefined && compartments[0] != undefined
            ? compartments[0].shelfname
            : ""}
        </h2>
        <button
          className="primaryButton"
          style={{ marginLeft: "2rem" }}
          onClick={handleAllOff}
        >
         Alle aus
        </button>
      </div>
      <div className={styles.content}>
        {compartments != undefined
          ? compartments.map((c) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                key={c.compartmentId}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    className={
                      activeCompartments
                        ? styles.containerCompartmentIsActiv
                        : styles.containerCompartment
                    }
                    key={c.compartmentId}
                  >
                    <Compartment
                      compId={c.compartmentId}
                      isActive={activeCompartments[c.compartmentId] ? activeCompartments[c.compartmentId] : false}
                      comp={c.compartmentname}
                      article={c.articlename}
                      count={c.count}
                      handleIsActive={handleIsActive}
                    />
                  </div>
                </div>
              </div>
            ))
          : "Keine Regale vorhanden"}
      </div>
    </div>
  );
};

export default CompartmentLayout;
