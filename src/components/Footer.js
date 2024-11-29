import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import {
  faArrowUp,
  faPaperPlane,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email soumis:", email);
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-background"></div>
      <div className="footer-content">
        <div className="footer-section brand">
          <h2 className="footer-logo">Rendez-Vous Parfait</h2>
          <p>Créez des moments inoubliables</p>
          <div className="location-pin">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
          </div>
        </div>
        <div className="footer-section links">
          <h3>Liens rapides</h3>
          <ul>
            <li>
              <a href="/accueil">Accueil</a>
            </li>
            <li>
              <a href="/recherche">Recherche</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/a-propos">À propos</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>
        <div className="footer-section social">
          <h3>Restez connecté</h3>
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="submit-btn">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
          <div className="social-icons">
            <a
              href="https://www.linkedin.com/company/rendez-vous-parfait"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon linkedin"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a
              href="https://facebook.com/MyTravelApp"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon facebook"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              href="https://instagram.com/rendezvousparfait.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon instagram"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Conçu avec passion par Rendez-Vous Parfait</p>
      </div>
      {isVisible && (
        <button onClick={scrollToTop} className="scroll-to-top">
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}
    </footer>
  );
}

export default Footer;
