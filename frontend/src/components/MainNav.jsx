import React,{ useContext } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { BsBookshelf } from "react-icons/bs";
import { HiOutlineScale } from "react-icons/hi2";
import { UserContext } from "../helpers/userAuth.jsx";
import { VscSettingsGear } from "react-icons/vsc";
import styles from "../styles/Sidebar/mainNav.module.css";

const MainNav = () => {
  const {user, setUser}= useContext(UserContext);
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
          ? user.roleid === 1 && (
              <>
                <div
                  className={styles.nav}
                  onClick={() => navigate("/einstellung")}
                >
                  <VscSettingsGear />
                  <div className={styles.textContainer}>
                    <p>Einstellung</p>
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
