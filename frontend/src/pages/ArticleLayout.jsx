import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/Article/articleLayout.module.css";
import Modal from "../components/common/Modal";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import AddArticleForm from "../components/Article/AddArticleForm";
import EditArticleForm from "../components/Article/EditArticleForm";
import DeleteArticleForm from "../components/Article/DeleteArticleForm";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../helpers/userAuth";

const ArticleLayout = () => {
  const [user, setUser] = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editArticleOpen, setEditArticleOpen] = useState(false);
  const [deleteArticleOpen, setDeleteArticleOpen] = useState(false);
  const [editArticle, setEditArticle] = useState();
  const [compartment, setCompartment] = useState();
  const [shelf, setShelf] = useState();
  const [deleteState, setDeleteState] = useState();
  const [selectedArticle, setSelectedArticle] = useState();
  const [updateArticle, setUpdateArticle] = useState(false);
  const [articleCreated, setArticleCreated] = useState(false);
  const [searchArticle, setSearchArticle] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [activeUser, setActiveUser] = useState();
  const [isAdmin, setIsAdmin] = useState();
  const [originArticleList, setOriginArticleList] = useState([]);
  const [articleListToShow, setArticleListToShow] = useState([]);
  const [filteredArticleList, setFilteredArticleList] = useState([]);

  const getArticle = async () => {
    const response = await fetch(`http://localhost:3000/getAllArticle`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((article) => {
        setOriginArticleList(article);
        setArticleListToShow(article);
        setFilteredArticleList(article);
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
  const getCategory = async () => {
    const response = await fetch(`http://localhost:3000/getCategory`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((category) => {
        setCategoryList(category);
      });
  };
  const handleArticleSearch = (search) => {
    setSearchArticle(search);
    setArticleListToShow(
      filteredArticleList.filter((article) =>
        article.articlename.toLowerCase().includes(search.toLocaleLowerCase())
      )
    );
  };
  const handleCategoryFilter = (filter) => {
    if (filter !== "All") {
      setFilteredArticleList(
        originArticleList.filter((article) => article.categoryid == filter)
      );
      setArticleListToShow(
        originArticleList.filter((article) => article.categoryid == filter)
      );
    } else {
      setArticleListToShow(originArticleList);
      setFilteredArticleList(originArticleList);
    }
  };
  const handleUser = () => {
    if (user != undefined) {
      setActiveUser(true);
      if (user[0].role == 1) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setActiveUser(false);
    }
  };
  useEffect(() => {
    getArticle();
    getShelf();
    getCategory();

    getCompartments();
    handleUser();
    if (deleteState) {
      deleteArticle(selectedArticle);
    }
    if (updateArticle) {
      getArticle();
      getShelf();
      getCompartments();
    }
  }, [deleteState, updateArticle, articleCreated]);
  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        {isAdmin ? (
          <button
            className="primaryButton"
            style={{ width: "10rem" }}
            onClick={() => setIsModalOpen(true)}
          >
            Artikel erstellen
          </button>
        ) : (
          ""
        )}
        <input
          className={styles.inputSearch}
          type="text"
          placeholder="Artikel suche"
          value={searchArticle}
          onChange={(e) => handleArticleSearch(e.target.value)}
        />
        <select
          className={styles.categorySelection}
          onChange={(e) => handleCategoryFilter(e.target.value)}
        >
          <option value={"All"}>Alle</option>
          {categoryList.data != undefined
            ? categoryList.data.result.map((c) => (
                <option key={c.categoryid} value={c.categoryid}>
                  {c.categoryname}
                </option>
              ))
            : ""}
        </select>
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
              <th>Firma</th>
              <th>Kommission</th>
              {isAdmin ? <th>Action</th> : ""}
            </tr>
          </thead>
          {articleListToShow !== undefined ? (
            articleListToShow.map((c) => (
              <tbody key={c.articleid}>
                <tr>
                  <td>{c.articlename}</td>
                  <td>{c.count}</td>
                  <td>{c.unit}</td>
                  <td>{c.shelf}</td>
                  <td>{c.compartment}</td>
                  <td>{c.company}</td>
                  <td>{c.commission}</td>
                  {isAdmin ? (
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
                  ) : (
                    ""
                  )}
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
          <AddArticleForm
            onClose={() => setIsModalOpen(false)}
            setArticleCreated={setArticleCreated}
          />
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
