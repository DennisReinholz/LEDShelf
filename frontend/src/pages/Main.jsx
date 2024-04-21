import React from "react";
import Button from "../components/Button.jsx";
import styles from "../styles/main.module.css";
import axios from "axios";

const Main = () => {
  const handleFirstColumnLedOn = async () => {
    try {
      const response = await axios.get("http://192.168.188.48/led1/on");
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      // Optional: Handle response if needed
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  const handleSecondColumnLedOn = async () => {
    try {
      const response = await axios.get("http://192.168.188.48/led2/on");
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      // Optional: Handle response if needed
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  const handleThirdColumnLedOn = async () => {
    try {
      const response = await axios.get("http://192.168.188.48/led3/on");
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      // Optional: Handle response if needed
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  const handlefourColumnLedOn = async () => {
    try {
      const response = await axios.get("http://192.168.188.48/led4/on");
      console.log("hiser");
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      // Optional: Handle response if needed
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  const handleLedOff = async () => {
    try {
      const response = await axios.get("http://192.168.188.48/led/off");
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      // Optional: Handle response if needed
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Button handleLed={handleFirstColumnLedOn}>Led 1</Button>
      <Button handleLed={handleSecondColumnLedOn}>Led 2</Button>
      <Button handleLed={handleThirdColumnLedOn}>Led 3</Button>
      <Button handleLed={handlefourColumnLedOn}>Led 4</Button>
      <Button handleLed={handleLedOff}>Led Off</Button>
    </div>
  );
};

export default Main;
