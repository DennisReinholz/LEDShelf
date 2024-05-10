import React, { useEffect, useState } from "react";
import styles from "../styles/categoryLayout.module.css";
import AddCategoryFrom from "../components/Category/AddCategoryForm.jsx";
import Category from "../components/Category/Category.jsx";
import Modal from "../components/common/Modal.jsx";

const CategoryLayout = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [addCategoryIsOpen, setAddIsCategoryIsOpen] = useState(false);

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
    getCategory();
  }, [categoryList]);
  return (
    <div className={styles.container}>
      <div className={styles.addCategoryContainer}>
        <button
          className="primaryButton"
          style={{ width: "13rem" }}
          onClick={() => setAddIsCategoryIsOpen(true)}
        >
          Kategory erstellen
        </button>
      </div>
      <div className={styles.content}>
        {categoryList != undefined
          ? categoryList.map((c) => (
              <Category key={c.categoryid} name={c.categoryname} />
            ))
          : ""}
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
