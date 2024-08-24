import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Search from "./pages/Search";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./pages/Profile";
import BlogList from "./components/blog/BlogList";
import BlogPost from "./components/blog/BlogPost";
import BlogForm from "./components/blog/BlogForm";
import PrivateRoute from "./components/PrivateRoute";
import "./App.module.css";
import "./pages/Home.css";

console.log("App.js is being executed");

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route
                path="/admin/create-post"
                element={
                  <PrivateRoute>
                    <BlogForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/parametres"
                element={
                  <PrivateRoute>
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;