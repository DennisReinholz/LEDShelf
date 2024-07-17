import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineSignal } from "react-icons/hi2";
import { BsBookshelf } from "react-icons/bs";
import { HiOutlineScale } from "react-icons/hi2";
import { UserContext } from "../helpers/userAuth.jsx";
import { HiOutlineQrCode } from "react-icons/hi2";
import { MdOutlineContactSupport } from "react-icons/md";
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
    <div className={styles.container}>
      <ul>
        <div className={styles.nav} onClick={() => navigate("/regale")}>
          <BsBookshelf />
          <div className={styles.textContainer}>
            <p>Regale</p>
          </div>
        </div>

        <div className={styles.nav} onClick={() => navigate("/artikel")}>
          <HiOutlineScale />
          <div className={styles.textContainer}>
            <p>Artikel</p>
          </div>
        </div>

        {user !== null
          ? user[0].role == 1 && (
              <>
                <div
                  className={styles.nav}
                  onClick={() => navigate("/benutzer")}
                >
                  <HiOutlineUsers />
                  <div className={styles.textContainer}>
                    <p>Benutzer</p>
                  </div>
                </div>

                <div
                  className={styles.nav}
                  onClick={() => navigate("/geraete")}
                >
                  <HiOutlineSignal />
                  <div className={styles.textContainer}>
                    <p>Geräte</p>
                  </div>
                </div>

                <div
                  className={styles.nav}
                  onClick={() => navigate("/kategorie")}
                >
                  <HiOutlineQrCode />
                  <div className={styles.textContainer}>
                    <p>Kategorie</p>
                  </div>
                </div>
                <div
                  className={styles.nav}
                  onClick={() => navigate("/service")}
                >
                  <MdOutlineContactSupport />
                  <div className={styles.textContainer}>
                    <p>Service</p>
                  </div>
                </div>
              </>
            )
          : ""}

        <div className={styles.nav} onClick={handleLogout}>
          <HiOutlineArrowRightOnRectangle />
          <div className={styles.textContainer}>
            <p>Logout</p>
          </div>
        </div>
      </ul>
    </div>
  );
};

export default MainNav;
