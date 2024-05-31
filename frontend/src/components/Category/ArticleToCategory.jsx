import React, { useEffect, useState } from "react";
import styles from "../../styles/Category/articleToCategory.module.css";
import toast from "react-hot-toast";

const ArticleToCategory = ({
  articleid,
  articlename,
  categoryid,
  hasCategory,
  category,
}) => {
  const [inCategory, setInCategory] = useState();
  const [selectedArticle, setSelectedArticle] = useState();

  const handleInCategory = () => {
    setInCategory(hasCategory);
  };

  const handleUpdateArticle = (state) => {
    if (state) {
      setSelectedArticle(articleid);
      UpdateArticleCategory();
    } else {
      setSelectedArticle("null");
      UpdateArticleCategory();
    }
  };
  const UpdateArticleCategory = async () => {
    console.log(category);
    console.log(selectedArticle);
    const response = await fetch(
      `http://localhost:3000/UpdateArticleCategory`,
      {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
        body: JSON.stringify({
          category,
          articleid,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.serverStatus == 2) {
          toast.success("Artikel wurde der Kategorie hinzugefügt.");
        } else {
          toast.error(
            "Artikel konnte der Kategorie nicht hinzufgefügt werden."
          );
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
      {articlename}
      <button onClick={() => console.log(selectedArticle)}>dsadas</button>
    </div>
  );
};

export default ArticleToCategory;
