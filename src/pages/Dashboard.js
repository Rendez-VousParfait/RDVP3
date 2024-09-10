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
  faStar,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import styles from "./Dashboard.module.css";
import LocationSelector from "../components/LocationSelector";
import Tutorial from "../components/Tutorial";

const heroVideo = "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-the-beach-1089-large.mp4";
const parisImage = "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const marseilleImage = "https://images.pexels.com/photos/4353229/pexels-photo-4353229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const bordeauxImage = "https://images.pexels.com/photos/6033986/pexels-photo-6033986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const lilleImage = "https://images.pexels.com/photos/16140703/pexels-photo-16140703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const lyonImage = "https://images.pexels.com/photos/13538314/pexels-photo-13538314.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const strasbourgImage = "https://images.pexels.com/photos/6143037/pexels-photo-6143037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

function Dashboard() {
  const [showBetaPopup, setShowBetaPopup] = useState(false);
  const [likedCards, setLikedCards] = useState({});
  const [selectedLocation, setSelectedLocation] = useState("Bordeaux");
  const [showTutorial, setShowTutorial] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    const tutorialSeen = localStorage.getItem("tutorialSeen");
    if (!tutorialSeen) {
      setShowTutorial(true);
    }

    return () => clearTimeout(timer);
  }, []);

  const handleBetaClick = () => {
    setShowBetaPopup(true);
    setTimeout(() => setShowBetaPopup(false), 3000);
  };

  const handleLikeClick = (cardId) => {
    setLikedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        className={index < rating ? styles.starFilled : styles.starEmpty}
      />
    ));
  };

  const CustomDots = (dots) => (
    <div className={styles.customDots}>{dots}</div>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <CustomArrow icon={faChevronLeft} className={styles.slickPrev} />,
    nextArrow: <CustomArrow icon={faChevronRight} className={styles.slickNext} />,
    appendDots: CustomDots,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  function CustomArrow({ className, icon, onClick }) {
    return (
      <div className={`${styles.slickArrow} ${className}`} onClick={onClick}>
        <FontAwesomeIcon icon={icon} />
      </div>
    );
  }

  const cardData = [
    { id: "paris", img: parisImage, title: "Paris", desc: "La Ville de l'Amour", rating: 4 },
    { id: "marseille", img: marseilleImage, title: "Marseille", desc: "Eaux Turquoises du Sud", rating: 5 },
    { id: "lyon", img: lyonImage, title: "Lyon", desc: "Capitale Gastronomique", rating: 4 },
    { id: "bordeaux", img: bordeauxImage, title: "Bordeaux", desc: "Capitale du Vin", rating: 5 },
    { id: "lille", img: lilleImage, title: "Lille", desc: "Charme du Nord", rating: 4 },
    { id: "strasbourg", img: strasbourgImage, title: "Strasbourg", desc: "Cœur de l'Europe", rating: 5 },
  ];

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem("tutorialSeen", "true");
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
    localStorage.setItem("tutorialSeen", "true");
  };

  return (
    <div className={styles.dashboardWrapper}>
      <div className={`${styles.dashboard} ${isLoaded ? styles.dashboardLoaded : ''}`}>
        <header className={styles.dashboardHeader}>
          <LocationSelector
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
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

        <main className={styles.mainContent}>
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
            <Slider {...sliderSettings} className={styles.cardContainer}>
              {cardData.map((card) => (
                <div key={card.id} className={styles.cardWrapper}>
                  <div className={styles.card}>
                    <img src={card.img} alt={card.title} />
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`${styles.heartIcon} ${likedCards[card.id] ? styles.liked : ""}`}
                      onClick={() => handleLikeClick(card.id)}
                    />
                    <div className={styles.cardContent}>
                      <h4>{card.title}</h4>
                      <p>{card.desc}</p>
                      <div className={styles.rating}>{renderStars(card.rating)}</div>
                      <button className={styles.cardButton}>Réserver</button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
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
            <Slider {...sliderSettings} className={styles.cardContainer}>
              {cardData.map((card) => (
                <div key={card.id} className={styles.cardWrapper}>
                  <div className={styles.card}>
                    <img src={card.img} alt={card.title} />
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`${styles.heartIcon} ${likedCards[card.id] ? styles.liked : ""}`}
                      onClick={() => handleLikeClick(card.id)}
                    />
                    <div className={styles.cardContent}>
                      <h4>{card.title}</h4>
                      <p>{card.desc}</p>
                      <div className={styles.rating}>{renderStars(card.rating)}</div>
                      <button className={styles.cardButton}>En savoir plus</button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </section>

          <section className={styles.newsletter}>
            <h3>Restez informé</h3>
            <p>Recevez nos meilleures offres</p>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="Votre e-mail" required />
              <button type="submit" className={styles.subscribeButton}>
                S'abonner
              </button>
            </form>
          </section>
        </main>

        {showBetaPopup && (
          <div className={styles.betaPopup}>Beta Test en cours...</div>
        )}

        {showTutorial && (
          <Tutorial
            onComplete={handleTutorialComplete}
            onSkip={handleTutorialSkip}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;