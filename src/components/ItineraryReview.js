import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./ItineraryReview.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCreditCard,
  faUtensils,
  faBed,
  faWalking,
  faEuroSign,
  faBookOpen,
  faMapMarkerAlt,
  faClock,
  faWheelchair,
  faStar,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

registerLocale("fr", fr);

const ItineraryReview = () => {
  const { itineraryId } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [offerDates, setOfferDates] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItinerary = async () => {
      const docRef = doc(db, "itineraries", itineraryId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setItinerary(data);
        const dates = {};
        data.offers.forEach((offer) => {
          if (offer.date) dates[offer.id] = offer.date.toDate();
        });
        setOfferDates(dates);
      } else {
        alert("Itinéraire non trouvé");
        navigate("/catalog");
      }
    };
    fetchItinerary();
  }, [itineraryId, navigate]);

  const handleOfferDateChange = (date, offerId) => {
    setOfferDates((prev) => ({ ...prev, [offerId]: date }));
  };

  const handleDateChange = async () => {
    try {
      const updatedOffers = itinerary.offers.map((offer) => ({
        ...offer,
        date: offerDates[offer.id] || null,
      }));
      await updateDoc(doc(db, "itineraries", itineraryId), {
        offers: updatedOffers,
      });
      alert("Dates des offres mises à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des dates:", error);
      alert("Une erreur est survenue lors de la mise à jour des dates.");
    }
  };

  const handlePayment = () => {
    if (Object.keys(offerDates).length === itinerary.offers.length) {
      navigate(`/payment/${itineraryId}`);
    } else {
      alert(
        "Veuillez sélectionner une date pour chaque offre avant de procéder au paiement.",
      );
    }
  };

  const generateStoryTelling = () => {
    if (!itinerary || Object.keys(offerDates).length !== itinerary.offers.length) {
      return "Sélectionnez des dates pour toutes vos activités pour générer votre histoire.";
    }

    const sortedOffers = [...itinerary.offers].sort((a, b) => {
      const dateA = offerDates[a.id];
      const dateB = offerDates[b.id];
      if (!dateA || !dateB) return 0;
      return dateA - dateB;
    });

    const validDates = Object.values(offerDates).filter(date => date !== null);
    if (validDates.length === 0) {
      return "Sélectionnez des dates pour générer votre histoire.";
    }

    const startDate = new Date(Math.min(...validDates));
    const endDate = new Date(Math.max(...validDates));
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    let story = `Préparez-vous pour une aventure inoubliable de ${duration} jours${
      itinerary.name ? ` avec votre itinéraire "${itinerary.name}"` : ""
    } ! `;
    
    story += `Votre voyage commence le ${startDate.toLocaleDateString("fr-FR")} et se termine le ${endDate.toLocaleDateString("fr-FR")}. `;

    sortedOffers.forEach((offer) => {
      const offerDate = offerDates[offer.id];
      if (!offerDate) return;

      const dateStr = offerDate.toLocaleDateString("fr-FR");

      switch (offer.type) {
        case "AccomodationPreferences":
          story += `Le ${dateStr}, vous vous installerez dans le confortable ${offer.name_hotel}. `;
          break;
        case "RestaurantPreferences":
          story += `Le ${dateStr}, vous dégusterez un délicieux repas au ${offer.name_restaurant}. `;
          break;
        case "ActivityPreferences":
          story += `Le ${dateStr}, l'aventure continue avec ${offer.name_activty}. `;
          break;
        default:
          story += `Le ${dateStr}, vous profiterez de ${
            offer.name_hotel || offer.name_restaurant || offer.name_activty
          }. `;
      }
    });

    story += "Cette escapade promet d'être riche en découvertes et en moments mémorables. Êtes-vous prêt à vivre cette expérience unique ?";

    return story;
  };

  const renderOffersByType = (type) => {
    if (!itinerary) return null;

    const filteredOffers = itinerary.offers.filter(
      (offer) => offer.type === type,
    );

    return filteredOffers.map((offer, index) => (
      <div key={index} className={styles.offerItem}>
        <img
          src={offer.image1}
          alt={offer.name}
          className={styles.offerImage}
        />
        <div className={styles.offerDetails}>
          <h3>
            {offer.name_hotel || offer.name_restaurant || offer.name_activty}
          </h3>
          <div className={styles.offerInfo}>
            <p className={styles.offerPrice}>
              <FontAwesomeIcon icon={faEuroSign} className={styles.offerIcon} />
              Prix : {offer.price || offer.budget}€
            </p>
            <p className={styles.offerLocation}>
              <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.offerIcon} />
              {offer.adress || offer.location}
            </p>
            {offer.type === "AccomodationPreferences" && (
              <>
                <p className={styles.offerType}>
                  <FontAwesomeIcon icon={faBed} className={styles.offerIcon} />
                  {offer.accomodation_type}
                </p>
                <p className={styles.offerStanding}>
                  <FontAwesomeIcon icon={faStar} className={styles.offerIcon} />
                  {offer.standing}
                </p>
                <p className={styles.offerRating}>
                  <FontAwesomeIcon icon={faStar} className={styles.offerIcon} />
                  Note : {offer.notation}/5
                </p>
                <p className={styles.offerEnvironment}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.offerIcon} />
                  {offer.environment}
                </p>
                <p className={styles.offerEquipments}>
                  Équipements :{" "}
                  {[offer.equipments1, offer.equipments2, offer.equipments3]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </>
            )}
            {offer.type === "RestaurantPreferences" && (
              <>
                <p className={styles.offerCuisine}>
                  <FontAwesomeIcon icon={faUtensils} className={styles.offerIcon} />
                  Cuisine {offer.cuisine_origine}, {offer.cuisinetype}
                </p>
                <p className={styles.offerAmbiance}>
                  Ambiance : {offer.ambiances}
                </p>
                <p className={styles.offerRating}>
                  <FontAwesomeIcon icon={faStar} className={styles.offerIcon} />
                  Note : {offer.evaluation}/5
                </p>
                <p className={styles.offerServices}>
                  Services :{" "}
                  {[offer.services1, offer.services2]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </>
            )}
            {offer.type === "ActivityPreferences" && (
              <>
                <p className={styles.offerActivityType}>
                  <FontAwesomeIcon icon={faWalking} className={styles.offerIcon} />
                  {offer.activity_type}
                </p>
                <p className={styles.offerDuration}>
                  <FontAwesomeIcon icon={faClock} className={styles.offerIcon} />
                  Durée : {offer.duration}
                </p>
                <p className={styles.offerAmbiance}>
                  Ambiance : {offer.ambiance}
                </p>
                <p className={styles.offerEnvironment}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.offerIcon} />
                  {offer.environment}
                </p>
                <p className={styles.offerPublicCible}>
                  <FontAwesomeIcon icon={faUsers} className={styles.offerIcon} />
                  Public : {offer.public_cible}
                </p>
              </>
            )}
            <p className={styles.offerAccessibility}>
              <FontAwesomeIcon icon={faWheelchair} className={styles.offerIcon} />
              Accessibilité : {offer.accessibility}
            </p>
          </div>
          
          <div className={styles.datePickerWrapper}>
            <div className={styles.datePickerLabel}>
              <FontAwesomeIcon icon={faCalendar} />
              <span>Date prévue</span>
            </div>
            <div className={styles.datePickerControl}>
              <DatePicker
                selected={offerDates[offer.id]}
                onChange={(date) => handleOfferDateChange(date, offer.id)}
                dateFormat="dd/MM/yyyy"
                locale="fr"
                placeholderText="Sélectionner une date"
                minDate={new Date()}
                className={styles.customDatePicker}
                calendarClassName={styles.customCalendar}
                wrapperClassName={styles.datePickerContainer}
                showPopperArrow={false}
                customInput={
                  <button className={styles.dateButton}>
                    {offerDates[offer.id] 
                      ? new Date(offerDates[offer.id]).toLocaleDateString("fr-FR")
                      : "Choisir une date"}
                  </button>
                }
              />
              {offerDates[offer.id] && (
                <button 
                  className={styles.clearDateButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOfferDateChange(null, offer.id);
                  }}
                  title="Effacer la date"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  if (!itinerary) return <div>Chargement...</div>;

  return (
    <div className={styles.itineraryReview}>
      <header className={styles.header}>
        <h1>{itinerary.name || "Récapitulatif de votre itinéraire"}</h1>
      </header>

      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <FontAwesomeIcon icon={faBookOpen} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {itinerary.offers.filter(o => o.type === "AccomodationPreferences").length}
            </span>
            <span className={styles.statLabel}>Hébergements</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <FontAwesomeIcon icon={faUtensils} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {itinerary.offers.filter(o => o.type === "RestaurantPreferences").length}
            </span>
            <span className={styles.statLabel}>Restaurants</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <FontAwesomeIcon icon={faWalking} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {itinerary.offers.filter(o => o.type === "ActivityPreferences").length}
            </span>
            <span className={styles.statLabel}>Activités</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <FontAwesomeIcon icon={faEuroSign} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {itinerary.offers.reduce(
                (sum, offer) => sum + (offer.price || offer.budget || 0),
                0,
              )}€
            </span>
            <span className={styles.statLabel}>Budget total</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <FontAwesomeIcon icon={faCalendar} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {Object.keys(offerDates).length}/{itinerary.offers.length}
            </span>
            <span className={styles.statLabel}>Dates planifiées</span>
          </div>
        </div>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.storyTelling}>
          <h2>
            <FontAwesomeIcon icon={faBookOpen} /> Votre aventure en un coup d'œil
          </h2>
          <p>{generateStoryTelling()}</p>
        </div>

        <div className={styles.offersList}>
          <div className={styles.offerTypeSection}>
            <h3>
              <FontAwesomeIcon icon={faBed} /> Hébergements
            </h3>
            {renderOffersByType("AccomodationPreferences")}
          </div>

          <div className={styles.offerTypeSection}>
            <h3>
              <FontAwesomeIcon icon={faUtensils} /> Restaurants
            </h3>
            {renderOffersByType("RestaurantPreferences")}
          </div>

          <div className={styles.offerTypeSection}>
            <h3>
              <FontAwesomeIcon icon={faWalking} /> Activités
            </h3>
            {renderOffersByType("ActivityPreferences")}
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button onClick={handleDateChange} className={styles.updateDates}>
            <FontAwesomeIcon icon={faCalendar} /> Mettre à jour les dates
          </button>
          <button onClick={handlePayment} className={styles.paymentButton}>
            <FontAwesomeIcon icon={faCreditCard} /> Procéder au paiement
          </button>
        </div>
      </main>
    </div>
  );
};

export default ItineraryReview;
