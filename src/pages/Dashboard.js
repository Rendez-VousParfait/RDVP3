import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBlog,
  faHeart,
  faChevronRight,
  faStar,
  faChevronLeft,
  faEuroSign,
  faBed,
  faUtensils,
  faWalking,
  faClock,
  faTimes,
  faCalendar,
  faCheck,
  faUsers,
  faMagicWandSparkles,
  faQuestionCircle,
  faCalendarCheck,
  faClipboardList,
  faChartLine,
  faLightbulb,
  faGift,
  faPercent,
  faEnvelope,
  faArrowRight,
  faShieldHeart,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import styles from "./Dashboard.module.css";
import LocationSelector from "../components/LocationSelector";
import Tutorial from "../components/Tutorial";
import { motion } from "framer-motion";

const heroVideo = "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-the-beach-1089-large.mp4";
const parisImage = "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const marseilleImage = "https://images.pexels.com/photos/4353229/pexels-photo-4353229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const bordeauxImage = "https://images.pexels.com/photos/6033986/pexels-photo-6033986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const lilleImage = "https://images.pexels.com/photos/16140703/pexels-photo-16140703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const lyonImage = "https://images.pexels.com/photos/13538314/pexels-photo-13538314.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const strasbourgImage = "https://images.pexels.com/photos/6143037/pexels-photo-6143037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const vineyardImage = "https://images.unsplash.com/photo-1464638681273-0962e9b53566?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";
const cityNightImage = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";
const gastroImage = "https://images.unsplash.com/photo-1414541944151-2f3ec1cfd87d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";

const hotelImages = {
  chateauDauphine: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1450&q=80",
  intercontinental: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  sourcesCaudalie: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
};

const restaurantImages = {
  terrasseRouge: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  pressoir: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  grandVigne: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
};

const activityImages = {
  vineyard: "https://images.unsplash.com/photo-1507934841708-2807c458a3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  cruise: "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  perfume: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
};

