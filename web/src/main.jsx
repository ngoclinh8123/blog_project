import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./index.css";
import globalStyle from "./component/global_style";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <globalStyle>
      <App />
    </globalStyle>
  </React.StrictMode>
);
