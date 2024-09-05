import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBlog,
  faHeart,
  faFlag,
  faGlassMartini,
  faPaintBrush,
  faCamera,
  faMicrophone,
  faChevronRight,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Dashboard.module.css";

// Définition des constantes pour les médias
const heroVideo = "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-the-beach-1089-large.mp4";
const parisImage = "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const marseilleImage = "https://images.pexels.com/photos/4353229/pexels-photo-4353229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const bordeauxImage = "https://images.pexels.com/photos/6033986/pexels-photo-6033986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const lilleImage = "https://images.pexels.com/photos/16140703/pexels-photo-16140703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const lyonImage = "https://images.pexels.com/photos/13538314/pexels-photo-13538314.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const strasbourgImage = "https://images.pexels.com/photos/6143037/pexels-photo-6143037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

function Dashboard() {
  const [showBetaPopup, setShowBetaPopup] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [likedCards, setLikedCards] = useState({});
  const [selectedLocation, setSelectedLocation] = useState("Bordeaux");

  const locations = ["Bordeaux", "Paris", "Marseille", "Lyon", "Lille", "Strasbourg"];

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBetaClick = () => {
    setShowBetaPopup(true);
    setTimeout(() => setShowBetaPopup(false), 3000);
  };

  const handleLikeClick = (cardId) => {
    setLikedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.locationSelector}>
          <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.locationIcon} />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className={styles.locationSelect}
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.headerButtons}>
          <Link to="/profile" className={styles.iconButton}>
            <FontAwesomeIcon icon={faUser} />
          </Link>
          <Link to="/blog" className={styles.iconButton}>
            <FontAwesomeIcon icon={faBlog} />
          </Link>
          <button onClick={handleBetaClick} className={styles.betaButton}>
            Beta
          </button>
        </div>
      </header>

      <main className={styles.mainContainer}>
        <section className={styles.heroSection}>
          <video autoPlay muted loop className={styles.heroVideo}>
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className={styles.heroContent}>
            <h2>Découvrez {selectedLocation}</h2>
            <p>Vivez des expériences uniques</p>
            <button className={styles.newEscapeButton}>
              Planifier mon escapade
              <FontAwesomeIcon icon={faChevronRight} className={styles.buttonIcon} />
            </button>
          </div>
        </section>

        <section className={styles.exclusivities}>
          <h3>Exclusivités</h3>
          <div className={styles.cardContainer}>
            {[
              { id: "paris", img: parisImage, title: "Paris", desc: "La Ville de l'Amour" },
              { id: "marseille", img: marseilleImage, title: "Marseille", desc: "Eaux Turquoises du Sud" },
              { id: "lyon", img: lyonImage, title: "Lyon", desc: "Capitale Gastronomique" },
            ].map((card) => (
              <div key={card.id} className={styles.card}>
                <img src={card.img} alt={card.title} />
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`${styles.heartIcon} ${likedCards[card.id] ? styles.liked : ""}`}
                  onClick={() => handleLikeClick(card.id)}
                />
                <div className={styles.cardContent}>
                  <h4>{card.title}</h4>
                  <p>{card.desc}</p>
                  <button className={styles.cardButton}>Réserver</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.catalog}>
          <h3>Nos activités</h3>
          <div className={styles.catalogGrid}>
            {[
              { icon: faFlag, label: "Aventures" },
              { icon: faGlassMartini, label: "Vie nocturne" },
              { icon: faPaintBrush, label: "Arts & Culture" },
              { icon: faCamera, label: "Photographie" },
              { icon: faMicrophone, label: "Musique live" },
            ].map((item, index) => (
              <button key={index} className={styles.catalogButton}>
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.events}>
          <div className={styles.sectionHeader}>
            <h3>Événements à venir</h3>
            <Link to="/events" className={styles.seeMoreLink}>
              Voir plus
              <FontAwesomeIcon icon={faChevronRight} className={styles.linkIcon} />
            </Link>
          </div>
          <div className={styles.cardContainer}>
            {[
              { id: "bordeaux", img: bordeauxImage, title: "Festival du Vin", desc: "Meilleurs crus de la région" },
              { id: "lille", img: lilleImage, title: "Braderie de Lille", desc: "Plus grand marché aux puces" },
              { id: "strasbourg", img: strasbourgImage, title: "Marché de Noël", desc: "Magie des fêtes" },
            ].map((card) => (
              <div key={card.id} className={styles.card}>
                <img src={card.img} alt={card.title} />
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`${styles.heartIcon} ${likedCards[card.id] ? styles.liked : ""}`}
                  onClick={() => handleLikeClick(card.id)}
                />
                <div className={styles.cardContent}>
                  <h4>{card.title}</h4>
                  <p>{card.desc}</p>
                  <button className={styles.cardButton}>En savoir plus</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.newsletter}>
          <h3>Restez informé</h3>
          <p>Recevez nos meilleures offres</p>
          <form className={styles.newsletterForm}>
            <input type="email" placeholder="Votre e-mail" required />
            <button type="submit" className={styles.subscribeButton}>S'abonner</button>
          </form>
        </section>
      </main>

      {showBetaPopup && (
        <div className={styles.betaPopup}>Beta Test en cours...</div>
      )}
    </div>
  );
}

export default Dashboard;