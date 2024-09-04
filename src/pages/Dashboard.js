// Dashboard.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, Newspaper, Flag, Beer, PaintBrush, Camera, Microphone, Heart } from "phosphor-react";
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
  const [showBetaPopup, setShowBetaPopup] = useState(false);

  const handleBetaClick = () => {
    setShowBetaPopup(true);
    setTimeout(() => setShowBetaPopup(false), 3000);
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Bordeaux, France</h1>
        <div className={styles.headerButtons}>
          <Link to="/profile" className={styles.iconButton}>
            <User size={24} />
          </Link>
          <Link to="/blog" className={styles.iconButton}>
            <Newspaper size={24} />
          </Link>
          <button onClick={handleBetaClick} className={styles.betaButton}>Beta Test</button>
        </div>
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
              <Heart size={24} className={styles.heartIcon} />
              <div className={styles.cardContent}>
                <h4>Paris</h4>
                <p>Vivez la Magie de la Ville de l'Amour</p>
              </div>
            </div>
            <div className={styles.card}>
              <img src={marseilleImage} alt="Marseille" />
              <Heart size={24} className={styles.heartIcon} />
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
              { icon: Flag, label: "Sensation" },
              { icon: Beer, label: "Fêtes" },
              { icon: PaintBrush, label: "Musée" },
              { icon: Camera, label: "Exposition" },
              { icon: Microphone, label: "Karaoké" },
            ].map((item, index) => (
              <button key={index} className={styles.catalogButton}>
                <item.icon size={32} />
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
              <Heart size={24} className={styles.heartIcon} />
              <div className={styles.cardContent}>
                <h4>Bordeaux</h4>
                <p>Profitez de l'Énergie des Vignobles</p>
              </div>
            </div>
            <div className={styles.card}>
              <img src={lilleImage} alt="Lille" />
              <Heart size={24} className={styles.heartIcon} />
              <div className={styles.cardContent}>
                <h4>Lille</h4>
                <p>Découvrez les Charmes du Nord</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {showBetaPopup && (
        <div className={styles.betaPopup}>
          Beta Test en cours...
        </div>
      )}
    </div>
  );
}

export default Dashboard;