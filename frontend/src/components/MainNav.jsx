import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineSignal } from "react-icons/hi2";
import { BsBookshelf } from "react-icons/bs";
import { HiOutlineScale } from "react-icons/hi2";
import { UserContext } from "../helpers/userAuth.jsx";
import styles from "../styles/Sidebar/mainNav.module.css";

const MainNav = () => {
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };
  return (
    <nav className={styles.container}>
      <ul>
        <li>
          <div className={styles.nav}>
            <BsBookshelf />
            <NavLink
              to="/regale"
              style={{
                textDecoration: "none",
                color: "white",
                marginLeft: "1rem",
              }}
            >
              Regale
            </NavLink>
          </div>
        </li>
        <li>
          <div className={styles.nav}>
            <HiOutlineScale />
            <NavLink
              to="/artikel"
              style={{
                textDecoration: "none",
                color: "white",
                marginLeft: "1rem",
              }}
            >
              Artikel
            </NavLink>
          </div>
        </li>
        <li>
          <div className={styles.nav}>
            <HiOutlineUsers />
            <NavLink
              to="/benutzer"
              style={{
                textDecoration: "none",
                color: "white",
                marginLeft: "1rem",
              }}
            >
              Benutzer
            </NavLink>
          </div>
        </li>
        <li>
          <div className={styles.nav}>
            <HiOutlineSignal />
            <NavLink
              to="/geraete"
              style={{
                textDecoration: "none",
                color: "white",
                marginLeft: "1rem",
              }}
            >
              Geräte
            </NavLink>
          </div>
        </li>
        <li>
          <div className={styles.nav} onClick={handleLogout}>
            <HiOutlineArrowRightOnRectangle />
            <NavLink
              style={{
                textDecoration: "none",
                color: "white",
                marginLeft: "1rem",
              }}
            >
              Logout
            </NavLink>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default MainNav;
