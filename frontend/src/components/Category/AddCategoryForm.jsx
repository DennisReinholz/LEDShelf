import React, { useEffect, useState } from "react";
import styles from "../../styles/Category/addCategoryForm.module.css";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { useConfig } from "../../ConfigProvider";

const AddCategoryFrom = ({ onClose }) => {
  const [categoryName, setCategoryName] = useState();
  const config = useConfig();
  const { backendUrl } = config || {};

  const handleInput = (event) => {
    setCategoryName(event);
  };
  const UpdateCategory = async () => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/createCategory`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        categoryName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.serverStatus == 2) {
          toast.success("Kategorie wurde erstellt");
          onClose();
        } else {
          toast.error("Kategorie konnte nicht erstellt werden.");
        }
      });
  };
  useEffect(() => {}, []);
  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p>Name der Kategorie:</p>
        <input
          type="text"
          placeholder="Kategorie name"
          className={styles.inputCategory}
          onChange={(e) => handleInput(e.target.value)}
        />
      </div>
      <div className={styles.buttonContainer}>
        <button
          className="secondaryButton"
          onClick={() => console.log(categoryName)}
        >
          Abbrechen
        </button>
        <button className="primaryButton" onClick={UpdateCategory}>
          Erstellen
        </button>
      </div>
    </div>
  );
};
AddCategoryFrom.propTypes = {
  onClose: PropTypes.node.isRequired,
};
export default AddCategoryFrom;
