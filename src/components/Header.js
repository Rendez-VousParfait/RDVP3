import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faUser,
  faCaretDown,
  faCog,
  faBookmark,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import logo from "../assets/logo.png"; // Assurez-vous que le chemin vers votre logo est correct

function Header() {
  const { user } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        setIsVisible(false); // Scroll vers le bas
      } else {
        setIsVisible(true); // Scroll vers le haut
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Pour Mobile ou Chrome
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className={`header ${isVisible ? "visible" : "hidden"}`}>
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="RDVP2 Logo" className="logo-image" />
        </Link>
      </div>
      <button
        className="menu-toggle"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
      </button>
      <nav className={isMenuOpen ? "open" : ""}>
        <ul>
          <li className={location.pathname === "/" ? "selected" : ""}>
            <Link to="/" onClick={toggleMenu} aria-label="Accueil">
              Accueil
            </Link>
          </li>
          <li className={location.pathname === "/search" ? "selected" : ""}>
            <Link to="/search" onClick={toggleMenu} aria-label="Recherche">
              Recherche
            </Link>
          </li>
          <li className={location.pathname === "/blog" ? "selected" : ""}>
            <Link to="/blog" onClick={toggleMenu} aria-label="Blog">
              Blog
            </Link>
          </li>
          <li className={location.pathname === "/about" ? "selected" : ""}>
            <Link to="/about" onClick={toggleMenu} aria-label="À propos">
              À propos
            </Link>
          </li>
          <li className={location.pathname === "/contact" ? "selected" : ""}>
            <Link to="/contact" onClick={toggleMenu} aria-label="Contact">
              Contact
            </Link>
          </li>
          {user && user.email === "admin@example.com" && (
            <li
              className={
                location.pathname === "/admin/create-post" ? "selected" : ""
              }
            >
              <Link
                to="/admin/create-post"
                onClick={toggleMenu}
                aria-label="Créer un article"
              >
                Créer un article
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="auth-status">
        {user ? (
          <div className="account-dropdown">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <FontAwesomeIcon icon={faUser} className="user-icon" />
              <span className="user-email">{user.email}</span>
              <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon" />
            </button>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/profile" onClick={toggleDropdown}>
                    <FontAwesomeIcon icon={faUser} /> Mon Profil
                  </Link>
                </li>
                <li>
                  <Link to="/reservations" onClick={toggleDropdown}>
                    <FontAwesomeIcon icon={faBookmark} /> Mes Réservations
                  </Link>
                </li>
                <li>
                  <Link to="/parametres" onClick={toggleDropdown}>
                    <FontAwesomeIcon icon={faCog} /> Paramètres
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="auth-link login-btn">
              Connexion
            </Link>
            <Link to="/signup" className="auth-link signup-btn">
              Inscription
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
