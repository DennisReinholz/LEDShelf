import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/login.module.css";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../helpers/userAuth.jsx";
import toast from "react-hot-toast";

const MyTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white", // Weiße Border
    },
    "& input": {
      color: "white", // Weißer Text
    },
  },
  "& .MuiInputLabel-root": {
    color: "white", // Weiße Label-Farbe
  },
});
const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [user, setUser] = useContext(UserContext);

  const getUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/users?user=${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-cache",
          body: JSON.stringify({
            frontendPassword: password,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.serverStatus === 2) {
            setUser(data.result);
            localStorage.setItem("user", JSON.stringify(data.result));
            navigate("/regale");
          } else if (data.serverStatus === -2) {
            toast.error(
              "Login fehlgeschlagen. \n Username oder Passwort ist falsch."
            );
          }
        })
        .catch((error) =>
          console.error("Fehler beim Abrufen der Benutzerdaten:", error)
        );
    } catch (error) {
      toast.error(
        "Fehler bei Abfrage aus Datenbank, bitte starten Sie den Backend server neu."
      );
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p>
          <strong>h</strong>3D²
        </p>
        <div className={styles.inputContainer}>
          <MyTextField
            id="outlined-basic-1"
            label="Username"
            variant="outlined"
            size="small"
            style={{ width: "16rem" }}
            className={styles.input}
            onChange={(e) => setUserName(e.target.value)}
          />
          <MyTextField
            id="outlined-basic-2"
            label="Password"
            variant="outlined"
            size="small"
            type="password"
            style={{ width: "16rem" }}
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
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
