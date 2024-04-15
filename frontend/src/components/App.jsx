import "../styles/app.css";
import { createContext, useState, useEffect, useNavigate } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "../pages/Login.jsx";
import Main from "../pages/Main.jsx";
import Applayout from "../pages/Applayout.jsx";
import { UserProvider } from "../helpers/userAuth.jsx";
import ShelfLayout from "../pages/ShelfLayout.jsx";
import CompartmentLayout from "../pages/CompartmentLayout.jsx";

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
