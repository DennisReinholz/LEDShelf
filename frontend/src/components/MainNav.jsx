import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineSignal } from "react-icons/hi2";
import { BsBookshelf } from "react-icons/bs";
import { HiOutlineScale } from "react-icons/hi2";
import { UserContext } from "../helpers/userAuth.jsx";
import { HiOutlineQrCode } from "react-icons/hi2";
import styles from "../styles/Sidebar/mainNav.module.css";

const MainNav = () => {
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <nav className={styles.container}>
      <ul>
        <li>
          <div className={styles.nav}>
            <NavLink
              to="/regale"
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              <BsBookshelf />

              <p>Regale</p>
            </NavLink>
          </div>
        </li>
        <li>
          <div className={styles.nav}>
            <NavLink
              to="/artikel"
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              <HiOutlineScale />
              <p>Artikel</p>
            </NavLink>
          </div>
        </li>
        {user !== null
          ? user[0].role == 1 && (
              <>
                <li>
                  <div className={styles.nav}>
                    <NavLink
                      to="/benutzer"
                      style={{
                        textDecoration: "none",
                        color: "white",
                      }}
                    >
                      <HiOutlineUsers />
                      <p>Benutzer</p>
                    </NavLink>
                  </div>
                </li>
                <li>
                  <div className={styles.nav}>
                    <NavLink
                      to="/geraete"
                      style={{
                        textDecoration: "none",
                        color: "white",
                      }}
                    >
                      <HiOutlineSignal />
                      <p>Geräte</p>
                    </NavLink>
                  </div>
                </li>
                <li>
                  <div className={styles.nav}>
                    <NavLink
                      to="/kategorie"
                      style={{
                        textDecoration: "none",
                        color: "white",
                      }}
                    >
                      <HiOutlineQrCode />
                      <p>Kategorie</p>
                    </NavLink>
                  </div>
                </li>
              </>
            )
          : ""}
        <li>
          <div className={styles.nav} onClick={handleLogout}>
            <NavLink
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              <HiOutlineArrowRightOnRectangle />
              <p>Logout</p>
            </NavLink>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default MainNav;
