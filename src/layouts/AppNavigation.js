import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch, faUser, faBlog } from "@fortawesome/free-solid-svg-icons";
import styles from "./AppNavigation.module.css";

function AppNavigation() {
  return (
    <nav className={styles.appNavigation}>
      <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ""}>
        <FontAwesomeIcon icon={faHome} />
        <span>Accueil</span>
      </NavLink>
      <NavLink to="/search" className={({ isActive }) => isActive ? styles.active : ""}>
        <FontAwesomeIcon icon={faSearch} />
        <span>Recherche</span>
      </NavLink>
      <NavLink to="/blog" className={({ isActive }) => isActive ? styles.active : ""}>
        <FontAwesomeIcon icon={faBlog} />
        <span>Blog</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? styles.active : ""}>
        <FontAwesomeIcon icon={faUser} />
        <span>Profil</span>
      </NavLink>
    </nav>
  );
}

export default AppNavigation;