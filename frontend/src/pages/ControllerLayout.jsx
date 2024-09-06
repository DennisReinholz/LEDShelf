import React, { useState, useEffect } from "react";
import Modal from "../components/common/Modal.jsx";
import axios from "axios";

const ControllerLayout = () => {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleConnect = async () => {
    try {
      // Send request to ESP32 with ssid and password
      const response = await fetch("http://esp32-ip/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ssid, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the Wi-Fi network");
      }

      // Reset form fields and error message
      setSsid("");
      setPassword("");
      setErrorMessage("");

      // Handle successful connection
      console.log("Connected to the Wi-Fi network successfully");
    } catch (error) {
      console.error("Error connecting to the Wi-Fi network:", error.message);
      setErrorMessage("Failed to connect to the Wi-Fi network");
    }
  };
  return (
    <div style={{ color: "white" }}>
      <h2>Verbinde mit WLAN</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <div>
        <label>SSID:</label>
        <input
          type="text"
          value={ssid}
          onChange={(e) => setSsid(e.target.value)}
        />
      </div>
      <div>
        <label>Passwort:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleConnect}>Verbinden</button>
    </div>
  );
};

export default ControllerLayout;
