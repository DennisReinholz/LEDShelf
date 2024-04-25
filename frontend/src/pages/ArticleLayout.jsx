import React, { useEffect, useState } from "react";
import styles from "../styles/Article/articleLayout.module.css";
import Modal from "../components/common/Modal";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import AddArticleForm from "../components/Article/AddArticleForm";
import EditArticleForm from "../components/Article/EditArticleForm";
import DeleteArticleForm from "../components/Article/DeleteArticleForm";
import toast, { Toaster } from "react-hot-toast";

const ArticleLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articleList, setArticleList] = useState([]);
  const [editArticleOpen, setEditArticleOpen] = useState(false);
  const [deleteArticleOpen, setDeleteArticleOpen] = useState(false);
  const [editArticle, setEditArticle] = useState();
  const [compartment, setCompartment] = useState();
  const [shelf, setShelf] = useState();
  const [deleteState, setDeleteState] = useState();
  const [selectedArticle, setSelectedArticle] = useState();
  const [updateArticle, setUpdateArticle] = useState(false);

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
  const deleteArticle = async (article) => {
    const response = await fetch(`http://localhost:3000/deleteArticle`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        articleid: article.articleid,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.serverStatus == 2) {
          toast.success("Arikel wurde gelöscht.");
          getArticle();
          getShelf();
          getCompartments();
        } else {
          toast.error("Artikel konnte nicht gelöscht werden.");
        }
      });
  };
  const handleDeleteArticle = (c) => {
    setDeleteArticleOpen(true);
    setSelectedArticle(c);
  };
  useEffect(() => {
    getArticle();
    getShelf();
    getCompartments();
    if (deleteState) {
      deleteArticle(selectedArticle);
    }
    if (updateArticle) {
      getArticle();
      getShelf();
      getCompartments();
    }
  }, [deleteState, updateArticle]);
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
          <thead>
            <tr>
              <th>Artikel</th>
              <th>Menge</th>
              <th>Einheit</th>
              <th>Regal</th>
              <th>Fach</th>
              <th>Action</th>
            </tr>
          </thead>
          {articleList !== undefined ? (
            articleList.map((c) => (
              <tbody>
                <tr key={c.articleid}>
                  <td>{c.articlename}</td>
                  <td>{c.count}</td>
                  <td>{c.unit}</td>
                  <td>{c.shelfname}</td>
                  <td>{c.compartment}</td>
                  <td>
                    <div className={styles.editContainer}>
                      <FiEdit2
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEditArticle(c)}
                      />
                      <BsTrash
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteArticle(c)}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
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
            setUpdateArticle={setUpdateArticle}
          />
        </Modal>
      )}
      {deleteArticleOpen && (
        <Modal onClose={() => setDeleteArticleOpen(false)}>
          <DeleteArticleForm
            onClose={() => setDeleteArticleOpen(false)}
            setDelete={setDeleteState}
            artikelname={selectedArticle}
          />
        </Modal>
      )}
    </div>
  );
};

export default ArticleLayout;
