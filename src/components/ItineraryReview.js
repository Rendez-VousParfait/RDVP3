import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./ItineraryReview.module.css";
import {
  FaCalendar,
  FaCreditCard,
  FaUtensils,
  FaBed,
  FaWalking,
  FaMoneyBillWave,
  FaBookOpen,
  FaMapMarkerAlt,
  FaClock,
  FaWheelchair,
  FaStar,
  FaUsers,
} from "react-icons/fa";

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
    if (
      !itinerary ||
      Object.keys(offerDates).length !== itinerary.offers.length
    )
      return "";

    const sortedOffers = [...itinerary.offers].sort(
      (a, b) => offerDates[a.id] - offerDates[b.id],
    );
    const startDate = new Date(Math.min(...Object.values(offerDates)));
    const endDate = new Date(Math.max(...Object.values(offerDates)));
    const duration =
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    let story = `Préparez-vous pour une aventure inoubliable de ${duration} jours${itinerary.name ? ` avec votre itinéraire "${itinerary.name}"` : ""} ! `;
    story += `Votre voyage commence le ${startDate.toLocaleDateString()} et se termine le ${endDate.toLocaleDateString()}. `;

    sortedOffers.forEach((offer, index) => {
      const offerDate = offerDates[offer.id].toLocaleDateString();

      switch (offer.type) {
        case "AccomodationPreferences":
          story += `Le ${offerDate}, vous vous installerez dans le confortable ${offer.name_hotel}. `;
          break;
        case "RestaurantPreferences":
          story += `${index === 0 ? "Pour commencer, vous" : "Vous"} dégusterez un délicieux repas au ${offer.name_restaurant} le ${offerDate}. `;
          break;
        case "ActivityPreferences":
          story += `Le ${offerDate}, l'aventure continue avec ${offer.name_activty}. `;
          break;
        default:
          story += `Le ${offerDate}, vous profiterez de ${offer.name_hotel || offer.name_restaurant || offer.name_activty}. `;
      }
    });

    story += `Cette escapade promet d'être riche en découvertes et en moments mémorables. Êtes-vous prêt à vivre cette expérience unique ?`;

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
          <p>{offer.description}</p>
          <div className={styles.offerInfo}>
            <p className={styles.offerPrice}>
              <FaMoneyBillWave className={styles.offerIcon} />
              Prix : {offer.price || offer.budget}€
            </p>
            <p className={styles.offerLocation}>
              <FaMapMarkerAlt className={styles.offerIcon} />
              {offer.adress || offer.location}
            </p>
            {offer.type === "AccomodationPreferences" && (
              <>
                <p className={styles.offerType}>
                  <FaBed className={styles.offerIcon} />
                  {offer.accomodation_type}
                </p>
                <p className={styles.offerStanding}>
                  <FaStar className={styles.offerIcon} />
                  {offer.standing}
                </p>
                <p className={styles.offerRating}>
                  <FaStar className={styles.offerIcon} />
                  Note : {offer.notation}/5
                </p>
                <p className={styles.offerEnvironment}>
                  <FaMapMarkerAlt className={styles.offerIcon} />
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
                  <FaUtensils className={styles.offerIcon} />
                  Cuisine {offer.cuisine_origine}, {offer.cuisinetype}
                </p>
                <p className={styles.offerAmbiance}>
                  Ambiance : {offer.ambiances}
                </p>
                <p className={styles.offerRating}>
                  <FaStar className={styles.offerIcon} />
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
                  <FaWalking className={styles.offerIcon} />
                  {offer.activity_type}
                </p>
                <p className={styles.offerDuration}>
                  <FaClock className={styles.offerIcon} />
                  Durée : {offer.duration}
                </p>
                <p className={styles.offerAmbiance}>
                  Ambiance : {offer.ambiance}
                </p>
                <p className={styles.offerEnvironment}>
                  <FaMapMarkerAlt className={styles.offerIcon} />
                  {offer.environment}
                </p>
                <p className={styles.offerPublicCible}>
                  <FaUsers className={styles.offerIcon} />
                  Public : {offer.public_cible}
                </p>
              </>
            )}
            <p className={styles.offerAccessibility}>
              <FaWheelchair className={styles.offerIcon} />
              Accessibilité : {offer.accessibility}
            </p>
          </div>
          <div className={styles.offerDatePicker}>
            <DatePicker
              selected={offerDates[offer.id]}
              onChange={(date) => handleOfferDateChange(date, offer.id)}
              placeholderText="Choisir une date pour cette offre"
            />
          </div>
        </div>
      </div>
    ));
  };

  if (!itinerary) return <div>Chargement...</div>;

  return (
    <div className={styles.itineraryReview}>
      <h1>{itinerary.name || "Récapitulatif de votre itinéraire"}</h1>

      <div className={styles.storyTelling}>
        <h2>
          <FaBookOpen /> Votre aventure en un coup d'œil
        </h2>
        <p>{generateStoryTelling()}</p>
      </div>

      <div className={styles.offersList}>
        <h2>
          <FaBed /> Hébergements
        </h2>
        {renderOffersByType("AccomodationPreferences")}

        <h2>
          <FaUtensils /> Restaurants
        </h2>
        {renderOffersByType("RestaurantPreferences")}

        <h2>
          <FaWalking /> Activités
        </h2>
        {renderOffersByType("ActivityPreferences")}
      </div>

      <div className={styles.totalPrice}>
        <h2>
          Prix total :{" "}
          {itinerary.offers.reduce(
            (sum, offer) => sum + (offer.price || offer.budget || 0),
            0,
          )}
          €
        </h2>
      </div>

      <div className={styles.actionButtons}>
        <button onClick={handleDateChange} className={styles.updateDates}>
          <FaCalendar /> Mettre à jour les dates
        </button>
        <button onClick={handlePayment} className={styles.paymentButton}>
          <FaCreditCard /> Procéder au paiement
        </button>
      </div>
    </div>
  );
};

export default ItineraryReview;
