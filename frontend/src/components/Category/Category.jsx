import React from "react";
import styles from "../../styles/Category/category.module.css";

const Category = ({ name }) => {
  return <div className={styles.container}>{name}</div>;
};

export default Category;
