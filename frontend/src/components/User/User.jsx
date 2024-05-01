import React, { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import styles from "../../styles/User/user.module.css";
import Modal from "../common/Modal";
import DeleteUserForm from "./DeleteUserForm";
import EditUser from "./EditUser";

const User = ({ name, role, setDeleteUser, setEditUser, userid }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {}, [deleteModalOpen]);
  return (
    <div className={styles.container}>
      <div className={styles.userContent}>
        <p>{name}</p>
        <p>{role}</p>
      </div>
      <div className={styles.editContainer}>
        <FiEdit2
          style={{ cursor: "pointer" }}
          onClick={() => setEditModalOpen(true)}
        />
        <BsTrash
          style={{ cursor: "pointer" }}
          onClick={() => setDeleteModalOpen(true)}
        />
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

export default User;