function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState("Bordeaux");
  const [showTutorial, setShowTutorial] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const explanationModalRef = useRef(null);
  const [showMoodExplanation, setShowMoodExplanation] = useState(false);
  const moodExplanationModalRef = useRef(null);

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
    { 
      id: "paris", 
      img: parisImage, 
      title: "Festival des Lumières à Paris", 
      desc: "Une expérience immersive unique au cœur de la Ville Lumière", 
      rating: 4,
      date: "24-26 Déc",
      price: 45,
      tag: "POPULAIRE"
    },
    { 
      id: "marseille", 
      img: marseilleImage, 
      title: "Croisière Sunset & Jazz", 
      desc: "Soirée musicale avec vue sur les Calanques", 
      rating: 5,
      date: "Tous les Vendredis",
      price: 75,
      tag: "NOUVEAU"
    },
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

  const featuredItineraries = [
    {
      id: "romantic-vineyard",
      title: "Escapade Romantique dans le Vignoble",
      totalPrice: 342,
      image: vineyardImage,
      tag: "BEST-SELLER",
      matchingScore: 80,
      highlighted: true,
      items: [
        {
          type: "hotel",
          name: "Château de la Dauphine",
          description: "Un château élégant avec des chambres luxueuses et une vue imprenable sur les vignobles.",
          price: 180,
          image: hotelImages.chateauDauphine
        },
        {
          type: "restaurant",
          name: "La Terrasse Rouge",
          description: "Un restaurant gastronomique avec une terrasse offrant une vue panoramique sur les vignobles.",
          price: 90,
          image: restaurantImages.terrasseRouge
        },
        {
          type: "activity",
          name: "Visite privée des vignobles et dégustation de vins",
          description: "Une visite guidée des vignobles de Saint-Émilion suivie d'une dégustation de vins.",
          price: 72,
          image: activityImages.vineyard
        }
      ]
    },
    {
      id: "romantic-city",
      title: "Soirée Romantique en Ville",
      totalPrice: 615.6,
      image: cityNightImage,
      tag: "NOUVEAU",
      items: [
        {
          type: "hotel",
          name: "InterContinental Bordeaux - Le Grand Hôtel",
          description: "Un hôtel de luxe en plein cœur de Bordeaux avec des chambres élégantes et un spa.",
          price: 324,
          image: hotelImages.intercontinental
        },
        {
          type: "restaurant",
          name: "Le Pressoir d'Argent Gordon Ramsay",
          description: "Un restaurant étoilé Michelin offrant une cuisine raffinée et une ambiance intime.",
          price: 162,
          image: restaurantImages.pressoir
        },
        {
          type: "activity",
          name: "Croisière romantique sur la Garonne",
          description: "Une croisière privée sur la Garonne avec vue sur les monuments emblématiques de Bordeaux.",
          price: 129.6,
          image: activityImages.cruise
        }
      ]
    },
    {
      id: "discovery-gastronomy",
      title: "Journée Découverte et Gastronomie",
      totalPrice: 615.6,
      image: gastroImage,
      tag: "PREMIUM",
      items: [
        {
          type: "hotel",
          name: "Les Sources de Caudalie",
          description: "Un hôtel spa situé au milieu des vignobles, offrant des chambres confortables et des soins de bien-être.",
          price: 324,
          image: hotelImages.sourcesCaudalie
        },
        {
          type: "restaurant",
          name: "La Grand'Vigne",
          description: "Un restaurant gastronomique situé dans l'hôtel, offrant une cuisine raffinée et des vins locaux.",
          price: 162,
          image: restaurantImages.grandVigne
        },
        {
          type: "activity",
          name: "Atelier de création de parfum",
          description: "Un atelier interactif où les couples peuvent créer leur propre parfum personnalisé.",
          price: 129.6,
          image: activityImages.perfume
        }
      ]
    }
  ];

  const handleImageClick = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden"; // Empêche le défilement du body
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto"; // Réactive le défilement du body
  };

  const handleStartSwiping = () => {
    navigate("/swiper");
  };

  const explanationSteps = [
    {
      title: "Découvrez",
      icon: faHeart,
      description: "Swipez à travers notre catalogue d'activités et créez votre collection de favoris en quelques minutes.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Personnalisez",
      icon: faMagicWandSparkles,
      description: "Notre algorithme apprend de vos préférences pour vous suggérer les activités qui vous correspondent le mieux.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Réservez",
      icon: faCalendarCheck,
      description: "Réservez directement depuis votre catalogue de likes ou créez votre propre itinéraire personnalisé.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    }
  ];

  const handleShowExplanation = () => {
    setShowExplanation(true);
    setTimeout(() => {
      explanationModalRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  const handleShowMoodExplanation = () => {
    setShowMoodExplanation(true);
    setTimeout(() => {
      moodExplanationModalRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  const moodExplanationSteps = [
    {
      title: "Personnalisation",
      icon: faMagicWandSparkles,
      description: "Répondez à quelques questions simples sur vos préférences et votre style de voyage.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Analyse",
      icon: faChartLine,
      description: "Notre algorithme analyse vos réponses pour comprendre vos goûts et vos envies.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Recommandations",
      icon: faLightbulb,
      description: "Recevez des suggestions d'activités et d'itinéraires parfaitement adaptés à vos attentes.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    }
  ];

  return (
    <div className={styles.dashboardWrapper}>
      <div className={`${styles.dashboard} ${isLoaded ? styles.dashboardLoaded : ""}`}>
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
            <Link to="/mood-form" className={`${styles.moodButton} ${styles.headerLink}`}>
              Mood Form
            </Link>
            <Link to="/beta" className={`${styles.betaButton} ${styles.betaLink}`}>
              Accès Beta
            </Link>
          </div>
        </header>

        <button 
          className={styles.howItWorksButton}
          onClick={() => setShowHowItWorks(true)}
        >
          <FontAwesomeIcon icon={faQuestionCircle} className={styles.questionIcon} />
          Comment ça marche ?
        </button>

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

          <section className={styles.featuredItineraries}>
            <h3>Nos Itinéraires du Moment</h3>
            <div className={styles.itinerariesGrid}>
              {featuredItineraries.map((itinerary, index) => (
                <div 
                  key={itinerary.id} 
                  className={`${styles.itineraryCard} ${itinerary.highlighted ? styles.highlightedCard : ''}`}
                  style={{"--card-index": index}}
                >
                  <div className={styles.itineraryImageContainer}>
                    <img 
                      src={itinerary.image} 
                      alt={itinerary.title} 
                      className={styles.itineraryImage}
                    />
                    <span className={styles.itineraryTag}>{itinerary.tag}</span>
                    {itinerary.matchingScore && (
                      <div className={styles.matchingScore}>
                        <FontAwesomeIcon icon={faMagicWandSparkles} className={styles.matchingIcon} />
                        {itinerary.matchingScore}% de matching
                      </div>
                    )}
                    <div className={styles.durationBadge}>
                      <FontAwesomeIcon icon={faClock} />
                      {itinerary.duration || "1 journée"}
                    </div>
                  </div>
                  <div className={styles.itineraryContent}>
                    <div className={styles.itineraryHeader}>
                      <h4>{itinerary.title}</h4>
                      <div className={styles.totalPrice}>
                        <FontAwesomeIcon icon={faEuroSign} />
                        {itinerary.totalPrice}
                      </div>
                    </div>
                    <div className={styles.itineraryItems}>
                      {itinerary.items.map((item, index) => (
                        <div key={index} className={styles.itineraryItem}>
                          <div 
                            className={styles.itemImageContainer}
                            onClick={() => handleImageClick(item.image)}
                          >
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className={styles.itemImage}
                            />
                          </div>
                          <div className={styles.itemContent}>
                            <div className={styles.iconContainer}>
                              <FontAwesomeIcon
                                icon={
                                  item.type === "hotel"
                                    ? faBed
                                    : item.type === "restaurant"
                                    ? faUtensils
                                    : faWalking
                                }
                                className={styles.itemIcon}
                              />
                            </div>
                            <div className={styles.itemDetails}>
                              <h5>{item.name}</h5>
                              <p>{item.description}</p>
                              <span className={styles.itemPrice}>{item.price}€</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.cardButtons}>
                      <button className={styles.bookButton}>
                        Réserver cet itinéraire
                        <FontAwesomeIcon icon={faChevronRight} className={styles.buttonIcon} />
                      </button>
                      <button 
                        className={styles.customizeButton}
                        onClick={handleStartSwiping}
                      >
                        <FontAwesomeIcon icon={faHeart} className={styles.buttonIcon} />
                        Découvrir en swipant
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.actionsGrid}>
            <div className={styles.actionCard}>
              <span className={`${styles.badge} ${styles.badgePopular}`}>POPULAIRE</span>
              <h3>Swiper & Découvrir</h3>
              <p>
                Explorez notre catalogue d'activités de manière ludique et intuitive.
                Swipez pour créer votre collection personnelle d'expériences à vivre.
              </p>
              <div className={styles.actionButtons}>
                <button 
                  className={styles.actionButton}
                  onClick={() => navigate('/swiper')}
                >
                  <FontAwesomeIcon icon={faHeart} />
                  Commencer à swiper
                </button>
                <button 
                  className={styles.secondaryButton}
                  onClick={handleShowExplanation}
                >
                  En savoir plus
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </button>
              </div>
            </div>

            <div className={styles.actionCard}>
              <span className={`${styles.badge} ${styles.badgeNew}`}>NOUVEAU</span>
              <h3>Formulaire Mood</h3>
              <p>
                Personnalisez votre expérience en quelques clics.
                Laissez-nous vous guider vers des activités qui vous correspondent.
              </p>
              <div className={styles.actionButtons}>
                <button 
                  className={styles.actionButton}
                  onClick={() => navigate('/mood-form')}
                >
                  <FontAwesomeIcon icon={faClipboardList} />
                  Commencer le questionnaire
                </button>
                <button 
                  className={styles.secondaryButton}
                  onClick={handleShowMoodExplanation}
                >
                  En savoir plus
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </button>
              </div>
            </div>
          </section>

          <section className={styles.blogSection}>
            <h3>Derniers Articles du Blog</h3>
            <div className={styles.blogGrid}>
              {[
                {
                  id: 1,
                  title: "Les Meilleures Terrasses de Paris",
                  excerpt: "Découvrez notre sélection des plus belles terrasses parisiennes pour profiter des beaux jours...",
                  image: "https://images.pexels.com/photos/5490965/pexels-photo-5490965.jpeg",
                  author: "Sophie Martin",
                  date: "12 Mai 2024",
                  readTime: "5 min",
                  category: "Lifestyle"
                },
                {
                  id: 2,
                  title: "Guide des Vins Bordelais",
                  excerpt: "Tout ce que vous devez savoir sur les grands crus bordelais et les meilleures dégustations...",
                  image: "https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg",
                  author: "Jean Dupont",
                  date: "10 Mai 2024",
                  readTime: "8 min",
                  category: "Gastronomie"
                },
                {
                  id: 3,
                  title: "Randonnées Secrètes en Bretagne",
                  excerpt: "Les sentiers cachés et les criques isolées que seuls les locaux connaissent...",
                  image: "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg",
                  author: "Marie Leblanc",
                  date: "8 Mai 2024",
                  readTime: "6 min",
                  category: "Aventure"
                }
              ].map((article) => (
                <motion.div
                  key={article.id}
                  className={styles.blogCard}
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={styles.blogImageContainer}>
                    <img src={article.image} alt={article.title} />
                    <span className={styles.blogCategory}>{article.category}</span>
                  </div>
                  <div className={styles.blogContent}>
                    <div className={styles.blogMeta}>
                      <span className={styles.blogAuthor}>{article.author}</span>
                      <span className={styles.blogDate}>{article.date}</span>
                      <span className={styles.readTime}>{article.readTime}</span>
                    </div>
                    <h4>{article.title}</h4>
                    <p>{article.excerpt}</p>
                    <Link to={`/blog/${article.id}`} className={styles.readMoreLink}>
                      Lire la suite
                      <FontAwesomeIcon icon={faChevronRight} className={styles.buttonIcon} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className={styles.blogActions}>
              <Link to="/blog" className={styles.viewAllButton}>
                Voir tous les articles
                <FontAwesomeIcon icon={faChevronRight} className={styles.buttonIcon} />
              </Link>
            </div>
          </section>

          <section className={styles.newsletterSection}>
            <div className={styles.newsletterContainer}>
              <div className={styles.newsletterContent}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className={styles.newsletterText}
                >
                  <h3>Rejoignez l'Aventure</h3>
                  <p className={styles.newsletterDescription}>
                    Recevez en avant-première nos meilleures offres et découvertes
                  </p>
                  <div className={styles.benefitsList}>
                    <div className={styles.benefitItem}>
                      <FontAwesomeIcon icon={faGift} className={styles.benefitIcon} />
                      <span>Offres exclusives</span>
                    </div>
                    <div className={styles.benefitItem}>
                      <FontAwesomeIcon icon={faClock} className={styles.benefitIcon} />
                      <span>Accès anticipé aux nouveautés</span>
                    </div>
                    <div className={styles.benefitItem}>
                      <FontAwesomeIcon icon={faPercent} className={styles.benefitIcon} />
                      <span>-10% sur votre première réservation</span>
                    </div>
                  </div>
                </motion.div>

                <motion.form 
                  className={styles.newsletterForm}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Logique d'inscription
                  }}
                >
                  <div className={styles.inputGroup}>
                    <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                    <input 
                      type="email" 
                      placeholder="Votre adresse email" 
                      required 
                    />
                  </div>
                  <motion.button 
                    type="submit"
                    className={styles.subscribeButton}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Je m'inscris
                    <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
                  </motion.button>
                  <p className={styles.privacyNote}>
                    <FontAwesomeIcon icon={faShieldHeart} className={styles.privacyIcon} />
                    Vos données sont protégées. Désabonnement facile en 1 clic.
                  </p>
                </motion.form>
              </div>

              <div className={styles.testimonialSlider}>
                <motion.div 
                  className={styles.testimonial}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className={styles.testimonialContent}>
                    <FontAwesomeIcon icon={faQuoteLeft} className={styles.quoteIcon} />
                    <p>"Grâce à la newsletter, j'ai pu réserver en avant-première une expérience unique dans un château viticole !"</p>
                    <div className={styles.testimonialAuthor}>
                      <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Sophie M." />
                      <div>
                        <h4>Sophie M.</h4>
                        <span>Membre depuis 2023</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        {showTutorial && (
          <Tutorial
            onComplete={handleTutorialComplete}
            onSkip={handleTutorialSkip}
          />
        )}

        {selectedImage && (
          <div 
            className={`${styles.imageModal} ${styles.active}`}
            onClick={handleCloseModal}
          >
            <div 
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage} 
                alt="Vue agrandie"
                className={styles.modalImage}
              />
              <button 
                className={styles.closeModal}
                onClick={handleCloseModal}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        )}

        {showHowItWorks && (
          <div className={styles.modalOverlay} onClick={() => setShowHowItWorks(false)}>
            <div className={styles.howItWorksModal} onClick={e => e.stopPropagation()}>
              <button 
                className={styles.closeModalButton}
                onClick={() => setShowHowItWorks(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              
              <h2>Comment fonctionne Rendez-Vous Parfait ?</h2>
              
              <div className={styles.modalSection}>
                <h3>
                  <FontAwesomeIcon icon={faHeart} className={styles.modalIcon} />
                  Swiper & Découvrir
                </h3>
                <div className={styles.modalContent}>
                  <h4>Le concept</h4>
                  <p>Découvrez notre catalogue d'activités de manière intuitive en swipant :</p>
                  <ul>
                    <li>Swipez à droite pour liker une activité</li>
                    <li>Swipez à gauche pour passer</li>
                    <li>Vos likes sont sauvegardés dans votre catalogue personnel</li>
                  </ul>
                  <h4>Les avantages</h4>
                  <ul>
                    <li>Suggestions personnalisées basées sur vos préférences</li>
                    <li>Accès rapide à vos activités favorites</li>
                    <li>Réservation facilitée depuis votre catalogue</li>
                  </ul>
                </div>
              </div>

              <div className={styles.modalSection}>
                <h3>
                  <FontAwesomeIcon icon={faUsers} className={styles.modalIcon} />
                  Recherche de Groupe
                </h3>
                <div className={styles.modalContent}>
                  <h4>Le concept</h4>
                  <p>Créez des expériences de groupe parfaitement adaptées  tous les participants :</p>
                  <ul>
                    <li>Créez un groupe et invitez vos amis</li>
                    <li>Chaque membre remplit son profil lors de l'inscription</li>
                    <li>Notre algorithme analyse les compatibilités</li>
                  </ul>
                  <h4>Les critères analysés</h4>
                  <ul>
                    <li>Préférences d'activités et centres d'intérêt</li>
                    <li>Style de voyage et budget</li>
                    <li>Ambiances et types d'expériences préférés</li>
                  </ul>
                </div>
              </div>

              <div className={styles.modalSection}>
                <h3>
                  <FontAwesomeIcon icon={faCalendar} className={styles.modalIcon} />
                  Réservation et Organisation
                </h3>
                <div className={styles.modalContent}>
                  <h4>Comment réserver ?</h4>
                  <ul>
                    <li>Sélectionnez un itinéraire prédéfini</li>
                    <li>Ou composez votre programme depuis vos likes</li>
                    <li>Réservez en quelques clics</li>
                  </ul>
                  <h4>Suivi et Support</h4>
                  <ul>
                    <li>Confirmation immédiate</li>
                    <li>Modifications possibles jusqu'à 48h avant</li>
                    <li>Support client disponible 7j/7</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {showExplanation && (
          <div className={styles.explanationOverlay} onClick={() => setShowExplanation(false)}>
            <div 
              ref={explanationModalRef}
              className={styles.explanationModal} 
              onClick={e => e.stopPropagation()}
            >
              <button 
                className={styles.closeModalButton}
                onClick={() => setShowExplanation(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              <div className={styles.explanationContent}>
                <div 
                  className={styles.explanationSlider}
                  style={{ transform: `translateX(-${currentStep * 100}%)` }}
                >
                  {explanationSteps.map((step, index) => (
                    <div key={index} className={styles.explanationStep}>
                      <div className={styles.explanationImage}>
                        <img src={step.image} alt={step.title} />
                      </div>
                      <div className={styles.explanationIcon}>
                        <FontAwesomeIcon icon={step.icon} />
                      </div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  ))}
                </div>

                <div className={styles.explanationControls}>
                  <div className={styles.explanationDots}>
                    {explanationSteps.map((_, index) => (
                      <button
                        key={index}
                        className={`${styles.explanationDot} ${index === currentStep ? styles.active : ""}`}
                        onClick={() => setCurrentStep(index)}
                      />
                    ))}
                  </div>
                  
                  <div className={styles.explanationButtons}>
                    {currentStep > 0 && (
                      <button 
                        className={styles.explanationButton}
                        onClick={() => setCurrentStep(prev => prev - 1)}
                      >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        Précédent
                      </button>
                    )}
                    {currentStep < explanationSteps.length - 1 ? (
                      <button 
                        className={styles.explanationButton}
                        onClick={() => setCurrentStep(prev => prev + 1)}
                      >
                        Suivant
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                    ) : (
                      <button 
                        className={styles.explanationButton}
                        onClick={handleStartSwiping}
                      >
                        Commencer
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showMoodExplanation && (
          <div className={styles.explanationOverlay} onClick={() => setShowMoodExplanation(false)}>
            <div 
              ref={moodExplanationModalRef}
              className={styles.explanationModal} 
              onClick={e => e.stopPropagation()}
            >
              <button 
                className={styles.closeModalButton}
                onClick={() => setShowMoodExplanation(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              <div className={styles.explanationContent}>
                <div 
                  className={styles.explanationSlider}
                  style={{ transform: `translateX(-${currentStep * 100}%)` }}
                >
                  {moodExplanationSteps.map((step, index) => (
                    <div key={index} className={styles.explanationStep}>
                      <div className={styles.explanationImage}>
                        <img src={step.image} alt={step.title} />
                      </div>
                      <div className={styles.explanationIcon}>
                        <FontAwesomeIcon icon={step.icon} />
                      </div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  ))}
                </div>

                <div className={styles.explanationControls}>
                  <div className={styles.explanationDots}>
                    {moodExplanationSteps.map((_, index) => (
                      <button
                        key={index}
                        className={`${styles.explanationDot} ${index === currentStep ? styles.active : ""}`}
                        onClick={() => setCurrentStep(index)}
                      />
                    ))}
                  </div>
                  
                  <div className={styles.explanationButtons}>
                    {currentStep > 0 && (
                      <button 
                        className={styles.explanationButton}
                        onClick={() => setCurrentStep(prev => prev - 1)}
                      >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        Précédent
                      </button>
                    )}
                    {currentStep < moodExplanationSteps.length - 1 ? (
                      <button 
                        className={styles.explanationButton}
                        onClick={() => setCurrentStep(prev => prev + 1)}
                      >
                        Suivant
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                    ) : (
                      <button 
                        className={styles.explanationButton}
                        onClick={() => navigate('/mood-form')}
                      >
                        Commencer
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;