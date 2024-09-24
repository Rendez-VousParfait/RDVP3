import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import styles from "./ItineraryHistory.module.css";
import { FaCalendar, FaEye } from "react-icons/fa";

const ItineraryHistory = () => {
  const [itineraries, setItineraries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      if (auth.currentUser) {
        const q = query(
          collection(db, "itineraries"),
          where("userId", "==", auth.currentUser.uid),
        );
        const querySnapshot = await getDocs(q);
        const itinerariesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItineraries(itinerariesData);
      }
    };

    fetchItineraries();
  }, []);

  const handleViewItinerary = (itineraryId) => {
    navigate(`/itinerary-review/${itineraryId}`);
  };

  return (
    <div className={styles.itineraryHistory}>
      <h1>Historique de vos itinéraires</h1>
      {itineraries.length === 0 ? (
        <p>Vous n'avez pas encore créé d'itinéraire.</p>
      ) : (
        <ul className={styles.itineraryList}>
          {itineraries.map((itinerary) => (
            <li key={itinerary.id} className={styles.itineraryItem}>
              <div className={styles.itineraryInfo}>
                <h2>{itinerary.name || "Itinéraire sans nom"}</h2>
                <p>
                  <FaCalendar className={styles.icon} />
                  Créé le : {itinerary.createdAt?.toDate().toLocaleDateString()}
                </p>
                <p>Nombre d'offres : {itinerary.offers?.length || 0}</p>
              </div>
              <button
                onClick={() => handleViewItinerary(itinerary.id)}
                className={styles.viewButton}
              >
                <FaEye className={styles.icon} /> Voir l'itinéraire
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItineraryHistory;
