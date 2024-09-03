import React, { useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import WebsiteLayout from "./layouts/WebSiteLayout";
import AppLayout from "./layouts/AppLayout";
import "./App.module.css";

function AppContent() {
  const { user } = useContext(AuthContext);
  return user ? <AppLayout /> : <WebsiteLayout />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
