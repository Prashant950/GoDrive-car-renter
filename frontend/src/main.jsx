import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "./store/index.js";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#00264d",
                color: "#fff",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 500,
                boxShadow: "0 12px 32px -8px rgba(0,38,77,0.5)",
              },
              success: { iconTheme: { primary: "#f5a623", secondary: "#00264d" } },
              error: {
                style: { background: "#b91c1c" },
                iconTheme: { primary: "#fff", secondary: "#b91c1c" },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
