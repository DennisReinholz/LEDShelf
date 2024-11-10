import React, { useState } from "react";
import styles from "../../styles/Shelf/shelf.module.css";
import { useNavigate } from "react-router-dom";
import { BiRename } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { MdPlace } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";
import Modal from "../common/Modal";
import EditShelfForm from "./EditShelfForm";
import PropTypes from "prop-types";
import { useConfig } from "../../ConfigProvider";

const Shelf = ({ shelfname, place, shelfId, isEdit, setShelfUpdated }) => {
  const [replaceIsOpen, setReplaceIsOpen] = useState(false);
  const [renameIsOpen, setRenameIsOpen] = useState(false);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const config = useConfig();
  const { backendUrl } = config || {};
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    navigate(`/regale/${shelfId}`);
  };
  const handleReplace = async (place) => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/replaceShelf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify({ place, shelfId }),
    }).then((result) => {
      if (result.status === 200) {
        setShelfUpdated(true);
        toast.success("Regal wurde an einem anderen Ort plaziert");
        setReplaceIsOpen(false);
      } else {
        toast.error("Regal wurde nicht umgestellt");
      }
    });
  };
  const handleRename = async (shelfname) => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/renameShelf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify({ shelfname, shelfId }),
    }).then((result) => {
      if (result.status === 200) {
        setShelfUpdated(true);
        toast.success("Regal wurde an einem anderen Ort plaziert");
        setRenameIsOpen(false);
      } else {
        toast.error("Regal wurde nicht umgestellt");
      }
    });
  };
  const handleDelete = async () => {
    await fetch(`http://${backendUrl===undefined?config.localhost:backendUrl}:3000/deleteShelf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify({ shelfId }),
    }).then((result) => {
      if (result.status === 200) {
        setShelfUpdated(true);
        toast.success("Regal wurde an einem anderen Ort plaziert");
        setDeleteIsOpen(false);
      } else {
        toast.error("Regal wurde nicht umgestellt");
      }
    });
  };

  return (
    <React.Fragment>
    <Tooltip anchorSelect="placeIcon" place="right">
    Starte ein manuelles Backup der Datenbank
  </Tooltip>
    <div className={styles.contentContainer}>
      <div
        className={!isEdit? styles.container: styles.isEditActive}
        onClick={()=>handleNavigate()}
     >
      <div className={styles.content}>
        <p>{shelfname} </p>
        <p>Ort: {place}</p>
      </div>
    </div>
   {isEdit && 
   <div className={styles.buttonContainer}>
      <MdPlace id="placeIcon" className={styles.replaceButton} onClick={() => setReplaceIsOpen(true)}/>
      <BiRename className={styles.renameButton} onClick={() => setRenameIsOpen(true)}/>
      <BsTrash className={styles.deleteButton} onClick={() => setDeleteIsOpen(true)}/>
    </div>}
    {replaceIsOpen && (
        <Modal onClose={() => setReplaceIsOpen(false)}>
          <EditShelfForm
            onClose={() => setReplaceIsOpen(false)}
            question={"Wo steht das Regal?"}
            caption="Ort des Regals ändern"
            inputValue={place}
            updateFunction={handleReplace}
            inputEnable={true}
          />
        </Modal>
      )}   
      {renameIsOpen && (
        <Modal onClose={() => setRenameIsOpen(false)}>
          <EditShelfForm
            onClose={() => setRenameIsOpen(false)}
            question={"Wie soll das Regal heißen?"}
            caption="Regal umbenennen"
            inputValue={shelfname}
            updateFunction={handleRename}
            inputEnable={true}
          />
        </Modal>
      )} 
      {deleteIsOpen && (
        <Modal onClose={() => setDeleteIsOpen(false)}>
          <EditShelfForm
            onClose={() => setDeleteIsOpen(false)}
            question={
              <>
                Das Regal <strong>{shelfname}</strong> wirklich löschen?
              </>
            }
            caption="Regal löschen"
            inputValue={shelfname}
            updateFunction={handleDelete}
            inputEnable={false}
          />
        </Modal>
      )} 
  </div>
  </React.Fragment>
  );
};
Shelf.propTypes = {
  shelfname: PropTypes.node.isRequired,
  place: PropTypes.node.isRequired,
  shelfId: PropTypes.node.isRequired,
  isEdit: PropTypes.bool.isRequired,
  setShelfUpdated: PropTypes.func.isRequired
};

export default Shelf;
