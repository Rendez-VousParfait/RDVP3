import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AppNavigation from "../layouts/AppNavigation";
import Dashboard from "../pages/Dashboard";
import Search from "../pages/Search";
import BlogList from "../components/blog/BlogList";
import BlogPost from "../components/blog/BlogPost";
import SwiperPage from "../pages/SwiperPage";
import BetaPage from "../pages/BetaPage";
import GroupManager from "../components/GroupManager";
import GroupDetails from "../components/GroupDetails";
import SearchResults from "../components/SearchResults";
import GroupSearchResultsDetail from "../components/GroupSearchResultsDetail";
import Catalog from "../components/Catalog";
import ItineraryReview from "../components/ItineraryReview";
import ItineraryHistory from "../components/ItineraryHistory";
import MoodForm from "../pages/MoodForm";
import Profile from "../pages/Profile";
import styles from "./AppLayout.module.css";
import { useAuth } from "../hooks/useAuth";

// Importations pour Slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function AppLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const isSwiperPage = location.pathname === "/swiper";
  const isBetaPage = location.pathname === "/beta";

  return (
    <div className={styles.appContainer}>
      <main className={styles.appContent}>
        {!isSwiperPage && !isBetaPage && <AppNavigation />}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/swiper" element={<SwiperPage />} />
          <Route path="/beta" element={<BetaPage />} />
          <Route path="/mood-form" element={<MoodForm />} />
          <Route path="/groups" element={<GroupManager />} />
          <Route path="/groups/:groupId" element={<GroupDetails />} />
          <Route path="/search-results/:groupId" element={<SearchResults />} />
          <Route
            path="/group/:groupId/search-results"
            element={<GroupSearchResultsDetail />}
          />
          <Route path="/catalog" element={<Catalog />} />
          <Route
            path="/itinerary-review/:itineraryId"
            element={<ItineraryReview />}
          />
          <Route path="/itinerary-history" element={<ItineraryHistory />} />
          <Route path="/join-group/:groupId" element={<GroupManager />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default AppLayout;
