import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faBed,
  faUtensils,
  faWalking,
  faCrown,
  faSmile,
  faGlassCheers,
  faLeaf,
  faLandmark,
  faCompass,
  faChevronRight,
  faMagicWandSparkles,
  faClock,
  faEuroSign,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import styles from './BetaPage.module.css';
import { motion, AnimatePresence } from "framer-motion";
import {
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Chip,
} from "@mui/material";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Swiper from "../components/Swiper";
import BetaPageHeader from "../components/BetaPageHeader";
import Footer from "../components/Footer";

// Styles
const StyledContainer = styled(Paper)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const QuestionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

// Constantes pour les images
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

// Données des itinéraires
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
    matchingScore: 75,
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
    matchingScore: 90,
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

// Composant EmailStep
const EmailStep = ({ formData, setFormData }) => {
  return (
    <Box>
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Nom"
        value={formData.name || ''}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Téléphone"
        value={formData.phone || ''}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
    </Box>
  );
};

// Composant ServicesStep
const ServicesStep = ({ formData, setFormData }) => {
  const services = [
    { value: 'hotel', label: 'Hôtel', icon: faBed },
    { value: 'restaurant', label: 'Restaurant', icon: faUtensils },
    { value: 'activity', label: 'Activité', icon: faWalking }
  ];

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Sélectionnez les services qui vous intéressent :
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {services.map((service) => (
          <Button
            key={service.value}
            variant={formData.services.includes(service.value) ? 'contained' : 'outlined'}
            onClick={() => {
              const newServices = formData.services.includes(service.value)
                ? formData.services.filter(s => s !== service.value)
                : [...formData.services, service.value];
              setFormData({ ...formData, services: newServices });
            }}
            startIcon={<FontAwesomeIcon icon={service.icon} />}
            sx={{ flex: '1 1 auto', minWidth: '150px' }}
          >
            {service.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

// Composant MoodStep
const MoodStep = ({ formData, setFormData, moodOptions }) => {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Quelle ambiance recherchez-vous ?
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {moodOptions.map((mood) => (
          <Chip
            key={mood.label}
            label={mood.label}
            icon={<FontAwesomeIcon icon={mood.icon} />}
            onClick={() => {
              const newMood = formData.mood.includes(mood.label)
                ? formData.mood.filter(m => m !== mood.label)
                : [...formData.mood, mood.label];
              setFormData({ ...formData, mood: newMood });
            }}
            color={formData.mood.includes(mood.label) ? 'primary' : 'default'}
            sx={{ m: 0.5 }}
          />
        ))}
      </Box>
    </Box>
  );
};

// Ajout des constantes pour les slides
const carouselSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3",
    title: "Découvrez notre nouveau concept",
    description: "Une expérience unique pour planifier votre séjour à Bordeaux",
    ctaText: "Voir les itinéraires",
    ctaAction: "itineraries"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3",
    title: "Swipez, Comparez, Choisissez",
    description: "Trouvez les meilleures expériences qui vous correspondent",
    ctaText: "Essayer le swiper",
    ctaAction: "swiper"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?ixlib=rb-4.0.3",
    title: "Personnalisez votre expérience",
    description: "Dites-nous vos préférences, nous créons votre séjour idéal",
    ctaText: "Commencer",
    ctaAction: "form"
  }
];

// Composant principal BetaPage
function BetaPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    dates: {
      start: null,
      end: null
    },
    services: [],
    budget: 100,
    mood: [],
    preferences: [],
    versusChoices: [],
  });

  const moodOptions = [
    { label: "Romantique", icon: faHeart },
    { label: "Élégant", icon: faCrown },
    { label: "Décontracté", icon: faSmile },
    { label: "Festif", icon: faGlassCheers },
    { label: "Gastronomique", icon: faUtensils },
    { label: "Nature", icon: faLeaf },
    { label: "Culturel", icon: faLandmark },
    { label: "Aventure", icon: faCompass },
  ];

  // Étapes du formulaire
  const steps = [
    {
      title: "Commençons par le plus important",
      component: "EmailStep",
      description: "Laissez-nous vos coordonnées pour recevoir votre itinéraire personnalisé"
    },
    {
      title: "Quelles prestations vous intéressent ?",
      component: "ServicesStep",
      description: "Sélectionnez les types d'expériences que vous souhaitez vivre"
    },
    {
      title: "Vos préférences",
      component: "MoodStep",
      description: "Définissons ensemble le style de votre séjour idéal"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const renderStep = () => {
    switch (steps[formStep].component) {
      case "EmailStep":
        return <EmailStep formData={formData} setFormData={setFormData} />;
      case "ServicesStep":
        return <ServicesStep formData={formData} setFormData={setFormData} />;
      case "MoodStep":
        return <MoodStep formData={formData} setFormData={setFormData} moodOptions={moodOptions} />;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('Formulaire soumis:', formData);
      alert('Merci ! Nous avons bien reçu vos préférences.');
      setFormData({
        email: '',
        dates: { start: null, end: null },
        services: [],
        budget: 100,
        mood: [],
        preferences: [],
        versusChoices: []
      });
      setFormStep(0);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const handleStartSwiping = () => {
    navigate("/swiper");
  };

  const [hoveredCard, setHoveredCard] = useState(null);
  const itinerariesRef = useRef(null);
  const formRef = useRef(null);

  const handleCtaClick = (action) => {
    switch(action) {
      case 'itineraries':
        itinerariesRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'swiper':
        handleStartSwiping();
        break;
      case 'form':
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <BetaPageHeader />
      <div className={`${styles.dashboard} ${isLoaded ? styles.dashboardLoaded : ''}`}>
        {/* Section carousel */}
        <section className={styles.heroCarousel}>
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            autoPlay
            interval={6000}
            className={styles.carousel}
            stopOnHover={true}
            swipeable={true}
            emulateTouch={true}
          >
            {carouselSlides.map((slide) => (
              <div key={slide.id} className={styles.carouselSlide}>
                <div className={styles.slideImageContainer}>
                  <img src={slide.image} alt={slide.title} />
                  <div className={styles.slideOverlay} />
                </div>
                <div className={styles.slideContent}>
                  <h2>{slide.title}</h2>
                  <p>{slide.description}</p>
                  <button 
                    className={styles.slideCta}
                    onClick={() => handleCtaClick(slide.ctaAction)}
                  >
                    {slide.ctaText}
                    <FontAwesomeIcon icon={faChevronRight} className={styles.buttonIcon} />
                  </button>
                </div>
              </div>
            ))}
          </Carousel>
        </section>

        <div className={styles.mainWrapper}>
          <main className={styles.mainContent}>
            {/* Section itinéraires */}
            <section id="itineraries" ref={itinerariesRef} className={styles.featuredItineraries}>
              <h3>Nos Itinéraires du Moment</h3>
              <div className={styles.itinerariesGrid}>
                {featuredItineraries.map((itinerary, index) => (
                  <div 
                    key={itinerary.id} 
                    className={`${styles.itineraryCard} ${itinerary.highlighted ? styles.highlightedCard : ''}`}
                    style={{
                      "--card-index": index,
                      transform: hoveredCard === itinerary.id ? 'translateY(-5px)' : 'none'
                    }}
                    onMouseEnter={() => setHoveredCard(itinerary.id)}
                    onMouseLeave={() => setHoveredCard(null)}
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
                        {itinerary.items?.map((item, index) => (
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
                                <div className={styles.priceTag}>
                                  <FontAwesomeIcon icon={faEuroSign} />
                                  {item.price}€
                                </div>
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

            {/* Section formulaire - déplacée avant le swiper */}
            <section id="preferences" ref={formRef} className={styles.formSection}>
              <StyledContainer>
                <AnimatePresence mode="wait">
                  <QuestionCard
                    key={formStep}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                  >
                    <Typography variant="h4" gutterBottom>
                      {steps[formStep].title}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {steps[formStep].description}
                    </Typography>
                    {renderStep()}
                  </QuestionCard>
                </AnimatePresence>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    onClick={() => setFormStep(prev => prev - 1)}
                    disabled={formStep === 0}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.2)',
                      }
                    }}
                  >
                    Précédent
                  </Button>
                  <Button
                    onClick={() => formStep === steps.length - 1 ? handleSubmit() : setFormStep(prev => prev + 1)}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      }
                    }}
                  >
                    {formStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
                  </Button>
                </Box>
              </StyledContainer>
            </section>

            {/* Section Swiper - maintenant après le formulaire */}
            <section id="swiper" className={styles.swiperSection}>
              <h3>Découvrez et Likez vos Expériences Préférées</h3>
              <div className={styles.swiperWrapper}>
                <Swiper />
              </div>
            </section>
          </main>
        </div>

        {/* Modal image */}
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
      </div>
      <Footer />
    </>
  );
}

export default BetaPage; 