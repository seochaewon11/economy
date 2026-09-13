import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// TEMP: Vercel 배포 환경변수 진단용 (원인 확인 후 제거 예정)
console.log("[env-debug] import.meta.env =", import.meta.env);
console.log("[env-debug] VITE_AIRKOREA_SERVICE_KEY =", import.meta.env.VITE_AIRKOREA_SERVICE_KEY);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
