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
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const Swiper = ({ formData, handleInputChange, nextStep }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offers, setOffers] = useState([]);
  const [likedTypes, setLikedTypes] = useState({});
  const [dislikedTypes, setDislikedTypes] = useState({});
  const [swipeCount, setSwipeCount] = useState(0);
  const [direction, setDirection] = useState("");

  useEffect(() => {
    const allOffers = [
      ...bordeauxData.hotels,
      ...bordeauxData.restaurants,
      ...bordeauxData.activities,
    ].sort(() => Math.random() - 0.5);
    setOffers(allOffers);
  }, []);

  const handleSwipe = useCallback(
    async (isLike) => {
      setDirection(isLike ? "right" : "left");
      setTimeout(async () => {
        const currentOffer = offers[currentIndex];
        const newLikedTypes = { ...likedTypes };
        const newDislikedTypes = { ...dislikedTypes };

        if (isLike) {
          newLikedTypes[currentOffer.type] =
            (newLikedTypes[currentOffer.type] || 0) + 1;
        } else {
          newDislikedTypes[currentOffer.type] =
            (newDislikedTypes[currentOffer.type] || 0) + 1;
        }

        setLikedTypes(newLikedTypes);
        setDislikedTypes(newDislikedTypes);
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setSwipeCount((prevCount) => prevCount + 1);
        setDirection("");

        if (auth.currentUser) {
          const userPreferencesRef = doc(
            db,
            "userPreferences",
            auth.currentUser.uid
          );
          await setDoc(
            userPreferencesRef,
            {
              likedTypes: newLikedTypes,
              dislikedTypes: newDislikedTypes,
            },
            { merge: true }
          );
        }

        if (swipeCount + 1 >= 5) {
          handleInputChange("swiperPreferences", {
            liked: newLikedTypes,
            disliked: newDislikedTypes,
          });
          nextStep();
        }
      }, 300);
    },
    [
      currentIndex,
      offers,
      swipeCount,
      likedTypes,
      dislikedTypes,
      handleInputChange,
      nextStep,
    ]
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe(false),
    onSwipedRight: () => handleSwipe(true),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  if (currentIndex >= offers.length) {
    return <div>Vous avez vu toutes les offres !</div>;
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
      <h2 className={styles["swiper-title"]}>Découvrez Bordeaux</h2>
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
      <div className={styles["swipe-progress"]}>
        <div
          className={styles["swipe-progress-bar"]}
          style={{ width: `${(swipeCount / 5) * 100}%` }}
        ></div>
      </div>
      <p className={styles["swipe-count"]}>
        Swipes restants : {5 - swipeCount}
      </p>
    </div>
  );
};

export default Swiper;