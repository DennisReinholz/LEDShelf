import React, { useEffect, useState } from "react";
import styles from "../../styles/Category/editCategoryForm.module.css";
import toast from "react-hot-toast";

const EditCategoryForm = ({ category }) => {
  const [articleList, setArticleList] = useState([]);
  const getArticleWithCategory = async () => {
    const response = await fetch(
      `http://localhost:3000/getArticleWithCategory`,
      {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
        body: JSON.stringify({
          categoryid: category.categoryid,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.serverStatus == 2) {
          setArticleList(data);
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
        <button
          onClick={() => {
            console.log(articleList);
          }}
        >
          articleListe
        </button>
      </div>
    </div>
  );
};

export default EditCategoryForm;
