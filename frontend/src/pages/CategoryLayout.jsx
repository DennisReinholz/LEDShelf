import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../helpers/userAuth";
import { Tooltip } from "react-tooltip";
import AddCategoryFrom from "../components/Category/AddCategoryForm.jsx";
import Modal from "../components/common/Modal.jsx";
import toast from "react-hot-toast";
import Category from "../components/Category/Category.jsx";
import styles from "../styles/categoryLayout.module.css";

const CategoryLayout = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [addCategoryIsOpen, setAddIsCategoryIsOpen] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [user, setUser] = useContext(UserContext);

  const navigate = useNavigate();
  const getCategory = async () => {
    const response = await fetch(`http://localhost:3000/getCategory`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((category) => {
        setCategoryList(category.data.result);
      });
  };

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
    getCategory();
  }, [categoryList, deleteCategory]);
  return (
    <div className={styles.container}>
      <Tooltip anchorSelect=".edit" place="left">
        Kategorie bearbeiten
      </Tooltip>
      <Tooltip anchorSelect=".delete" place="left">
        Kategorie löschen
      </Tooltip>
      <div className={styles.addCategoryContainer}>
        <button
          className="primaryButton"
          style={{ width: "13rem" }}
          onClick={() => setAddIsCategoryIsOpen(true)}
        >
          Erstellen
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.tableContainer}>
          {categoryList != undefined ? (
            categoryList.map((c) => (
              <Category
                key={c.categoryid}
                category={c}
                setDeleteCategory={setDeleteCategory}
              />
            ))
          ) : (
            <p>Keine Kategorien gefunden</p>
          )}
        </div>
      </div>
      {addCategoryIsOpen && (
        <Modal onClose={() => setAddIsCategoryIsOpen(false)}>
          <AddCategoryFrom onClose={() => setAddIsCategoryIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default CategoryLayout;
