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
  const labels = [
    { id: "661ebb0dc4193adb6d2a5517", label: "Software" },
    { id: "661ebb0dc4193adb6d2a5524", label: "Hardware" },
    { id: "661ebb0dc4193adb6d2a5523", label: "Fehler" },
    { id: "661ebb0dc4193adb6d2a551f", label: "Design" },
  ];

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
      createTrelloTicket();
      ClearTicket();
    } catch (error) {
      console.log(error);
    }
  };
  const createTrelloTicket = async () => {
    const apiKey = "a273346dcd99db598fbdc77c53ae9d68"; // Dein API-Key
    const apiToken =
      "ATTA0efb42bf93619dbf24d1d9dffaff078685b69a6269d7287911b82cc97b24b6de13179A81"; // Dein Token
    const listId = "66b8586b5aa88e49b85f54f9"; // Die ID der Liste
    const url = `https://api.trello.com/1/cards?key=${apiKey}&token=${apiToken}`;
    const body = {
      idList: listId,
      idLabels: reason,
      name: reference,
      desc: `From: ${name} \n Email: ${email} \n\n ${description}`,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), // Body der Anfrage
      });

      if (!response.ok) {
        throw new Error(`HTTP-Fehler! Status: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Ihre Nachricht wurde an den Kundenservice gesendet");
    } catch (error) {
      toast.error(
        "Ihre Nachricht konnte nicht an den Kundenservice gesendet werden."
      );
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
            {labels.map((l) => (
              <option value={l.id} key={l.id}>
                {l.label}
              </option>
            ))}
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
