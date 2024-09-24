import React, { useState, useEffect, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";
import styles from "./Swiper.module.css";
import {
  FaHeart,
  FaTimes,
  FaUtensils,
  FaMoneyBillWave,
  FaBed,
  FaWalking,
  FaBook,
  FaMapMarkerAlt,
  FaStar,
  FaClock,
  FaWheelchair,
  FaSmile,
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

const Swiper = ({ formData, handleInputChange, nextStep }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offers, setOffers] = useState([]);
  const [userPreferences, setUserPreferences] = useState({});
  const [swipeCount, setSwipeCount] = useState(0);
  const [direction, setDirection] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadOffers();
    loadUserPreferences();
  }, []);

  const loadOffers = async () => {
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

    setOffers(allOffers.sort(() => Math.random() - 0.5));
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

  if (offers.length === 0) {
    return <div>Chargement des offres...</div>;
  }

  const currentOffer = offers[currentIndex];

  const getTypeIcon = (type) => {
    switch (type) {
      case "AccomodationPreferences":
        return <FaBed className={styles["offer-icon"]} />;
      case "RestaurantPreferences":
        return <FaUtensils className={styles["offer-icon"]} />;
      case "ActivityPreferences":
        return <FaWalking className={styles["offer-icon"]} />;
      default:
        return null;
    }
  };

  const renderOfferCard = (offer) => {
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
        <h3 className={styles["offer-title"]}>
          {offer.name_hotel ||
            offer.name_restaurant ||
            offer.name_activty ||
            "Offre sans nom"}
        </h3>
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
  };

  return (
    <div className={styles["search-step"]}>
      <div className={styles["swiper-container"]} {...handlers}>
        {renderOfferCard(currentOffer)}
      </div>
      <div className={styles["swiper-buttons"]}>
        <button
          className={styles["dislike-button"]}
          onClick={() => handleSwipe(false)}
        >
          <FaTimes />
        </button>
        <button className={styles["catalog-button"]} onClick={goToCatalog}>
          <FaBook />
        </button>
        <button
          className={styles["like-button"]}
          onClick={() => handleSwipe(true)}
        >
          <FaHeart />
        </button>
      </div>
      <p className={styles["swipe-count"]}>Nombre de swipes : {swipeCount}</p>
    </div>
  );
};

export default Swiper;
