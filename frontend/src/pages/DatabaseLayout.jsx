import React from "react";
import styles from "../styles/databaseLayout.module.css";
import DatabaseBackup from "../components/Database/DatabaseBackup";

const DatabaseLayout = () => {
  return (
    <div className={styles.container}>
      <DatabaseBackup />
    </div>
  );
};

export default DatabaseLayout;
