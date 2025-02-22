import React, { useEffect, useState } from "react";
import styles from "../../styles/User/user.module.css";
import Modal from "../common/Modal";
import DeleteUserForm from "./DeleteUserForm";
import EditUser from "./EditUser";
import { Tooltip } from "react-tooltip";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import PropTypes from "prop-types";

const User = ({ name, role, setDeleteUser, setEditUser, userid, lastadmin }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {}, [deleteModalOpen]);
  
  return (
    <div className={styles.container}>
      <Tooltip anchorSelect=".edit" place="left">
        Benutzer bearbeiten
      </Tooltip>
      <Tooltip anchorSelect=".delete" place="left">
        Benutzer löschen
      </Tooltip>
      <div className={styles.userContent}>
        <p style={{ width: "2rem" }}>{userid}</p>
        <p style={{ width: "5rem" }}>{name}</p>
        <p style={{ width: "2rem" }}>{role}</p>
      </div>
      <div className={styles.editContainer}>
        <FiEdit2
          className="edit"
          style={{ cursor: "pointer" }}
          onClick={() => setEditModalOpen(true)}
        />
        {lastadmin || <BsTrash
          className="delete"
          style={{ cursor: "pointer" }}
          onClick={() => setDeleteModalOpen(true)}
        />}
      </div>
      {editModalOpen && (
        <Modal onClose={() => setEditModalOpen(false)}>
          <EditUser
            onClose={() => setEditModalOpen(false)}
            setEditUser={setEditUser}
            userid={userid}
            name={name}
            role={role}
          />
        </Modal>
      )}
      {deleteModalOpen && (
        <Modal onClose={() => setDeleteModalOpen(false)}>
          <DeleteUserForm
            onClose={() => setDeleteModalOpen(false)}
            setDeleteUser={setDeleteUser}
            name={name}
            role={role}
            userid={userid}
          />
        </Modal>
      )}
    </div>
  );
};

User.propTypes = {
  name: PropTypes.node.isRequired,
  role: PropTypes.node.isRequired,
  setDeleteUser: PropTypes.func.isRequired,
  setEditUser: PropTypes.func.isRequired,
  userid: PropTypes.node.isRequired,
  lastadmin: PropTypes.bool.isRequired,
};

export default User;
