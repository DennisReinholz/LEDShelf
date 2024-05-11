import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/categoryLayout.module.css";
import AddCategoryFrom from "../components/Category/AddCategoryForm.jsx";

import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import Modal from "../components/common/Modal.jsx";
import { UserContext } from "../helpers/userAuth";

const CategoryLayout = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [addCategoryIsOpen, setAddIsCategoryIsOpen] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
  const [editCategory, setEditCategory] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

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
  const handleEditCategory = (article) => {
    setEditCategoryOpen(true);
    setEditCategory(article);
  };
  const handleDeleteCategory = (c) => {
    setDeleteCategoryOpen(true);
    setSelectedCategory(c);
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
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <td>
                  <th>Kategorie</th>
                </td>
                {user !== undefined && user[0].role === 1 ? (
                  <td>
                    {" "}
                    <th>Action</th>{" "}
                  </td>
                ) : (
                  ""
                )}
              </tr>
            </thead>
            {categoryList !== undefined ? (
              categoryList.map((c) => (
                <tbody key={c.articleid}>
                  <tr>
                    <td>{c.categoryname}</td>
                    {user !== undefined && user[0].role === 1 ? (
                      <td>
                        <div className={styles.editContainer}>
                          <FiEdit2
                            style={{ cursor: "pointer" }}
                            onClick={() => handleEditCategory(c)}
                          />
                          <BsTrash
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDeleteCategory(c)}
                          />
                        </div>
                      </td>
                    ) : (
                      ""
                    )}
                  </tr>
                </tbody>
              ))
            ) : (
              <tbody>
                <tr>
                  <td colSpan="5">Keine Artikel gefunden</td>
                </tr>
              </tbody>
            )}
          </table>
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
