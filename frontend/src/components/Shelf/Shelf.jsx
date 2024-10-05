import React from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineBars3 } from "react-icons/hi2";
import Modal from "../../components/common/Modal";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap Styles

const Shelf = ({ shelfname, place, shelfId, IsEdit, setIsEdit }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/regale/${shelfId}`);
  };

  const handleEdit = () => {
    console.log("open Modal");
  };

  return (
    <div
      className={`card ${IsEdit ? "border-warning" : "border-white"} mb-4`}
      onClick={IsEdit ? handleNavigate : handleEdit}
      style={{ width: "18rem", cursor: "pointer" }}
    >
      <div className="card-body">
        <div onClick={() => console.log(IsEdit)}>
          <HiOutlineBars3 />
        </div>
        <h5 className="card-title">{shelfname}</h5>
        <p className="card-text">Ort: {place}</p>
      </div>

      {IsEdit && (
        <Modal onClose={() => setIsEdit(false)}>
          {/* Modal Inhalt */}
        </Modal>
      )}
    </div>
  );
};

Shelf.propTypes = {
  shelfname: PropTypes.node.isRequired,
  place: PropTypes.node.isRequired,
  shelfId: PropTypes.node.isRequired,
  IsEdit: PropTypes.bool.isRequired,
  setIsEdit: PropTypes.func.isRequired,
};

export default Shelf;
