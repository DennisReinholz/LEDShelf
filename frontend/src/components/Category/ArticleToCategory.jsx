import React, { useEffect, useState } from "react";
import styles from "../../styles/Category/articleToCategory.module.css";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

const ArticleToCategory = ({
  articleid,
  articlename,
  hasCategory,
  categoryID,
}) => {
  const [inCategory, setInCategory] = useState(hasCategory);
  const [selectedArticle, setSelectedArticle] = useState();

  const handleInCategory = () => {
    setInCategory(hasCategory);
    setSelectedArticle(articleid);
  };

  const handleUpdateArticle = (state) => {
    let tempValue = null;
    let editState = false;
    if (state) {
      setSelectedArticle(articleid);
      editState = true;
      tempValue = categoryID;
    } else {
      tempValue = null;
      editState = false;
    }
    UpdateArticleCategory(tempValue, editState);
  };
  const UpdateArticleCategory = async (value, editState) => {
    await fetch(`http://localhost:3000/UpdateArticleCategory`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        value,
        selectedArticle,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.serverStatus == 2) {
          if (editState) {
            toast.success("Artikel wurde der Kategorie hinzugefügt");
          } else {
            toast.success("Artikel wurde der Kategorie entfernt");
          }
        } else {
          toast.error("Artikel konnte nicht geändert werden.");
        }
      });
  };

  useEffect(() => {
    handleInCategory();
  }, [inCategory]);
  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        defaultChecked={inCategory}
        onChange={(e) => handleUpdateArticle(e.target.checked)}
      />
      <p className={styles.articleName}>{articlename}</p>
    </div>
  );
};

ArticleToCategory.propTypes = {
  articleid: PropTypes.node.isRequired,
  articlename: PropTypes.node.isRequired,
  hasCategory: PropTypes.bool.isRequired,
  categoryID: PropTypes.node.isRequired,
};
export default ArticleToCategory;
