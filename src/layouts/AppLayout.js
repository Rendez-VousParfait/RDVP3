import React from "react";
import { Route, Routes } from "react-router-dom";
import AppNavigation from "../layouts/AppNavigation";
import Dashboard from "../pages/Dashboard";
import Search from "../pages/Search";
import Profile from "../pages/Profile";
import BlogList from "../components/blog/BlogList";
import BlogPost from "../components/blog/BlogPost";
import SwiperPage from "../pages/SwiperPage";
import GroupInvitation from "../components/GroupInvitation";
import GroupManagement from "../components/GroupManagement";
import GroupDetails from "../components/GroupDetails";
import JoinGroup from "../components/JoinGroup";
import SearchResults from "../components/SearchResults";
import Catalog from "../components/Catalog";
import ItineraryReview from "../components/ItineraryReview";
import ItineraryHistory from "../components/ItineraryHistory"; // Nouvelle importation
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
          <Route path="/invitation/:groupId" element={<GroupInvitation />} />
          <Route path="/groups/:groupId" element={<GroupDetails />} />
          <Route path="/search-results/:groupId" element={<SearchResults />} />
          <Route path="/join-group/:groupId" element={<JoinGroup />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route
            path="/itinerary-review/:itineraryId"
            element={<ItineraryReview />}
          />
          <Route path="/itinerary-history" element={<ItineraryHistory />} />{" "}
          {/* Nouvelle route */}
        </Routes>
      </main>
      <AppNavigation />
    </div>
  );
}

export default AppLayout;
