import React from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import styles from "../../styles/Service/customerForm.module.css";

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

const CustomerForm = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div className={styles.inputColumn}>
            <MyTextField
              id="outlined-basic-1"
              label="Firma"
              variant="outlined"
              size="small"
              className={styles.input}
              onChange={(e) => console.log(e.target.value)}
            />
            <MyTextField
              id="outlined-basic-1"
              label="Email Adresse"
              variant="outlined"
              size="small"
              className={styles.input}
              onChange={(e) => console.log(e.target.value)}
            />
            <MyTextField
              id="outlined-basic-1"
              label="Betreff"
              variant="outlined"
              size="small"
              className={styles.input}
              onChange={(e) => console.log(e.target.value)}
            />
          </div>
          <select className={styles.selection}>
            <option>Test</option>
            <option>Test</option>
            <option>Test</option>
            <option>Test</option>
          </select>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className="secondaryButton">Abbrechen</button>
        <button className="primaryButton">Erstellen</button>
      </div>
    </div>
  );
};

export default CustomerForm;
