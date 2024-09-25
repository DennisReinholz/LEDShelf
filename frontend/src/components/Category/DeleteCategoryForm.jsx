import React from "react";
import styles from "../../styles/Category/deleteCategoryForm.module.css";
import PropTypes from "prop-types";

const DeleteCategoryForm = ({
  category,
  onClose,
  setDelete,
  deleteCategory,
}) => {
  const handleDelete = () => {
    setDelete(true);
    deleteCategory();
    onClose();
  };
  const handleAbort = () => {
    onClose();
  };
  return (
    <div className={styles.container}>
      <h3>Kategorie löschen</h3>
      <div className={styles.content}>
        <p>
          {category === undefined
            ? "Kategorie wurde nicht gefunden"
            : "Wollen Sie die Kategorie: " +
              category.categoryname +
              " wirklich löschen?"}
        </p>
        <div className={styles.buttonContainer}>
          <button className="secondaryButton" onClick={handleAbort}>
            Nein
          </button>
          <button className="primaryButton" onClick={handleDelete}>
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
};
DeleteCategoryForm.propTypes = {
  category: PropTypes.node.isRequired,
  onClose: PropTypes.node.isRequired,
  setDelete: PropTypes.node.isRequired,
  deleteCategory: PropTypes.node.isRequired,
};
export default DeleteCategoryForm;
