import React, { useEffect, useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Compartment from "../components/Shelf/Compartment";
import styles from "../styles/compartmentLayout.module.css";
import { UserContext } from "../helpers/userAuth.jsx";
import toast from "react-hot-toast";

const CompartmentLayout = () => {
  let { shelfid } = useParams();

  const [user, setUser] = useContext(UserContext);
  const [compartments, setCompartments] = useState();
  const [activeCompartments, setActiveCompartments] = useState([]);
  const [ip, setIp] = useState();
  const [controllerFunction, setControllerFunction] = useState();
  const navigate = useNavigate();

  const handleIsActive = (index) => {
    setActiveCompartments((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };
  const hanleAllOff = () => {
    setActiveCompartments(Array(compartments.length).fill(false));
    handleLedOff();
  };
  const getShelfOf = async () => {
    const response = await fetch(`http://localhost:3000/getShelfOff`, {
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
        setIp(data[0].ipAdresse);
        setControllerFunction(data[0].functionName);
      });
  };
  const handleLedOff = async () => {
    try {
      const response = await fetch(`http://${ip}/${controllerFunction}`);
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      toast.error("There was a problem with the fetch operation:", error);
    }
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
          onClick={hanleAllOff}
        >
          All off
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
                      isActive={activeCompartments[c.compartmentId]}
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
