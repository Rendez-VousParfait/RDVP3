import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faSwatchbook,
  faUsers,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./AppNavigation.module.css";

function AppNavigation() {
  return (
    <nav className={styles.appNavigation}>
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
  );
}

export default AppNavigation;
