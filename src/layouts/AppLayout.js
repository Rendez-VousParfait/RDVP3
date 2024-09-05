import React from "react";
import { Route, Routes } from "react-router-dom";
import AppNavigation from "../layouts/AppNavigation";
import Dashboard from "../pages/Dashboard";
import Search from "../pages/Search";
import Profile from "../pages/Profile";
import BlogList from "../components/blog/BlogList";
import BlogPost from "../components/blog/BlogPost";
import SwiperPage from "../pages/SwiperPage";
import GroupManagement from "../components/GroupManagement";
import GroupDetails from "../components/GroupDetails";
import styles from "./AppLayout.module.css";

// Importations pour Slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function AppLayout() {
  return (
    <div className={styles.appContainer}>
      <main className={styles.appContent}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/swiper" element={<SwiperPage />} />
          <Route path="/groups" element={<GroupManagement />} />
          <Route path="/groups/:groupId" element={<GroupDetails />} />
        </Routes>
      </main>
      <AppNavigation />
    </div>
  );
}

export default AppLayout;
