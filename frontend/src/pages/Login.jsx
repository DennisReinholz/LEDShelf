import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../helpers/userAuth.jsx";
import toast from "react-hot-toast";
import { useConfig } from "../ConfigProvider";
import "../styles/app.css";
import "../styles/login.css";
import "bootstrap/dist/css/bootstrap.min.css";

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

  const handlePassword = (event) => setPassword(event.target.value);
  const handleUsername = (event) => setUserName(event.target.value);

  const getUser = async () => {
    try {
      const response = await fetch(`http://${backendUrl === undefined ? config.localhost : backendUrl}:3000/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    return () => document.removeEventListener("keydown", listener);
  }, [password, username]);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg login-Content" style={{ maxWidth: "400px", width: "100%" }}>
        <p className="text-center fw-bold fs-4 login-AppName">LEDShelf</p>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={username}
            onChange={handleUsername}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={handlePassword}
          />
        </div>
        <div className="d-grid">
          <button className="btn btn-primary primaryButton" onClick={getUser}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
