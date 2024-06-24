import React from "react";
import styles from "../../styles/Article/articleFilter.module.css";

const ArticleFilter = ({
  handleCategoryFilter,
  categoryList,
  companyList,
  commissionList,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.filterRow}>
        <p>Kategorie</p>
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
      <div className={styles.filterRow}>
        <p>Firma</p>
        <select
          className={styles.categorySelection}
          onChange={(e) => handleCategoryFilter(e.target.value)}
        >
          <option value={"All"}>Alle</option>
          {companyList != undefined
            ? companyList.map((c) => (
                <option key={c.companyId} value={c.companyName}>
                  {c.companyName}
                </option>
              ))
            : ""}
        </select>
      </div>
      <div className={styles.filterRow}>
        <p>Kommission</p>
        <select
          className={styles.categorySelection}
          onChange={(e) => handleCategoryFilter(e.target.value)}
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
    </div>
  );
};

export default ArticleFilter;
