import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import styles from "../../styles/Service/customerForm.module.css";
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

const CustomerForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [reason, setReason] = useState();
  const [description, setDescription] = useState("");
  const [createIsEnabled, setCreateIsEnabled] = useState(false);
  const isEmpty = (str) => !str?.length;

  const handleCreateButton = () => {
    if (
      !isEmpty(name) &&
      !isEmpty(email) &&
      !isEmpty(reference) &&
      !isEmpty(reason) &&
      !isEmpty(description)
    ) {
      setCreateIsEnabled(true);
    } else {
      setCreateIsEnabled(false);
    }
  };
  const ClearTicket = () => {
    setName("");
    setEmail("");
    setReason([0]);
    setReference("");
    setDescription("");
  };
  const handleSendMail = async () => {
    try {
      const response = await fetch("http://localhost:3000/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: reference,
          text: description,
          email: email,
          reason: reason,
          name: name,
        }),
      });

      if (response.ok) {
        toast.success("E-Mail erfolgreich gesendet");
        ClearTicket();
      } else {
        throw new Error("Fehler beim Senden der E-Mail");
      }
    } catch (error) {
      console.error("Fehler beim Senden der E-Mail:", error);
      toast.error("Fehler beim Senden der E-Mail");
    }
  };

  useEffect(() => {
    handleCreateButton();
  }, [createIsEnabled, name, email, reason, reference, description]);
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
              label="Name"
              variant="outlined"
              size="small"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <MyTextField
              id="outlined-basic-1"
              label="E-Mail"
              variant="outlined"
              size="small"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <MyTextField
              id="outlined-basic-1"
              label="Betreff"
              variant="outlined"
              size="small"
              className={styles.input}
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
          <select
            className={styles.selection}
            onChange={(e) => setReason(e.target.value)}
            defaultValue={reason}
            value={reason}
          >
            <option>Auswahl</option>
            <option value="Bug">Fehler</option>
            <option value="Feature">Verbesserung</option>
            <option value="Help">Hilfe</option>
          </select>
        </div>
        <div className={styles.containerTextBox}>
          <textarea
            type="text"
            className={styles.textbox}
            placeholder="Wie können wir Ihnen helfen?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className="secondaryButton" onClick={() => ClearTicket()}>
          Löschen
        </button>
        <button
          className={createIsEnabled ? "primaryButton" : "disabledButton"}
          disabled={!createIsEnabled}
          style={{ width: "8rem" }}
          onClick={handleSendMail}
        >
          Absenden
        </button>
      </div>
    </div>
  );
};

export default CustomerForm;
