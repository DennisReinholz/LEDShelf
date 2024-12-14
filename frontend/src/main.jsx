import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.jsx";
import { ConfigProvider } from "./ConfigProvider";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
