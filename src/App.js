import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import WebsiteLayout from "./layouts/WebSiteLayout";
import AppLayout from "./layouts/AppLayout";
import "./App.module.css";
import { useAuth } from "./hooks/useAuth";
import { AppProvider } from "./context/AppContext";
import { NavbarProvider } from "./contexts/NavbarContext";
import MoodForm from './pages/MoodForm';

function AppContent() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  return user ? (
    <NavbarProvider>
      <AppLayout />
    </NavbarProvider>
  ) : (
    <WebsiteLayout />
  );
}

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
