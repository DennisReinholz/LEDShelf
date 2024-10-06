import React, { useEffect, useState } from "react";
import styles from "../../styles/Service/customerForm.module.css";
import toast from "react-hot-toast";

const CustomerForm = () => {
  const [connection, setConnection] = useState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [reason, setReason] = useState();
  const [labels, setLables] = useState([]);
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
  const clearTicket = () => {
    setName("");
    setEmail("");
    setReason([0]);
    setReference("");
    setDescription("");
  };
  const handleSendMail = async () => {
    try {
      createTrelloTicket();
      clearTicket();
    } catch (error) {
      console.log(error);
    }
  };
  const getLabels = async () => {
    try {
      const response = await fetch("http://localhost:3000/trelloLabels", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLables(data);
    } catch (error) {
      console.error("Failed to fetch labels:", error);
    }
  };
  const createTrelloTicket = async () => {
    return await fetch(`http://localhost:3000/createTrelloCard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify({
        name,
        email,
        reference,
        reason,
        description,
      }),
    }).then((result) => {
      if (result.status === 200) {
        toast.success("Ihre Nachricht wurde versendet");
        clearTicket();
      } else {
        toast.error("Ihre Nachricht konnte nicht gesendet werden");
      }
    });
  };

  useEffect(() => {   
    if (labels.length >= 0) {      
      getLabels();        
    }    
    handleCreateButton();
  }, [createIsEnabled, name, email, reason, reference, description, connection]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.contentContainer}>
          <div className={styles.inputColumn}>
            <input
              type="text"
              id="outlined-basic-1"
              color="black"
              placeholder="Name"
              size="small"
              style={{color:"black"}}
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              id="outlined-basic-1"
              placeholder="E-Mail"
              color="black"
              size="small"
              style={{color:"black"}}
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              id="outlined-basic-1"
              placeholder="Betreff"
              style={{color:"black"}}
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
            {labels !== undefined
              ? labels.map((r) => (
                  <option value={r.id} key={r.id}>
                    {r.name}
                  </option>
                ))
              : ""}
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
        <button className="secondaryButton" onClick={() => clearTicket()}>
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
