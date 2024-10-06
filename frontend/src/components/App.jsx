import "../styles/app.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "../helpers/userAuth.jsx";
import Login from "../pages/Login.jsx";
import Applayout from "../pages/Applayout.jsx";
import ShelfLayout from "../pages/ShelfLayout.jsx";
import CompartmentLayout from "../pages/CompartmentLayout.jsx";
import UserLayout from "../pages/UserLayout.jsx";
import ArticleLayout from "../pages/ArticleLayout.jsx";
import DeviceLayout from "../pages/DeviceLayout.jsx";
import CategoryLayout from "../pages/CategoryLayout.jsx";
import ServiceLayout from "../pages/ServiceLayout.jsx";
import Administration from "../pages/Administration.jsx";
import PrivateRoute from "../helpers/PrivateRoute.jsx";

function App() {
  return (
    <div className="container">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {/* Standardroute leitet zu /login weiter */}
            <Route index element={<Navigate replace to="/login" />} />
            
            {/* Öffentliche Route: Login */}
            <Route path="login" element={<Login />} />
            
            {/* Geschützte Routen */}
            <Route element={<Applayout />}>
              <Route
                path="regale"
                element={
                  <PrivateRoute>
                    <ShelfLayout />
                  </PrivateRoute>
                }
              />
              <Route
                path="regale/:shelfid"
                element={
                  <PrivateRoute>
                    <CompartmentLayout />
                  </PrivateRoute>
                }
              />
              <Route
                path="benutzer"
                element={
                  <PrivateRoute>
                    <UserLayout />
                  </PrivateRoute>
                }
              />
              <Route
                path="artikel"
                element={
                  <PrivateRoute>
                    <ArticleLayout />
                  </PrivateRoute>
                }
              />
              <Route
                path="geraete"
                element={
                  <PrivateRoute>
                    <DeviceLayout />
                  </PrivateRoute>
                }
              />
              <Route
                path="kategorie"
                element={
                  <PrivateRoute>
                    <CategoryLayout />
                  </PrivateRoute>
                }
              />
              <Route
                path="service"
                element={
                  <PrivateRoute>
                    <ServiceLayout />
                  </PrivateRoute>
                }
              />
              <Route
                path="einstellung"
                element={
                  <PrivateRoute>
                    <Administration />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
        {/* Toast-Benachrichtigungen */}
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 500,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "white",
              color: "var(--color-grey-700)",
            },
          }}
        />
      </UserProvider>
    </div>
  );
}

export default App;
