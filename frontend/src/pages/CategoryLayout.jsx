import React, { useEffect, useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styles from "../styles/categoryLayout.module.css";
import AddCategoryFrom from "../components/Category/AddCategoryForm.jsx";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import Modal from "../components/common/Modal.jsx";
import { UserContext } from "../helpers/userAuth";
import DeleteCategory from "../components/Category/DeleteCategoryForm.jsx";
import toast from "react-hot-toast";
import EditCategoryForm from "../components/Category/EditCategoryForm.jsx";
import { Tooltip } from "react-tooltip";

const CategoryLayout = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [addCategoryIsOpen, setAddIsCategoryIsOpen] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
  const [editCategory, setEditCategory] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [deleteCategory, setDeleteCategory] = useState(false);
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

  const handleEditCategory = (category) => {
    setEditCategoryOpen(true);
    setEditCategory(category);
  };
  const handleDeleteCategory = (c) => {
    setDeleteCategoryOpen(true);
    setSelectedCategory(c);
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
          <table>
            <thead>
              <tr>
                <td>
                  <th>Kategorie</th>
                </td>
                {user != undefined && user[0].role === 1 ? (
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
                              className="edit"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleEditCategory(c)}
                            />
                            <BsTrash
                              className="delete"
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
      {editCategoryOpen && (
        <Modal onClose={() => setEditCategoryOpen(false)}>
          <EditCategoryForm
            onClose={() => setEditCategoryOpen(false)}
            setEditCategory={setEditCategory}
            category={editCategory}
            updateCategory={() => updateCategory()}
          />
        </Modal>
      )}
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
