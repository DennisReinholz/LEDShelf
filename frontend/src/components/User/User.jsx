import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import styles from "../../styles/User/user.module.css";

const User = ({ name, role }) => {
  return (
    <div className={styles.container}>
      <div className={styles.userContent}>
        <p>{name}</p>
        <p>{role}</p>
      </div>
      <div className={styles.editContainer}>
        <FiEdit2
          style={{ cursor: "pointer" }}
          onClick={() => console.log("hallo")}
        />
        <BsTrash
          style={{ cursor: "pointer" }}
          onClick={() => console.log("hallo")}
        />
      </div>
    </div>
  );
};

export default User;
