import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import { AuthProvider } from "./auth/auth.jsx";
import { CampaignProvider } from "./state/contextProvider.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CampaignProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2500,
              style: {
                borderRadius: "8px",
                fontWeight: "600",
              },
            }}
          />
        </CampaignProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);






