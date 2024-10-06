import React, { useEffect, useState } from "react";
import styles from "../../styles/Category/editCategoryForm.module.css";
import toast from "react-hot-toast";
import ArticleToCategory from "./ArticleToCategory";
import PropTypes from "prop-types";

const EditCategoryForm = ({ category }) => {
  const [articleList, setArticleList] = useState([]);

  const getArticleWithCategory = async () => {
    await fetch(`http://localhost:3000/getArticleWithCategory`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        categoryid: category.categoryid,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.serverStatus == 2) {
          setArticleList(data.result);
        } else {
          toast.error("Kategorie konnte nicht gelöscht werden.");
        }
      });
  };
  useEffect(() => {
    getArticleWithCategory();
  }, []);
  return (
    <div className={styles.container}>
      <h3>{category.categoryname}</h3>
      <div className={styles.content}>
        {articleList != undefined && articleList.length > 0
          ? articleList.map((article) => (
              <ArticleToCategory
                key={article.articleid}
                articleid={article.articleid}
                articlename={article.articlename}
                categoryid={article.categoryid}
                hasCategory={article.categoryid !== null}
                categoryID={category.categoryid}
              />
            ))
          : <p>Keine Artikel zum zuordnen gefunden</p>}
      </div>
    </div>
  );
};
EditCategoryForm.propTypes = {
  category: PropTypes.object.isRequired,
};
export default EditCategoryForm;
