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
import styles from "./Catalog.module.css";
import confetti from "canvas-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEuroSign, 
  faPlus, 
  faCheck, 
  faStar,
  faMapMarkerAlt,
  faSmile,
  faClock,
  faUsers,
  faBed,
  faUtensils,
  faWalking,
  faTrash,
  faPen,
  faEye,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

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
        if (offer.type && acc[date][offer.type]) {
          acc[date][offer.type].push(offer);
        } else {
          console.warn(`Type d'offre non reconnu : ${offer.type}`);
        }
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
      return <p>Veuillez sélectionner au moins une offre pour créer un itinéraire.</p>
    }

    if (!itineraryName.trim()) {
      return <p>Veuillez donner un nom à votre itinéraire.</p>
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

    const renderSpecificDetails = () => {
      switch (offerType) {
        case "AccomodationPreferences":
          return (
            <>
              <div className={styles.cardDetail}>
                <FontAwesomeIcon icon={faStar} className={styles.icon} />
                <span>Standing: {offer.standing || "Non spécifié"}</span>
              </div>
              <div className={styles.cardDetail}>
                <FontAwesomeIcon icon={faBed} className={styles.icon} />
                <span>Type: {offer.accomodation_type || "Non spécifié"}</span>
              </div>
              {offer.equipments1 && (
                <div className={styles.cardEquipments}>
                  <h4>Équipements:</h4>
                  <ul>
                    {[offer.equipments1, offer.equipments2, offer.equipments3]
                      .filter(Boolean)
                      .map((eq, index) => (
                        <li key={index}>{eq}</li>
                      ))}
                  </ul>
                </div>
              )}
            </>
          );

        case "RestaurantPreferences":
          return (
            <>
              <div className={styles.cardDetail}>
                <FontAwesomeIcon icon={faUtensils} className={styles.icon} />
                <span>Cuisine: {offer.cuisine_origine || "Non spécifié"}</span>
              </div>
              <div className={styles.cardDetail}>
                <FontAwesomeIcon icon={faSmile} className={styles.icon} />
                <span>Ambiance: {offer.ambiances || "Non spécifié"}</span>
              </div>
              {offer.services1 && (
                <div className={styles.cardServices}>
                  <h4>Services:</h4>
                  <ul>
                    {[offer.services1, offer.services2]
                      .filter(Boolean)
                      .map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                  </ul>
                </div>
              )}
            </>
          );

        case "ActivityPreferences":
          return (
            <>
              <div className={styles.cardDetail}>
                <FontAwesomeIcon icon={faClock} className={styles.icon} />
                <span>Durée: {offer.duration || "Non spécifié"}</span>
              </div>
              <div className={styles.cardDetail}>
                <FontAwesomeIcon icon={faUsers} className={styles.icon} />
                <span>Type: {offer.activity_type || "Non spécifié"}</span>
              </div>
              <div className={styles.cardDetail}>
                <FontAwesomeIcon icon={faSmile} className={styles.icon} />
                <span>Ambiance: {offer.ambiance || "Non spécifié"}</span>
              </div>
            </>
          );

        default:
          return null;
      }
    };

    return (
      <div
        className={`${styles["offer-card"]} ${isSelected ? styles.selected : ""}`}
        onClick={() => handleSelectOffer(offer)}
      >
        <div className={styles.cardImageContainer}>
          <img
            src={offer.image1}
            alt={offer.name_hotel || offer.name_restaurant || offer.name_activty || "Offre"}
            className={styles.cardImage}
          />
          <span className={styles.cardTag}>
            {offerType === "AccomodationPreferences" ? "HÔTEL" :
             offerType === "RestaurantPreferences" ? "RESTAURANT" : "ACTIVITÉ"}
          </span>
        </div>

        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>
            {offer.name_hotel || offer.name_restaurant || offer.name_activty || "Offre sans nom"}
          </h3>
          
          <div className={styles.cardDetails}>
            <div className={styles.cardPrice}>
              <FontAwesomeIcon icon={faEuroSign} className={styles.icon} />
              {offer.price || offer.budget || "N/A"}€
            </div>
            
            {offer.rating && (
              <div className={styles.cardRating}>
                {Array.from({ length: 5 }, (_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={i < offer.rating ? styles.starFilled : styles.starEmpty}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={styles.cardLocation}>
            <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} />
            {offer.adress || offer.location || "Adresse non spécifiée"}
          </div>

          <div className={styles.cardSpecificDetails}>
            {renderSpecificDetails()}
          </div>

          <div className={styles.cardActions}>
            <button 
              className={`${styles.actionButton} ${isSelected ? styles.selected : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectOffer(offer);
              }}
            >
              <FontAwesomeIcon icon={isSelected ? faCheck : faPlus} />
              {isSelected ? "Sélectionné" : "Ajouter"}
            </button>
          </div>
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
          <h1>Mon Catalogue Personnalisé</h1>
          <div className={styles["quick-filters"]}>
            <button onClick={() => setActiveTab("all")}>Tous</button>
            <button onClick={() => setActiveTab("hotels")}>
              <FontAwesomeIcon icon={faBed} /> Hôtels
            </button>
            <button onClick={() => setActiveTab("restaurants")}>
              <FontAwesomeIcon icon={faUtensils} /> Restaurants
            </button>
            <button onClick={() => setActiveTab("activities")}>
              <FontAwesomeIcon icon={faWalking} /> Activités
            </button>
          </div>
        </header>

        <div className={styles.statsSection}>
          <div className={styles.statCard}>
            <FontAwesomeIcon icon={faHeart} className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>{likedOffers.length}</span>
              <span className={styles.statLabel}>Offres likées</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <FontAwesomeIcon icon={faBed} className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>
                {likedOffers.filter(o => o.type === "AccomodationPreferences").length}
              </span>
              <span className={styles.statLabel}>Hôtels</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <FontAwesomeIcon icon={faUtensils} className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>
                {likedOffers.filter(o => o.type === "RestaurantPreferences").length}
              </span>
              <span className={styles.statLabel}>Restaurants</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <FontAwesomeIcon icon={faWalking} className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>
                {likedOffers.filter(o => o.type === "ActivityPreferences").length}
              </span>
              <span className={styles.statLabel}>Activités</span>
            </div>
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
                <FontAwesomeIcon icon={faTrash} /> Vider les likes de ce jour
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
          <FontAwesomeIcon icon={faTrash} /> Vider tous les likes
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
                  <FontAwesomeIcon icon={faPlus} /> Créer l'itinéraire
                </button>
              </div>
            ) : (
              <button onClick={() => setShowNameInput(true)}>
                <FontAwesomeIcon icon={faPen} /> Nommer et créer l'itinéraire
              </button>
            )}
            {itineraryId && (
              <button onClick={handleReviewItinerary}>
                <FontAwesomeIcon icon={faEye} /> Consulter l'itinéraire
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Catalog;
