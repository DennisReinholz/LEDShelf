import React, { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import EditCategoryForm from "./EditCategoryForm.jsx";
import DeleteCategory from "./DeleteCategoryForm.jsx";
import Modal from "../common/Modal.jsx";
import styles from "../../styles/Category/category.module.css";

const Category = ({ category, setDeleteCategory }) => {
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
  const [editCategory, setEditCategory] = useState();

  const [selectedCategory, setSelectedCategory] = useState();

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
          setDeleteCategory(false);
        } else {
          toast.error("Kategorie konnte nicht gelöscht werden.");
          setDeleteCategory(false);
        }
      });
  };

  const handleEditCategory = () => {
    setEditCategoryOpen(true);
    setEditCategory(category);
  };
  const handleDeleteCategory = () => {
    setDeleteCategoryOpen(true);
    setSelectedCategory(category);
  };
  return (
    <div className={styles.container}>
      <p>{category.categoryname}</p>
      <div className={styles.editContainer}>
        <FiEdit2
          className="edit"
          style={{ cursor: "pointer" }}
          onClick={() => handleEditCategory()}
        />
        <BsTrash
          className="delete"
          style={{ cursor: "pointer" }}
          onClick={() => handleDeleteCategory()}
        />
      </div>
      {editCategoryOpen && (
        <Modal onClose={() => setEditCategoryOpen(false)}>
          <EditCategoryForm
            onClose={() => setEditCategoryOpen(false)}
            category={editCategory}
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
    </div>
  );
};

export default Category;
