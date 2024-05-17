import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/categoryLayout.module.css";
import AddCategoryFrom from "../components/Category/AddCategoryForm.jsx";

import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import Modal from "../components/common/Modal.jsx";
import { UserContext } from "../helpers/userAuth";
import DeleteCategory from "../components/Category/DeleteCategoryForm.jsx";
import toast from "react-hot-toast";

const CategoryLayout = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [addCategoryIsOpen, setAddIsCategoryIsOpen] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
  const [editCategory, setEditCategory] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [deleteCategory, setDeleteCategory] = useState(false);

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
  const deleteCategoryById = async () => {
    const response = await fetch(`http://localhost:3000/deleteCategory`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        categoryid: selectedCategory.categoryid,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.serverStatus == 2) {
          toast.success("Kategorie wurde gelöscht.");
          getCategory();
          setDeleteCategory(false);
        } else {
          toast.error("Kategorie konnte nicht gelöscht werden.");
          setDeleteCategory(false);
          getCategory();
        }
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
  }, [categoryList, deleteCategory]);
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
                <React.Fragment key={c.articleid}>
                  <tbody>
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
                </React.Fragment>
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
      {deleteCategoryOpen && (
        <Modal onClose={() => setDeleteCategoryOpen(false)}>
          <DeleteCategory
            onClose={() => setDeleteCategoryOpen(false)}
            setDelete={setDeleteCategory}
            category={selectedCategory}
            deleteCategory={() => deleteCategoryById()}
          />
        </Modal>
      )}
      {addCategoryIsOpen && (
        <Modal onClose={() => setAddIsCategoryIsOpen(false)}>
          <AddCategoryFrom onClose={() => setAddIsCategoryIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default CategoryLayout;
