import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./index.css";
import GlobalStyle from "/src/component/global_style";
import { AuthProvider } from "/src/util/context/auth_context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <GlobalStyle>
        <App />
      </GlobalStyle>
    </AuthProvider>
  </React.StrictMode>
);
