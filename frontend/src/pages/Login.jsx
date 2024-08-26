import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/login.module.css";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../helpers/userAuth.jsx";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [user, setUser] = useContext(UserContext);

  const clearLogin = () => {
    setUserName("");
    setPassword("");
  };

  const handleLogin = (event) => {
    if (event.key === "Enter") {
      getUser();
    }
  };
  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
        body: JSON.stringify({
          frontendPassword: password,
          username: username,
        }),
      });

      const data = await response.json();

      if (data.serverStatus === 2) {
        setUser(data.result);
        localStorage.setItem("user", JSON.stringify(data.result));
        navigate("/regale");
      } else if (data.serverStatus === -1) {
        toast.error(
          "Login fehlgeschlagen. \n Username oder Passwort ist falsch."
        );
        clearLogin();
      } else if (data.serverStatus === -2) {
        toast.error(
          "Login fehlgeschlagen. \n Username oder Passwort ist falsch."
        );
        clearLogin();
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Benutzerdaten:", error);
      toast.error(
        "Fehler bei der Abfrage aus der Datenbank, bitte starten Sie den Backend-Server neu."
      );
      clearLogin();
    }
  };
  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        getUser();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p>
          <strong>LEDShelf</strong>
        </p>
        <div className={styles.inputContainer}>
          <input
            className={styles.input}
            type="text"
            placeholder="Name"
            value={username}
            style={{ width: "16rem", height: "2rem", color: "Black" }}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            placeholder="Password"
            variant="outlined"
            size="small"
            type="password"
            style={{ width: "16rem", height: "2rem", color: "black" }}
            value={password}
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleLogin}
          />
          <div className={styles.buttonContainer}>
            <button
              className={styles.loginButton}
              onKeyDown={handleLogin}
              onClick={getUser}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
