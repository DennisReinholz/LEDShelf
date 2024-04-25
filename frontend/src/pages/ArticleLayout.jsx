import React, { useEffect, useState } from "react";
import styles from "../styles/Article/articleLayout.module.css";
import Modal from "../components/common/Modal";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import AddArticleForm from "../components/Article/AddArticleForm";
import EditArticleForm from "../components/Article/EditArticleForm";

const ArticleLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articleList, setArticleList] = useState([]);
  const [editArticleOpen, setEditArticleOpen] = useState(false);
  const [editArticle, setEditArticle] = useState();
  const [compartment, setCompartment] = useState();
  const [shelf, setShelf] = useState();

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
  const getCompartments = async (shelfid) => {
    const response = await fetch(`http://localhost:3000/getCompartment`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        shelfid,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCompartment(data.result);
      });
  };
  const getShelf = async () => {
    const response = await fetch(`http://localhost:3000/getShelf`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((shelf) => {
        setShelf(shelf);
      });
  };
  const handleEditArticle = (article) => {
    setEditArticleOpen(true);
    setEditArticle(article);
  };
  useEffect(() => {
    getArticle();
    getShelf();
    getCompartments();
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
                      onClick={() => handleEditArticle(c)}
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
      {editArticleOpen && (
        <Modal onClose={() => setEditArticleOpen(false)}>
          <EditArticleForm
            onClose={() => setEditArticleOpen(false)}
            article={editArticle}
            compartment={compartment}
            shelf={shelf}
          />
        </Modal>
      )}
    </div>
  );
};

export default ArticleLayout;
