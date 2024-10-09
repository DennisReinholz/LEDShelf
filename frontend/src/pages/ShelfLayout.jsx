import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Shelf from "../components/Shelf/Shelf";
import Modal from "../components/common/Modal";
import AddShelfForm from "../components/Shelf/AddShelfForm";
import { UserContext } from "../helpers/userAuth.jsx";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS importieren

const ShelfLayout = () => {
  const { user, setUser, token } = useContext(UserContext);
  const [shelfList, setShelfList] = useState();
  const [isShelfOpen, setIsShelfOpen] = useState(false);
  const [createdShelf, setCreatedShelf] = useState(false);
  const [shelfUpdated, setShelfUpdated] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  const getShelfs = async () => {
    const response = await fetch(`http://localhost:3000/getShelf`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-cache",
    });
    const data = await response.json();
    setShelfList(data.result);
  };

  const activateEdit = () => {
    setIsEdit((prevEdit) => !prevEdit);
  };

  useEffect(() => {
    getShelfs();

    const userStorage = localStorage.getItem("user");
    if (userStorage) {
      setUser(JSON.parse(userStorage));
    }
    if (!userStorage) {
      navigate("/login");
    }
    if (createdShelf) {
      getShelfs();
    }
  }, [createdShelf, isEdit, shelfUpdated]);

  return (
    <div className="container mt-4">
      {user && user.roleid === 1 && (
        <div className="d-flex justify-content-between mb-3">
          <button
            disabled={isEdit}
            className={`btn ${!isEdit ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setIsShelfOpen((o) => !o)}
          >
            Erstellen
          </button>
          <button className="btn btn-warning" onClick={activateEdit}>
            Bearbeiten
          </button>
        </div>
      )}

      <div className="row">
        {shelfList ? (
          shelfList.map((c) => (
            <div key={c.shelfid} className="col-lg-4 col-md-6 mb-4">
              <Shelf
                shelfname={c.shelfname}
                place={c.place}
                compartments={c.countCompartment}
                shelfId={c.shelfid}
                isEdit={isEdit}
                setShelfUpdated={setShelfUpdated}
              />
            </div>
          ))
        ) : (
          <p>Keine Regale vorhanden</p>
        )}
      </div>

      {isShelfOpen && (
        <Modal onClose={() => setIsShelfOpen(false)}>
          <AddShelfForm
            onClose={() => setIsShelfOpen(false)}
            setShelflist={setShelfList}
            shelflist={shelfList}
            setCreatedShelf={setCreatedShelf}
          />
        </Modal>
      )}
    </div>
  );
};

export default ShelfLayout;
