import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../components/Login";
import Signup from "../components/Signup";
import BlogList from "../components/blog/BlogList";
import BlogPost from "../components/blog/BlogPost";
import styles from "./WebSiteLayout.module.css";

function WebsiteLayout() {
  return (
    <div className={styles.websiteContainer}>
      <header className={styles.header}>
        <Header />
      </header>
      <main className={styles.websiteContent}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPost />} />
        </Routes>
      </main>
      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  );
}

export default WebsiteLayout;
