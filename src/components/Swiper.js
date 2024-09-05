import React, { useState, useEffect, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { bordeauxData } from "../data/bordeauxData";
import styles from "./Swiper.module.css";
import {
  FaHeart,
  FaTimes,
  FaUtensils,
  FaMoneyBillWave,
  FaBed,
  FaWalking,
} from "react-icons/fa";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const Swiper = ({ formData, handleInputChange, nextStep }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offers, setOffers] = useState([]);
  const [userPreferences, setUserPreferences] = useState({});
  const [swipeCount, setSwipeCount] = useState(0);
  const [direction, setDirection] = useState("");

  useEffect(() => {
    loadOffers();
    loadUserPreferences();
  }, []);

  const loadOffers = () => {
    const allOffers = [
      ...bordeauxData.hotels,
      ...bordeauxData.restaurants,
      ...bordeauxData.activities,
    ].sort(() => Math.random() - 0.5);
    setOffers(allOffers);
  };

  const loadUserPreferences = async () => {
    if (auth.currentUser) {
      const userPreferencesRef = doc(db, "userPreferences", auth.currentUser.uid);
      const userPreferencesDoc = await getDoc(userPreferencesRef);
      if (userPreferencesDoc.exists()) {
        setUserPreferences(userPreferencesDoc.data());
      } else {
        setUserPreferences({});
      }
    }
  };

  const handleSwipe = useCallback(
    async (isLike) => {
      setDirection(isLike ? "right" : "left");
      setTimeout(async () => {
        const currentOffer = offers[currentIndex];
        const newPreferences = { ...userPreferences };

        if (!newPreferences[currentOffer.type]) {
          newPreferences[currentOffer.type] = { likes: 0, dislikes: 0 };
        }

        if (isLike) {
          newPreferences[currentOffer.type].likes += 1;
        } else {
          newPreferences[currentOffer.type].dislikes += 1;
        }

        setUserPreferences(newPreferences);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
        setSwipeCount((prevCount) => prevCount + 1);
        setDirection("");

        if (auth.currentUser) {
          const userPreferencesRef = doc(db, "userPreferences", auth.currentUser.uid);
          await setDoc(userPreferencesRef, newPreferences, { merge: true });
        }

        // Si on arrive à la fin de la liste, recharger de nouvelles offres
        if (currentIndex === offers.length - 1) {
          loadOffers();
        }
      }, 300);
    },
    [currentIndex, offers, userPreferences]
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe(false),
    onSwipedRight: () => handleSwipe(true),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  if (offers.length === 0) {
    return <div>Chargement des offres...</div>;
  }

  const currentOffer = offers[currentIndex];

  const getTypeIcon = (type) => {
    switch (type) {
      case "Hôtel":
      case "Appart Hôtel":
      case "Chambres d'hôtes":
        return <FaBed className={styles["offer-icon"]} />;
      case "Restaurant":
        return <FaUtensils className={styles["offer-icon"]} />;
      default:
        return <FaWalking className={styles["offer-icon"]} />;
    }
  };

  const getTypeOrCuisine = (offer) => {
    if (offer.cuisine) {
      return offer.cuisine.join(", ");
    }
    return offer.type || "Activité";
  };

  return (
    <div className={styles["search-step"]}>
      <div className={styles["swiper-container"]} {...handlers}>
        <div className={`${styles["offer-card"]} ${styles[direction]}`}>
          <img
            src={currentOffer.image}
            alt={currentOffer.name}
            className={styles["offer-image"]}
          />
          <div className={styles["offer-info"]}>
            <h3 className={styles["offer-name"]}>{currentOffer.name}</h3>
            <p className={styles["offer-description"]}>
              {currentOffer.description}
            </p>
            <div className={styles["offer-details"]}>
              <p className={styles["offer-type"]}>
                {getTypeIcon(currentOffer.type)}
                {getTypeOrCuisine(currentOffer)}
              </p>
              <p className={styles["offer-price"]}>
                <FaMoneyBillWave className={styles["offer-icon"]} />
                {currentOffer.price}€
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["swiper-buttons"]}>
        <button
          className={styles["dislike-button"]}
          onClick={() => handleSwipe(false)}
        >
          <FaTimes />
        </button>
        <button
          className={styles["like-button"]}
          onClick={() => handleSwipe(true)}
        >
          <FaHeart />
        </button>
      </div>
      <p className={styles["swipe-count"]}>
        Nombre de swipes : {swipeCount}
      </p>
    </div>
  );
};

export default Swiper;