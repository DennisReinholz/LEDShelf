import React, { useEffect, useState } from "react";
import styles from "../styles/Article/articleLayout.module.css";
import Modal from "../components/common/Modal";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import AddArticleForm from "../components/Article/AddArticleForm";

const ArticleLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articleList, setArticleList] = useState([]);

  const getArticle = async () => {
    const response = await fetch(`http://localhost:3000/getArticle`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((article) => {
        setArticleList(article);
      });
  };

  useEffect(() => {
    getArticle();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <button
          className="primaryButton"
          style={{ width: "10rem" }}
          onClick={() => setIsModalOpen(true)}
        >
          {" "}
          Artikel erstellen
        </button>
      </div>
      <div className={styles.content}>
        <table>
          <tr>
            <th>Artikel</th>
            <th>Menge</th>
            <th>Einheit</th>
            <th>Regal</th>
            <th>Fach</th>
            <th>Action</th>
          </tr>
          {articleList !== undefined ? (
            articleList.map((c) => (
              <tr key={c.articleid}>
                <td>{c.articlename}</td>
                <td>{c.count}</td>
                <td>{c.unit}</td>
                <td>{c.shelf}</td>
                <td>{c.compartment}</td>
                <td>
                  <div className={styles.editContainer}>
                    <FiEdit2
                      style={{ cursor: "pointer" }}
                      onClick={() => console.log("hallo")}
                    />
                    <BsTrash
                      style={{ cursor: "pointer" }}
                      onClick={() => console.log("hallo")}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Keine Artikel gefunden</td>
            </tr>
          )}
        </table>
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <AddArticleForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default ArticleLayout;
