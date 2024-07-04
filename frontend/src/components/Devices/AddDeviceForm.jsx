import React, { useState } from "react";
import styles from "../../styles/Device/addDeviceForm.module.css";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

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
const AddDeviceForm = ({ onClose }) => {
  const [ipAdress, setIpAdress] = useState();
  const [controllerName, setControllerName] = useState();
  return (
    <div className={styles.container}>
      <h3>Gerät hinzufügen</h3>
      <div className={styles.content}>
        <MyTextField
          id="outlined-basic-1"
          label="Name"
          variant="outlined"
          size="small"
          style={{ width: "16rem" }}
          className={styles.input}
          onChange={(e) => setControllerName(e.target.value)}
        />
        <MyTextField
          id="outlined-basic-1"
          label="Ip Adresse"
          variant="outlined"
          size="small"
          style={{ width: "16rem" }}
          className={styles.input}
          onChange={(e) => setIpAdress(e.target.value)}
        />
      </div>
      <div className={styles.buttonContainer}>
        <button content="Speichern" className="primaryButton" />
        <button content="Abbrechen" className="secondaryButton" />
      </div>
    </div>
  );
};

export default AddDeviceForm;
