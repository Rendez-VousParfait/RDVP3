import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";
import styles from "./Swiper.module.css";
import {
  FaUtensils,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaStar,
  FaClock,
  FaWheelchair,
  FaSmile,
  FaExchangeAlt,
} from "react-icons/fa";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import BurgerMenu from "./BurgerMenu";
import { 
  IoClose,
  IoBookmark,
  IoHeartSharp
} from "react-icons/io5";

const Swiper = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offers, setOffers] = useState([]);
  const [userPreferences, setUserPreferences] = useState({});
  const [swipeCount, setSwipeCount] = useState(0);
  const [direction, setDirection] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVersusMode, setIsVersusMode] = useState(false);
  const [versusPair, setVersusPair] = useState([null, null]);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const [plusOnePosition, setPlusOnePosition] = useState({ x: 0, y: 0 });
  const [isBookmarkReceiving, setIsBookmarkReceiving] = useState(false);
  const navigate = useNavigate();

  // Utilisez useMemo pour mémoriser les offres chargées
  const memoizedOffers = useMemo(() => {
    return [
      {
        id: "initial1",
        type: "ActivityPreferences",
        name_activty: "Activité de chargement",
        description: "Chargement en cours...",
        image1: "https://via.placeholder.com/400x300?text=Chargement...",
        price: "...",
        location: "Chargement...",
      },
    ];
  }, []);

  useEffect(() => {
    const initializeSwiper = async () => {
      await loadOffers();
      await loadUserPreferences();
    };
    initializeSwiper();
  }, []);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const allOffers = [];
      const collections = [
        "ActivityPreferences",
        "AccomodationPreferences",
        "RestaurantPreferences",
      ];

      for (const collectionName of collections) {
        const querySnapshot = await getDocs(collection(db, collectionName));
        querySnapshot.forEach((doc) => {
          allOffers.push({ id: doc.id, ...doc.data(), type: collectionName });
        });
      }

      // Mélanger les offres
      const shuffledOffers = allOffers.sort(() => Math.random() - 0.5);
      setOffers(shuffledOffers);

      // Préparer la première paire pour le mode versus
      if (shuffledOffers.length >= 2) {
        // Grouper les offres par type et caractéristiques similaires
        const offersByType = shuffledOffers.reduce((acc, offer) => {
          const key = offer.type;
          if (!acc[key]) acc[key] = [];
          acc[key].push(offer);
          return acc;
        }, {});

        // Trouver deux offres similaires pour la comparaison
        for (const type of Object.keys(offersByType)) {
          const typeOffers = offersByType[type];
          if (typeOffers.length >= 2) {
            // Trier les offres par prix pour trouver des offres similaires
            const sortedOffers = typeOffers.sort((a, b) => {
              const priceA = parseFloat(a.price || a.budget || 0);
              const priceB = parseFloat(b.price || b.budget || 0);
              return priceA - priceB;
            });

            // Sélectionner deux offres consécutives (donc similaires en prix)
            const randomIndex = Math.floor(Math.random() * (sortedOffers.length - 1));
            setVersusPair([sortedOffers[randomIndex], sortedOffers[randomIndex + 1]]);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des offres:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserPreferences = async () => {
    if (auth.currentUser) {
      const userPreferencesRef = doc(
        db,
        "userPreferences",
        auth.currentUser.uid,
      );
      const userPreferencesDoc = await getDoc(userPreferencesRef);
      if (userPreferencesDoc.exists()) {
        setUserPreferences(userPreferencesDoc.data());
      } else {
        setUserPreferences({});
      }
    }
  };

  // Modifier la fonction showPlusOneAnimation en supprimant les paramètres inutilisés
  const showPlusOneAnimation = () => {
    const likeButton = document.querySelector(`.${styles["like-button"]}`);
    const catalogButton = document.querySelector(`.${styles["catalog-button"]}`);
    
    if (likeButton && catalogButton) {
      const likeRect = likeButton.getBoundingClientRect();
      
      setPlusOnePosition({
        x: likeRect.left + likeRect.width / 2,
        y: likeRect.top + likeRect.height / 2
      });
      
      setShowPlusOne(true);
      setIsBookmarkReceiving(true);
      
      // Reset les états après l'animation
      setTimeout(() => {
        setShowPlusOne(false);
        setIsBookmarkReceiving(false);
      }, 800); // Correspond à la durée de l'animation
    }
  };

  // Modifier handleSwipe pour inclure l'animation
  const handleSwipe = useCallback(
    async (isLike) => {
      if (isLike) {
        showPlusOneAnimation();
      }
      setDirection(isLike ? "right" : "left");
      setTimeout(async () => {
        const currentOffer = offers[currentIndex];
        const newPreferences = { ...userPreferences };

        if (!newPreferences[currentOffer.type]) {
          newPreferences[currentOffer.type] = { likes: 0, dislikes: 0 };
        }

        if (isLike) {
          newPreferences[currentOffer.type].likes += 1;
          if (auth.currentUser) {
            await addDoc(collection(db, "userLikes"), {
              userId: auth.currentUser.uid,
              offer: currentOffer,
            });
          }
        } else {
          newPreferences[currentOffer.type].dislikes += 1;
        }

        setUserPreferences(newPreferences);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
        setSwipeCount((prevCount) => prevCount + 1);
        setDirection("");
        setIsActive(false);

        if (auth.currentUser) {
          const userPreferencesRef = doc(
            db,
            "userPreferences",
            auth.currentUser.uid,
          );
          await setDoc(userPreferencesRef, newPreferences, { merge: true });
        }

        if (currentIndex === offers.length - 1) {
          loadOffers();
        }
      }, 300);
    },
    [currentIndex, offers, userPreferences],
  );

  const handleVersusChoice = async (chosenIndex) => {
    // Ajouter les classes pour l'animation
    const winnerCard = document.querySelector(`.${styles["versus-card"]}[data-index="${chosenIndex}"]`);
    const loserCard = document.querySelector(`.${styles["versus-card"]}[data-index="${1 - chosenIndex}"]`);
    
    if (winnerCard && loserCard) {
      winnerCard.classList.add(styles["winner"]);
      loserCard.classList.add(styles["loser"]);
    }

    // Attendre que l'animation se termine
    await new Promise(resolve => setTimeout(resolve, 800));

    const chosenOffer = versusPair[chosenIndex];
    const rejectedOffer = versusPair[1 - chosenIndex];
    
    // Mettre à jour les préférences
    const newPreferences = { ...userPreferences };
    if (!newPreferences[chosenOffer.type]) {
      newPreferences[chosenOffer.type] = { likes: 0, dislikes: 0 };
    }
    newPreferences[chosenOffer.type].likes += 1;

    // Sauvegarder le choix
    if (auth.currentUser) {
      await addDoc(collection(db, "userLikes"), {
        userId: auth.currentUser.uid,
        offer: chosenOffer,
        comparedTo: rejectedOffer.id, // Ajouter l'information de comparaison
        versusChoice: true
      });
      
      const userPreferencesRef = doc(db, "userPreferences", auth.currentUser.uid);
      await setDoc(userPreferencesRef, newPreferences, { merge: true });
    }

    // Trouver la prochaine paire
    const sameTypeOffers = offers.filter(
      offer => 
        offer.type === chosenOffer.type && 
        !versusPair.some(o => o.id === offer.id)
    );

    if (sameTypeOffers.length >= 2) {
      // Retirer les classes d'animation avant de changer les cartes
      if (winnerCard && loserCard) {
        winnerCard.classList.remove(styles["winner"]);
        loserCard.classList.remove(styles["loser"]);
      }

      const sortedOffers = sameTypeOffers.sort((a, b) => {
        const priceA = parseFloat(a.price || a.budget || 0);
        const priceB = parseFloat(b.price || b.budget || 0);
        return priceA - priceB;
      });

      const randomIndex = Math.floor(Math.random() * (sortedOffers.length - 1));
      setVersusPair([sortedOffers[randomIndex], sortedOffers[randomIndex + 1]]);
    } else {
      await loadOffers();
    }

    setSwipeCount(prev => prev + 1);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "AccomodationPreferences":
        return <FaUtensils className={styles["offer-icon"]} />;
      case "RestaurantPreferences":
        return <FaUtensils className={styles["offer-icon"]} />;
      case "ActivityPreferences":
        return <FaSmile className={styles["offer-icon"]} />;
      default:
        return null;
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe(false),
    onSwipedRight: () => handleSwipe(true),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleCardClick = () => {
    setIsActive(!isActive);
  };

  const goToCatalog = () => {
    navigate("/catalog");
  };

  const renderOfferCard = useCallback((offer) => {
    if (!offer) return null;
    
    return (
      <div
        className={`${styles["offer-card"]} ${styles[direction]} ${isActive ? styles["active"] : ""}`}
        onClick={handleCardClick}
      >
        <img
          src={offer.image1}
          alt={
            offer.name_hotel ||
            offer.name_restaurant ||
            offer.name_activty ||
            "Offre sans nom"
          }
          className={styles["offer-image"]}
        />
        <div className={styles["offer-title"]}>
          {offer.name_hotel ||
            offer.name_restaurant ||
            offer.name_activty ||
            "Offre sans nom"}
        </div>
        <div className={styles["offer-info"]}>
          <p className={styles["offer-description"]}>
            {offer.description || "Aucune description disponible"}
          </p>
          <div className={styles["offer-details"]}>
            <p className={styles["offer-type"]}>
              {getTypeIcon(offer.type)}
              {offer.accomodation_type ||
                offer.activity_type ||
                offer.cuisinetype ||
                offer.type.replace("Preferences", "")}
            </p>
            <p className={styles["offer-price"]}>
              <FaMoneyBillWave className={styles["offer-icon"]} />
              {offer.price || offer.budget || "Prix non spécifié"}€
            </p>
            {offer.type === "AccomodationPreferences" && (
              <>
                <p className={styles["offer-standing"]}>
                  <FaStar className={styles["offer-icon"]} />
                  {offer.standing || "Non spécifié"}
                </p>
                <p className={styles["offer-rating"]}>
                  <FaStar className={styles["offer-icon"]} />
                  {offer.notation || "Non spécifié"}
                </p>
              </>
            )}
            {offer.type === "RestaurantPreferences" && (
              <>
                <p className={styles["offer-cuisine"]}>
                  <FaUtensils className={styles["offer-icon"]} />
                  {offer.cuisine_origine || "Non spécifié"}
                </p>
                <p className={styles["offer-ambiance"]}>
                  <FaSmile className={styles["offer-icon"]} />
                  {offer.ambiances || "Non spécifié"}
                </p>
              </>
            )}
            {offer.type === "ActivityPreferences" && (
              <>
                <p className={styles["offer-duration"]}>
                  <FaClock className={styles["offer-icon"]} />
                  {offer.duration || "Non spécifié"}
                </p>
                <p className={styles["offer-ambiance"]}>
                  <FaSmile className={styles["offer-icon"]} />
                  {offer.ambiance || "Non spécifié"}
                </p>
              </>
            )}
            <p className={styles["offer-location"]}>
              <FaMapMarkerAlt className={styles["offer-icon"]} />
              {offer.adress || offer.location || "Adresse non spécifiée"}
            </p>
            <p className={styles["offer-accessibility"]}>
              <FaWheelchair className={styles["offer-icon"]} />
              {offer.accessibility || "Non spécifié"}
            </p>
          </div>
          {offer.type === "AccomodationPreferences" && (
            <p className={styles["offer-equipment"]}>
              Équipements:{" "}
              {[offer.equipments1, offer.equipments2, offer.equipments3]
                .filter(Boolean)
                .join(", ") || "Non spécifié"}
            </p>
          )}
          {offer.type === "RestaurantPreferences" && (
            <p className={styles["offer-services"]}>
              Services:{" "}
              {[offer.services1, offer.services2].filter(Boolean).join(", ") ||
                "Non spécifié"}
            </p>
          )}
        </div>
      </div>
    );
  }, [direction, isActive, getTypeIcon]);

  const toggleMode = () => {
    setIsVersusMode(!isVersusMode);
  };

  if (isLoading || offers.length === 0) {
    return (
      <div className={styles["search-step"]}>
        <div className={styles["swiper-container"]}>
          {renderOfferCard(memoizedOffers[0])}
        </div>
        {/* Ajoutez ici les boutons de swipe si nécessaire */}
      </div>
    );
  }

  const currentOffer = offers[currentIndex] || memoizedOffers[0];

  return (
    <div className={styles["search-step"]}>
      <BurgerMenu />
      <div className={styles["mode-switch"]}>
        <button onClick={toggleMode} className={styles["switch-button"]}>
          <FaExchangeAlt />
          {isVersusMode ? "Mode Swipe" : "Mode Versus"}
        </button>
      </div>

      {isVersusMode ? (
        <div className={styles["versus-container"]}>
          {versusPair[0] && versusPair[1] && (
            <>
              <div className={styles["versus-cards"]}>
                <div 
                  className={styles["versus-card"]} 
                  onClick={() => handleVersusChoice(0)}
                  data-index="0"
                >
                  {renderOfferCard(versusPair[0])}
                </div>
                <div className={styles["versus-divider"]}>VS</div>
                <div 
                  className={styles["versus-card"]} 
                  onClick={() => handleVersusChoice(1)}
                  data-index="1"
                >
                  {renderOfferCard(versusPair[1])}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className={styles["swiper-window"]}>
          <div className={styles["swiper-container"]} {...handlers}>
            {currentOffer && renderOfferCard(currentOffer)}
          </div>
          <div className={styles["swiper-controls"]}>
            <div className={styles["swiper-buttons"]}>
              <button
                className={styles["dislike-button"]}
                onClick={() => handleSwipe(false)}
              >
                <IoClose />
              </button>
              <button 
                className={`${styles["catalog-button"]} ${isBookmarkReceiving ? styles.receiving : ""}`}
                onClick={goToCatalog}
              >
                <IoBookmark />
              </button>
              <button
                className={styles["like-button"]}
                onClick={() => handleSwipe(true)}
              >
                <IoHeartSharp />
              </button>
            </div>
            <p className={styles["swipe-count"]}>Nombre de swipes : {swipeCount}</p>
          </div>
        </div>
      )}
      {showPlusOne && (
        <div 
          className={`${styles["plus-one"]} ${styles.animate}`}
          style={{
            left: `${plusOnePosition.x}px`,
            top: `${plusOnePosition.y}px`
          }}
        >
          +1 Ajouté
        </div>
      )}
    </div>
  );
};

export default Swiper;
