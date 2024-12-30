import "./App.css";
import LoginPage from "./views/LoginPage";
import Dashboard from "./views/Dashboard";
import Stockpage from "./views/Stockpage";
import SideBar from "./components/SideBar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="*"
          element={
            <React.Fragment>
              <SideBar>
                <Routes>
                  <Route path="/" element={<Navigate to="/login" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/stock" element={<Stockpage />} />
                </Routes>
              </SideBar>
            </React.Fragment>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
