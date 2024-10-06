import React, { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import EditCategoryForm from "./EditCategoryForm.jsx";
import DeleteCategory from "./DeleteCategoryForm.jsx";
import Modal from "../common/Modal.jsx";
import styles from "../../styles/Category/category.module.css";
import PropTypes from "prop-types";

const Category = ({ category, setDeleteCategory }) => {
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
  const [editCategory, setEditCategory] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  const deleteCategoryById = async () => {
    await fetch(`http://localhost:3000/deleteCategory`, {
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
      <div className={styles.nameContainer}>
        <p>{category.categoryname}</p>
      </div>
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
Category.propTypes = {
  category: PropTypes.object.isRequired,
  setDeleteCategory: PropTypes.func.isRequired,
};
export default Category;
