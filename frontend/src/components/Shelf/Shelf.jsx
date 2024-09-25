import React from "react";
import styles from "../../styles/Shelf/shelf.module.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Shelf = ({ shelfname, place, shelfId }) => {
  const navigate = useNavigate();
  return (
    <div
      className={styles.container}
      onClick={() => navigate(`/regale/${shelfId}`)}
    >
      <div className={styles.content}>
        <p>{shelfname} </p>
        <p>Ort: {place}</p>
      </div>
    </div>
  );
};
Shelf.propTypes = {
  shelfname: PropTypes.node.isRequired,
  place: PropTypes.node.isRequired,
  shelfId: PropTypes.node.isRequired,
};

export default Shelf;
