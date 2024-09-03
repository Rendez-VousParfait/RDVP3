import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faBlog,
  faHome,
  faHeart,
  faFlag,
  faGlassMartini,
  faPaintBrush,
  faCamera,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Dashboard.module.css";

const heroVideo =
  "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-the-beach-1089-large.mp4";
const parisImage =
  "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const marseilleImage =
  "https://images.pexels.com/photos/4353229/pexels-photo-4353229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const bordeauxImage =
  "https://images.pexels.com/photos/6033986/pexels-photo-6033986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const lilleImage =
  "https://images.pexels.com/photos/16140703/pexels-photo-16140703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Bordeaux, France</h1>
        <button className={styles.subscribeButton}>S'abonner</button>
      </header>

      <main>
        <section className={styles.heroSection}>
          <video autoPlay muted loop className={styles.heroVideo}>
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className={styles.heroContent}>
            <h2>Une envie d'évasion ?</h2>
            <button className={styles.newEscapeButton}>
              Ma nouvelle escapade
            </button>
          </div>
        </section>

        <section className={styles.exclusivities}>
          <h3>Les exclusivités du moment</h3>
          <div className={styles.cardContainer}>
            <div className={styles.card}>
              <img src={parisImage} alt="Paris" />
              <FontAwesomeIcon icon={faHeart} className={styles.heartIcon} />
              <div className={styles.cardContent}>
                <h4>Paris</h4>
                <p>Vivez la Magie de la Ville de l'Amour</p>
              </div>
            </div>
            <div className={styles.card}>
              <img src={marseilleImage} alt="Marseille" />
              <FontAwesomeIcon icon={faHeart} className={styles.heartIcon} />
              <div className={styles.cardContent}>
                <h4>Marseille</h4>
                <p>Plongez dans les Eaux Turquoises du Sud</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.catalog}>
          <h3>Consulter notre catalogue</h3>
          <div className={styles.catalogGrid}>
            {[
              { icon: faFlag, label: "Sensation" },
              { icon: faGlassMartini, label: "Fêtes" },
              { icon: faPaintBrush, label: "Musée" },
              { icon: faCamera, label: "Exposition" },
              { icon: faMicrophone, label: "Karaoké" },
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
            <h3>Les évènements du moment</h3>
            <Link to="/events" className={styles.seeMoreLink}>
              Voir plus
            </Link>
          </div>
          <div className={styles.cardContainer}>
            <div className={styles.card}>
              <img src={bordeauxImage} alt="Bordeaux" />
              <FontAwesomeIcon icon={faHeart} className={styles.heartIcon} />
              <div className={styles.cardContent}>
                <h4>Bordeaux</h4>
                <p>Profitez de l'Énergie des Vignobles</p>
              </div>
            </div>
            <div className={styles.card}>
              <img src={lilleImage} alt="Lille" />
              <FontAwesomeIcon icon={faHeart} className={styles.heartIcon} />
              <div className={styles.cardContent}>
                <h4>Lille</h4>
                <p>Découvrez les Charmes du Nord</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <nav className={styles.bottomNav}>
        <Link to="/" className={styles.navItem}>
          <FontAwesomeIcon icon={faHome} />
          <span>Accueil</span>
        </Link>
        <Link to="/search" className={styles.navItem}>
          <FontAwesomeIcon icon={faSearch} />
          <span>Rechercher</span>
        </Link>
        <Link to="/blog" className={styles.navItem}>
          <FontAwesomeIcon icon={faBlog} />
          <span>Blog</span>
        </Link>
        <Link to="/profile" className={styles.navItem}>
          <FontAwesomeIcon icon={faUser} />
          <span>Profil</span>
        </Link>
      </nav>
    </div>
  );
}

export default Dashboard;
