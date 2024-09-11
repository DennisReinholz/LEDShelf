import "../styles/app.css";
import { createContext, useState, useEffect, useNavigate } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "../pages/Login.jsx";
import Applayout from "../pages/Applayout.jsx";
import { UserProvider } from "../helpers/userAuth.jsx";
import ShelfLayout from "../pages/ShelfLayout.jsx";
import CompartmentLayout from "../pages/CompartmentLayout.jsx";
import UserLayout from "../pages/UserLayout.jsx";
import ArticleLayout from "../pages/ArticleLayout.jsx";
import DeviceLayout from "../pages/DeviceLayout.jsx";
import CategoryLayout from "../pages/CategoryLayout.jsx";
import ServiceLayout from "../pages/ServiceLayout.jsx";
import Administration from "../pages/Administration.jsx";

function App() {
  return (
    <div className="container">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Navigate replace to="/login" />} />
            <Route path="login" element={<Login />} />
            <Route element={<Applayout />}>
              <Route path="regale" element={<ShelfLayout />} />
              <Route path="regale/:shelfid" element={<CompartmentLayout />} />
              <Route path="benutzer" element={<UserLayout />} />
              <Route path="artikel" element={<ArticleLayout />} />
              <Route path="geraete" element={<DeviceLayout />} />
              <Route path="kategorie" element={<CategoryLayout />} />
              <Route path="service" element={<ServiceLayout />} />
              <Route path="einstellung" element={<Administration />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptiotion={{
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
              backgroundColor: "var(--color-grey-0)",
              color: "var(--color-grey-700)",
            },
          }}
        />
      </UserProvider>
    </div>
  );
}

export default App;
