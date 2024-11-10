import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../helpers/userAuth";
import styles from "../styles/articleLayout.module.css";
import Modal from "../components/common/Modal";
import AddArticleForm from "../components/Article/AddArticleForm";
import EditArticleForm from "../components/Article/EditArticleForm";
import DeleteArticleForm from "../components/Article/DeleteArticleForm";
import toast from "react-hot-toast";
import ArticleFilter from "../components/Article/ArticleFilter";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import { FiAirplay } from "react-icons/fi";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { useConfig } from "../ConfigProvider";

const ArticleLayout = () => {
  const {user, setUser, token, setToken} = useContext(UserContext);
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
  const [originArticleList, setOriginArticleList] = useState([]);
  const [articleListToShow, setArticleListToShow] = useState([]);
  const [filteredArticleList, setFilteredArticleList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [commissionList, setCommissionList] = useState([]);
  const [articleRemoved, setArticleRemoved] = useState();
  const config = useConfig();
  const { backendUrl } = config || {};
  // eslint-disable-next-line no-unused-vars
  const [activeUser, setActiveUser] = useState();
  // eslint-disable-next-line no-unused-vars
  const [isAdmin, setIsAdmin] = useState();
  // eslint-disable-next-line no-unused-vars
  const [filterList, setFilterList] = useState([]);
  const navigate = useNavigate();

  const getArticle = async () => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/getAllArticle`, {
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
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/getCompartment`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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
    try {
        const response = await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/getShelf`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-cache",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
          const shelf = await response.json();
          setShelf(shelf);         
   
    } catch (error) {
        console.error("Error fetching shelf data:", error);
    }
};
  const getCategory = async () => {
    try {
        const response = await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/getCategory`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-cache",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data !== undefined ) {          
          GetCategory(data);
        } else {
          console.error("Expected data.result to be an array.");
        }

    } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Daten konnte nicht geladen werden, bitte überprüfen Sie das Backend");
    }
};
  const deleteArticle = async (article) => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/deleteArticle`, {
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
          console.log("gelöscht");
          toast.success("Artikel wurde gelöscht.");
          setDeleteState(false);
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
      categoryFilter == "All" &&
      companyFilter == "All" &&
      commissionFilter == "All"
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
          originArticleList[index].categoryid == categoryFilter.categoryid
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
          originArticleList[index].categoryid == categoryFilter.categoryid
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
      if (user.roleid == 1) {
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
  const GetCategory = (category) => {
    const {result} = category.data;
    const uniqueCategories = new Map();
    
    const filteredCategories = result.filter((category) => {
    //   // Assuming each article has 'categoryid' and 'categoryname'
     const { categoryid, categoryname } = category;
  
      // Check for unique categories based on categoryid
      if (categoryid && !uniqueCategories.has(categoryid)) {
        uniqueCategories.set(categoryid, categoryname);
        return true; // Include this article's category
      }
      return false; // Skip duplicates
    });
    
    // // Extract unique categories from the filtered articles
    const temp = filteredCategories.map(category => ({
      categoryid: category.categoryid,
      categoryname: category.categoryname
    }));  
     setCategoryList(temp); // Update the state with the unique categories
  };
  //Export function and convertion to an csv format
  //Properties which are exportet to csv
  const exportArticleProperties = [
    "articlename",
    "count",
    "unit",
    "categoryName",
    "shelfname",
    "commission",
    "companyName",
    "minRequirement",
  ];
  const filterArticleProperties = (articleList, propertyList) => {
    return articleList.map((article) => {
      let filteredArticle = {};
      propertyList.forEach((prop) => {
        if (Object.prototype.hasOwnProperty.call(article, prop)) {
          filteredArticle[prop] = article[prop];
        }
      });
      return filteredArticle;
    });
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
    const filteredArticle = filterArticleProperties(
      articleListToShow,
      exportArticleProperties
    );
    const csv = convertToCSV(filteredArticle);
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
    const userStorage = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      // Setze den Token in den Zustand oder Kontexts
      setToken(storedToken);
    }
    if (userStorage) {
      setUser(JSON.parse(userStorage));
    } 

    if (storedToken && userStorage) {
    // Wenn Token und Benutzer vorhanden sind, hole die Daten
      getArticle();
      getShelf();
      getCategory();
      handleUser();
    }

    if (deleteState) {
      deleteArticle(selectedArticle);
    }
    if (updateArticle) {
      getArticle();
      getShelf();
      getCompartments();
      setUpdateArticle(false);
    }
    if (articleCreated) {
      setArticleCreated(false);
    }
  
    if (userStorage === null) {
      navigate("/login");
    }
  }, [deleteState, updateArticle, articleCreated, articleRemoved, editArticle]);

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
      <Tooltip anchorSelect=".minRequirement" place="left">
        Mindestbestand erreicht
      </Tooltip>

      <div className={styles.buttonContainer}>
        {user != undefined
          ? user.roleid <= 2 && (
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
      {user ?
      ( <div>
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
      ) : null}
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
                {user != undefined ? user.roleid <= 2 && <th>Action</th> : ""}
              </tr>
            </thead>
            {articleListToShow !== undefined ? (
              articleListToShow.map((c) => (
                <tbody key={c.articleid}>
                  <tr
                    key={c.id}
                    style={{
                      backgroundColor:
                        c.count < c.minRequirement ? "#ebcf34" : "",
                      color: c.count < c.minRequirement ? "black" : "",
                    }}
                  >
                    <td>{c.articlename}</td>
                    <td>{c.count}</td>
                    <td>{c.unit}</td>
                    <td>{c.shelfname}</td>
                    <td>{c.compartmentname}</td>
                    <td>{c.companyName}</td>
                    <td>{c.commission}</td>
                    {user != undefined
                      ? user.roleid <= 2 && (
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
                              />{c.shelf != null &&
                              <FiAirplay
                                className="navigateShelf"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/regale/${c.shelf}`)}
                              />}
                              <div
                                className={
                                  !(c.count < c.minRequirement) &&
                                  styles.cautionOff
                                }
                              >
                                <HiOutlineExclamationTriangle
                                  className="minRequirement"
                                  onClick={() =>
                                    toast.error("Mindestbestand erreicht")
                                  }
                                />
                              </div>
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
            token={token}
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
            setArticleRemoved={setArticleRemoved}
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
