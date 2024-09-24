import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Catalog.module.css";
import {
  FaUtensils,
  FaMoneyBillWave,
  FaBed,
  FaWalking,
  FaStar,
  FaMapMarkerAlt,
  FaWheelchair,
  FaSmile,
  FaClock,
  FaCalendarPlus,
  FaEye,
  FaPen,
  FaTrash,
} from "react-icons/fa";
import confetti from "canvas-confetti";

const Catalog = () => {
  const [likedOffers, setLikedOffers] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [itineraryId, setItineraryId] = useState(null);
  const [itineraryName, setItineraryName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [likedOffersByDay, setLikedOffersByDay] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLikedOffers();
  }, []);

  const fetchLikedOffers = async () => {
    if (auth.currentUser) {
      const q = query(
        collection(db, "userLikes"),
        where("userId", "==", auth.currentUser.uid),
      );
      const querySnapshot = await getDocs(q);
      const likes = querySnapshot.docs.map((doc) => ({
        ...doc.data().offer,
        likeId: doc.id,
        likedAt: doc.data().likedAt?.toDate() || new Date(),
      }));
      setLikedOffers(likes);

      const offersByDay = likes.reduce((acc, offer) => {
        const date = offer.likedAt.toDateString();
        if (!acc[date]) {
          acc[date] = {
            AccomodationPreferences: [],
            RestaurantPreferences: [],
            ActivityPreferences: [],
          };
        }
        acc[date][offer.type].push(offer);
        return acc;
      }, {});
      setLikedOffersByDay(offersByDay);
    }
  };

  const handleClearLikes = async (date) => {
    if (auth.currentUser) {
      const likesToDelete = date
        ? Object.values(likedOffersByDay[date]).flat()
        : likedOffers;

      for (const offer of likesToDelete) {
        await deleteDoc(doc(db, "userLikes", offer.likeId));
      }

      await fetchLikedOffers();
      alert(
        date
          ? `Likes du ${date} supprimés`
          : "Tous les likes ont été supprimés",
      );
    }
  };

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

  const handleSelectOffer = (offer) => {
    setSelectedOffers((prev) => {
      if (prev.some((o) => o.id === offer.id)) {
        return prev.filter((o) => o.id !== offer.id);
      } else {
        return [...prev, offer];
      }
    });
  };

  const createItinerary = async () => {
    if (selectedOffers.length === 0) {
      alert(
        "Veuillez sélectionner au moins une offre pour créer un itinéraire.",
      );
      return;
    }

    if (!itineraryName.trim()) {
      alert("Veuillez donner un nom à votre itinéraire.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "itineraries"), {
        userId: auth.currentUser.uid,
        offers: selectedOffers,
        createdAt: new Date(),
        paid: false,
        name: itineraryName.trim(),
      });
      setItineraryId(docRef.id);
      alert(
        `Itinéraire "${itineraryName}" créé avec succès ! ID: ${docRef.id}`,
      );
      setShowNameInput(false);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'itinéraire:", error);
      alert("Une erreur est survenue lors de la création de l'itinéraire.");
    }
  };

  const handleReviewItinerary = () => {
    if (itineraryId) {
      navigate(`/itinerary-review/${itineraryId}`);
    } else {
      alert("Veuillez d'abord créer un itinéraire.");
    }
  };

  const renderOfferCard = (offer) => {
    if (!offer) return null;

    const offerType = offer.type || "UnknownType";
    const isSelected = selectedOffers.some((o) => o.id === offer.id);

    return (
      <div
        className={`${styles["offer-card"]} ${isSelected ? styles["selected"] : ""}`}
        onClick={() => handleSelectOffer(offer)}
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
        <div className={styles["offer-info"]}>
          <h3 className={styles["offer-title"]}>
            {offer.name_hotel ||
              offer.name_restaurant ||
              offer.name_activty ||
              "Offre sans nom"}
          </h3>
          <p className={styles["offer-description"]}>
            {offer.description || "Aucune description disponible"}
          </p>
          <div className={styles["offer-details"]}>
            <p className={styles["offer-type"]}>
              {getTypeIcon(offerType)}
              {offer.accomodation_type ||
                offer.activity_type ||
                offer.cuisinetype ||
                offerType.replace("Preferences", "")}
            </p>
            <p className={styles["offer-price"]}>
              <FaMoneyBillWave className={styles["offer-icon"]} />
              {offer.price || offer.budget || "Prix non spécifié"}€
            </p>
            {offerType === "AccomodationPreferences" && (
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
            {offerType === "RestaurantPreferences" && (
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
            {offerType === "ActivityPreferences" && (
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
          {offerType === "AccomodationPreferences" && (
            <p className={styles["offer-equipment"]}>
              Équipements:{" "}
              {[offer.equipments1, offer.equipments2, offer.equipments3]
                .filter(Boolean)
                .join(", ") || "Non spécifié"}
            </p>
          )}
          {offerType === "RestaurantPreferences" && (
            <p className={styles["offer-services"]}>
              Services:{" "}
              {[offer.services1, offer.services2].filter(Boolean).join(", ") ||
                "Non spécifié"}
            </p>
          )}
        </div>
        <div className={styles["offer-actions"]}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSelectOffer(offer);
            }}
          >
            {isSelected ? "Désélectionner" : "Sélectionner"}
          </button>
        </div>
      </div>
    );
  };

  const renderOffersByType = (offers, type) => {
    const typeLabels = {
      AccomodationPreferences: "Hôtels",
      RestaurantPreferences: "Restaurants",
      ActivityPreferences: "Activités",
    };

    if (offers.length === 0) return null;

    return (
      <div key={type} className={styles.offerTypeSection}>
        <h3>{typeLabels[type]}</h3>
        <div className={styles["offer-grid"]}>
          {offers.map((offer, index) => (
            <div key={index}>{renderOfferCard(offer)}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.catalog}>
      <main className={styles["main-content"]}>
        <header className={styles.header}>
          <h1>Catalogue des offres likées</h1>
          <div className={styles["quick-filters"]}>
            <button onClick={() => setActiveTab("all")}>Tous</button>
            <button onClick={() => setActiveTab("hotels")}>
              <FaBed /> Hôtels
            </button>
            <button onClick={() => setActiveTab("restaurants")}>
              <FaUtensils /> Restaurants
            </button>
            <button onClick={() => setActiveTab("activities")}>
              <FaWalking /> Activités
            </button>
          </div>
        </header>

        <div className={styles.travelProgress}>
          <div className={styles.road}>
            {selectedOffers.map((offer, index) => (
              <div key={index} className={styles.roadSegment}>
                <div className={styles.milestone}>
                  <div className={styles.milestoneIcon}>
                    {offer.type === "AccomodationPreferences"
                      ? "🏨"
                      : offer.type === "RestaurantPreferences"
                        ? "🍽️"
                        : offer.type === "ActivityPreferences"
                          ? "🎭"
                          : "❓"}
                  </div>
                  <span className={styles.milestoneLabel}>
                    {offer.name_hotel ||
                      offer.name_restaurant ||
                      offer.name_activty ||
                      "Offre"}
                  </span>
                </div>
              </div>
            ))}
            <motion.div
              className={styles.character}
              animate={{
                left: `${(selectedOffers.length / (selectedOffers.length + 1)) * 100}%`,
              }}
              transition={{ type: "spring", stiffness: 60 }}
            />
          </div>
        </div>

        <div className={styles.timeline}>
          {Object.entries(likedOffersByDay).map(([date, offersByType]) => (
            <div
              key={date}
              className={styles["day-marker"]}
              data-day={new Date(date).getDate()}
            >
              <h2>{date}</h2>
              <button
                onClick={() => handleClearLikes(date)}
                className={styles.clearButton}
              >
                <FaTrash /> Vider les likes de ce jour
              </button>
              {activeTab === "all" || activeTab === "hotels"
                ? renderOffersByType(
                    offersByType.AccomodationPreferences,
                    "AccomodationPreferences",
                  )
                : null}
              {activeTab === "all" || activeTab === "restaurants"
                ? renderOffersByType(
                    offersByType.RestaurantPreferences,
                    "RestaurantPreferences",
                  )
                : null}
              {activeTab === "all" || activeTab === "activities"
                ? renderOffersByType(
                    offersByType.ActivityPreferences,
                    "ActivityPreferences",
                  )
                : null}
            </div>
          ))}
        </div>
        <button
          onClick={() => handleClearLikes()}
          className={styles.clearAllButton}
        >
          <FaTrash /> Vider tous les likes
        </button>
        {selectedOffers.length > 0 && (
          <div className={styles.itineraryActions}>
            {showNameInput ? (
              <div className={styles.nameInputContainer}>
                <input
                  type="text"
                  value={itineraryName}
                  onChange={(e) => setItineraryName(e.target.value)}
                  placeholder="Nom de l'itinéraire"
                  className={styles.nameInput}
                />
                <button onClick={createItinerary}>
                  <FaCalendarPlus /> Créer l'itinéraire
                </button>
              </div>
            ) : (
              <button onClick={() => setShowNameInput(true)}>
                <FaPen /> Nommer et créer l'itinéraire
              </button>
            )}
            {itineraryId && (
              <button onClick={handleReviewItinerary}>
                <FaEye /> Consulter l'itinéraire
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Catalog;