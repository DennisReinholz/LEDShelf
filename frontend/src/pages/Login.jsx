import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/login.module.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../helpers/userAuth.jsx";
import toast from "react-hot-toast";
import { useConfig } from "../ConfigProvider";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setToken } = useContext(UserContext);
  const config = useConfig();
  const { backendUrl } = config;

  const clearLogin = () => {
    setUserName("");
    setPassword("");
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleUsername = (event) => {
    setUserName(event.target.value);
  };
  const getUser = async () => {
    try {
        const response = await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/users`, {
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
            setToken(data.token);
            localStorage.setItem("user", JSON.stringify(data.result));
            localStorage.setItem("token", data.token);
            navigate("/regale");
        } else if (data.serverStatus === -1 || data.serverStatus === -2) {
            toast.error("Login fehlgeschlagen. \n Username oder Passwort ist falsch.");
            clearLogin();
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Benutzerdaten:", error);
        toast.error("Fehler bei der Abfrage aus der Datenbank, bitte starten Sie den Backend-Server neu.");
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
  }, [password, username]);

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
            onChange={handleUsername}
          />
          <input
            placeholder="Password"
            size="small"
            type="password"
            style={{ width: "16rem", height: "2rem", color: "black" }}
            value={password}
            className={styles.input}
            onChange={handlePassword}
          />
          <div className={styles.buttonContainer}>
            <button className={styles.loginButton} onClick={getUser}>
              Login
            </button> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
