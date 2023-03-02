import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import GlobalStyle from "./components/global_style";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalStyle>
      <App />
    </GlobalStyle>
  </React.StrictMode>
);
