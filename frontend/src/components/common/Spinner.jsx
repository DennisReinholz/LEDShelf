import React from "react";
import styles from "../../styles/Common/spinner.module.css";
import PropTypes from "prop-types";

const Spinner = ({spinnerText}) => {
  return <div className={styles.spinner}>{spinnerText}</div>;
};
Spinner.propTypes = {
  spinnerText: PropTypes.string.isRequired,
};
export default Spinner;
