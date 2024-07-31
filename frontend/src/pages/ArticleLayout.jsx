import React, { useEffect, useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styles from "../styles/articleLayout.module.css";
import Modal from "../components/common/Modal";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import AddArticleForm from "../components/Article/AddArticleForm";
import EditArticleForm from "../components/Article/EditArticleForm";
import DeleteArticleForm from "../components/Article/DeleteArticleForm";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../helpers/userAuth";
import ArticleFilter from "../components/Article/ArticleFilter";
import { Tooltip } from "react-tooltip";
import { FiAirplay } from "react-icons/fi";

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
  const [companyList, setCompanyList] = useState([]);
  const [commissionList, setCommissionList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const navigate = useNavigate();

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
        GetCompany(article);
        GetCommission(article);
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
  const handleEditArticle = (article) => {
    setEditArticleOpen(true);
    setEditArticle(article);
  };
  const handleDeleteArticle = (c) => {
    setDeleteArticleOpen(true);
    setSelectedArticle(c);
  };
  const handleArticleSearch = (search) => {
    setSearchArticle(search);
    setArticleListToShow(
      filteredArticleList.filter((article) =>
        article.articlename.toLowerCase().includes(search.toLocaleLowerCase())
      )
    );
  };
  const ApplyFilter = (categoryFilter, companyFilter, commissionFilter) => {
    if (
      categoryFilter === "All" &&
      companyFilter === "All" &&
      commissionFilter === "All"
    ) {
      setArticleListToShow(originArticleList);
    } else {
      let tempList = [];
      for (let index = 0; index < originArticleList.length; index++) {
        if (
          originArticleList[index].companyId == companyFilter &&
          commissionFilter == "All" &&
          categoryFilter == "All"
        ) {
          tempList.push(originArticleList[index]);
        } else if (
          originArticleList[index].commission == commissionFilter &&
          companyFilter == "All" &&
          categoryFilter == "All"
        ) {
          tempList.push(originArticleList[index]);
        } else if (
          companyFilter == "All" &&
          commissionFilter == "All" &&
          originArticleList[index].categoryid == categoryFilter
        ) {
          tempList.push(originArticleList[index]);
        } else if (
          companyFilter == "All" &&
          originArticleList[index].commission == commissionFilter &&
          originArticleList[index].categoryid == categoryFilter
        ) {
          tempList.push(originArticleList[index]);
        } else if (
          originArticleList[index].companyId == companyFilter &&
          commissionFilter == "All" &&
          originArticleList[index].categoryid == categoryFilter
        ) {
          tempList.push(originArticleList[index]);
        } else if (
          originArticleList[index].companyId == companyFilter &&
          originArticleList[index].commission == commissionFilter &&
          categoryFilter == "All"
        ) {
          tempList.push(originArticleList[index]);
        } else if (
          originArticleList[index].companyId == companyFilter &&
          originArticleList[index].commission == commissionFilter &&
          originArticleList[index].categoryid == categoryFilter
        ) {
          tempList.push(originArticleList[index]);
        }
      }
      setArticleListToShow(tempList);
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
  const GetCompany = (article) => {
    const uniqueCompanies = new Map();
    const filtered = article.filter((c) => {
      if (c.company && !uniqueCompanies.has(c.company)) {
        uniqueCompanies.set(c.company, {
          id: c.company,
          company: c.companyName,
        });
        return true;
      }
      return false;
    });
    setCompanyList(filtered);
  };
  const GetCommission = (article) => {
    const uniqueCompanies = new Map();
    const filtered = article.filter((c) => {
      if (c.commission && !uniqueCompanies.has(c.commission)) {
        uniqueCompanies.set(c.commission);
        return true;
      }
      return false;
    });
    setCommissionList(filtered);
  };
  const convertToCSV = (array) => {
    if (array.length === 0) return "";

    const keys = Object.keys(array[0]);
    const csvContent = [
      keys.join(";"), // Header Zeile
      ...array.map((item) => keys.map((key) => item[key]).join(";")),
    ].join("\n");
    return csvContent;
  };
  const ExportToCSV = () => {
    const csv = convertToCSV(articleListToShow);
    const utf8Bom = "\uFEFF";
    const csvWithBom = utf8Bom + csv;

    const blob = new Blob([csvWithBom], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "daten.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    const userStorage = localStorage.getItem("user");
    if (
      userStorage !== undefined ||
      (userStorage !== null && user === undefined)
    ) {
      setUser(JSON.parse(userStorage));
    }
    if (userStorage === null) {
      navigate("/login");
    }
  }, [deleteState, updateArticle, articleCreated]);
  return (
    <div className={styles.container}>
      <Tooltip anchorSelect=".edit" place="left">
        Bearbeiten des Artikels
      </Tooltip>
      <Tooltip anchorSelect=".delete" place="left">
        Löscht den Artikel
      </Tooltip>
      <Tooltip anchorSelect=".navigateShelf" place="left">
        Zum Regal
      </Tooltip>
      <div className={styles.buttonContainer}>
        {user != undefined
          ? user[0].role == 1 && (
              <button
                className="primaryButton"
                onClick={() => setIsModalOpen(true)}
              >
                Erstellen
              </button>
            )
          : ""}
        <input
          className={styles.inputSearch}
          type="text"
          placeholder="Suchen..."
          value={searchArticle}
          onChange={(e) => handleArticleSearch(e.target.value)}
        />
      </div>
      <div className={styles.content}>
        <div>
          <ArticleFilter
            categoryList={categoryList}
            companyList={companyList}
            commissionList={commissionList}
            setFilterList={setFilterList}
            ApplyFilter={ApplyFilter}
            exportToCSV={ExportToCSV}
            user={user}
          />
        </div>
        <div className={styles.tableContainer}>
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
                {user != undefined ? user[0].role == 1 && <th>Action</th> : ""}
              </tr>
            </thead>
            {articleListToShow !== undefined ? (
              articleListToShow.map((c) => (
                <tbody key={c.articleid}>
                  <button
                    onClick={() => console.log(c.minRequirement >= c.count)}
                  >
                    dawda
                  </button>
                  <tr
                    style={
                      c.count < c.minRequirement && c.minRequirement !== null
                        ? { border: "2px solid yellow" }
                        : { border: "2px solid white" }
                    }
                  >
                    <td>{c.articlename}</td>
                    <td>{c.count}</td>
                    <td>{c.unit}</td>
                    <td>{c.shelfname}</td>
                    <td>{c.compartmentname}</td>
                    <td>{c.companyName}</td>
                    <td>{c.commission}</td>
                    {user != undefined
                      ? user[0].role == 1 && (
                          <td>
                            <div className={styles.editContainer}>
                              <FiEdit2
                                className="edit"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleEditArticle(c)}
                              />
                              <BsTrash
                                className="delete"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleDeleteArticle(c)}
                              />
                              <FiAirplay
                                className="navigateShelf"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/regale/${c.shelf}`)}
                              />
                            </div>
                          </td>
                        )
                      : ""}
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
