import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

// Funktion, um zu prüfen, ob der Benutzer authentifiziert ist
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // Gibt true zurück, wenn ein Token vorhanden ist
};

const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  // Wenn der Benutzer authentifiziert ist, die Kinder-Komponente rendern
  return children;
};

export default PrivateRoute;

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };
