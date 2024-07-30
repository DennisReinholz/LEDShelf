import React, { useState, useEffect } from "react";
import styles from "../../styles/Article/articleFilter.module.css";

const ArticleFilter = ({
  categoryList,
  companyList,
  commissionList,
  setFilterList,
  ApplyFilter,
  exportToCSV,
  user,
}) => {
  const [categoryFilter, setCategoryFilter] = useState();
  const [companyFilter, setCompanyFilter] = useState();
  const [commissionFilter, setCommissionFilter] = useState();

  const GetFilter = (event) => {
    if (event.name === "categoryFilter") {
      setCategoryFilter(event.value);
      setFilterList((prevFilterList) => {
        const newFilterList = [...prevFilterList];
        newFilterList[0] = event.value;
        return newFilterList;
      });
    } else if (event.name === "companyFilter") {
      setCompanyFilter(event.value);
      setFilterList((prevFilterList) => {
        const newFilterList = [...prevFilterList];
        newFilterList[1] = event.value;
        return newFilterList;
      });
    } else if (event.name === "commissionFilter") {
      setCommissionFilter(event.value);
      setFilterList((prevFilterList) => {
        const newFilterList = [...prevFilterList];
        newFilterList[2] = event.value;
        return newFilterList;
      });
    }
  };
  useEffect(() => {
    const newFilterList = [];

    if (categoryList.data && categoryList.data.result.length > 0) {
      const initialCategory = "All";
      setCategoryFilter(initialCategory);
      newFilterList[0] = initialCategory;
    }

    if (companyList && companyList.length > 0) {
      const initialCompany = "All";
      setCompanyFilter(initialCompany);
      newFilterList[1] = initialCompany;
    }

    if (commissionList && commissionList.length > 0) {
      const initialCommission = "All";
      setCommissionFilter(initialCommission);
      newFilterList[2] = initialCommission;
    }

    setFilterList(newFilterList);
  }, [categoryList, companyList, commissionList, setFilterList]);
  return (
    <div className={styles.container}>
      <div className={styles.filterRow}>
        <p>Kategorie</p>
        <select
          name="categoryFilter"
          className={styles.categorySelection}
          onChange={(e) =>
            GetFilter({ name: e.target.name, value: e.target.value })
          }
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
      <div className={styles.filterRow}>
        <p>Firma</p>
        <select
          name="companyFilter"
          className={styles.categorySelection}
          onChange={(e) =>
            GetFilter({ name: e.target.name, value: e.target.value })
          }
        >
          <option value={"All"}>Alle</option>
          {companyList != undefined
            ? companyList.map((c) => (
                <option key={c.companyId} value={c.companyId}>
                  {c.companyName}
                </option>
              ))
            : ""}
        </select>
      </div>
      <div className={styles.filterRow}>
        <p>Kommission</p>
        <select
          name="commissionFilter"
          className={styles.categorySelection}
          onChange={(e) =>
            GetFilter({ name: e.target.name, value: e.target.value })
          }
        >
          <option value={"All"}>Alle</option>
          {commissionList != undefined
            ? commissionList.map((c) => (
                <option key={c.articleid} value={c.commission}>
                  {c.commission}
                </option>
              ))
            : ""}
        </select>
      </div>
      <div className={styles.buttonContainer}>
        <button
          className="primaryButton"
          onClick={() =>
            ApplyFilter(categoryFilter, companyFilter, commissionFilter)
          }
        >
          Filter
        </button>
        {user[0].role === 1 && (
          <button className="primaryButton" onClick={() => exportToCSV()}>
            Exportieren
          </button>
        )}
      </div>
    </div>
  );
};

export default ArticleFilter;
