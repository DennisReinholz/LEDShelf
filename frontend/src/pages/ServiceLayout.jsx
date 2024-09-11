import React, { useState, useEffect, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../helpers/userAuth.jsx";
import styles from "../styles/serviceLayout.module.css";
import CustomerForm from "../components/Service/CustomerForm.jsx";

const ServiceLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    const userStorage = localStorage.getItem("user");
    if (
      userStorage !== undefined ||
      (userStorage !== null && user === undefined)
    ) {
      setUser(JSON.parse(userStorage));
    }
    if (userStorage === null) {
      navigate("/login");
    }
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.containerContent}>
        <h2 className={styles.header}>Kundenservice</h2>
        <CustomerForm />
      </div>
    </div>
  );
};

export default ServiceLayout;
