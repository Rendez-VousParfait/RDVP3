import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faSwatchbook,
  faUsers,
  faHistory,
  faChevronUp,
  faChevronDown,
  faTimes,
  faArrowUp
} from "@fortawesome/free-solid-svg-icons";
import styles from "./AppNavigation.module.css";

function AppNavigation() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <nav className={`${styles.appNavigation} ${isCollapsed ? styles.collapsed : ''}`}>
        <button 
          className={styles.collapseButton}
          onClick={() => setIsCollapsed(true)}
          aria-label="Fermer le menu"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <FontAwesomeIcon icon={faHome} />
          <span>Accueil</span>
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <FontAwesomeIcon icon={faSearch} />
          <span>Recherche</span>
        </NavLink>
        <NavLink
          to="/swiper"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <FontAwesomeIcon icon={faSwatchbook} />
          <span>Swiper</span>
        </NavLink>
        <NavLink
          to="/groups"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <FontAwesomeIcon icon={faUsers} />
          <span>Groupes</span>
        </NavLink>
        <NavLink
          to="/itinerary-history"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <FontAwesomeIcon icon={faHistory} />
          <span>Historique</span>
        </NavLink>
      </nav>

      {isCollapsed && (
        <button
          className={styles.showNavButton}
          onClick={() => setIsCollapsed(false)}
          aria-label="Afficher le menu"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}
    </>
  );
}

export default AppNavigation;
