import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import styles from './Catalog.module.css';
import { FaUtensils, FaMoneyBillWave, FaBed, FaWalking } from "react-icons/fa";

const Catalog = () => {
  const [likedOffers, setLikedOffers] = useState([]);

  useEffect(() => {
    const fetchLikedOffers = async () => {
      if (auth.currentUser) {
        const q = query(collection(db, "userLikes"), where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const likes = querySnapshot.docs.map(doc => doc.data().offer);
        console.log("Fetched offers:", likes); // Log pour déboguer
        setLikedOffers(likes);
      }
    };
    fetchLikedOffers();
  }, []);

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
    if (offer?.cuisine && Array.isArray(offer.cuisine) && offer.cuisine.length > 0) {
      return offer.cuisine.join(", ");
    }
    return offer?.type || "Activité";
  };

  return (
    <div className={styles.catalog}>
      <h1>Catalogue des offres likées</h1>
      {likedOffers.length === 0 ? (
        <p>Aucune offre likée pour le moment.</p>
      ) : (
        <div className={styles.offerGrid}>
          {likedOffers.map((offer, index) => (
            <div key={index} className={styles.offerCard}>
              {offer?.image ? (
                <img src={offer.image} alt={offer.name} className={styles.offerImage} />
              ) : (
                <div className={styles.placeholderImage}>Image non disponible</div>
              )}
              <div className={styles.offerInfo}>
                <h3 className={styles.offerName}>{offer?.name || 'Nom inconnu'}</h3>
                <p className={styles.offerDescription}>{offer?.description || 'Description non disponible'}</p>
                <div className={styles.offerDetails}>
                  <p className={styles.offerType}>
                    {getTypeIcon(offer?.type)}
                    {getTypeOrCuisine(offer)}
                  </p>
                  <p className={styles.offerPrice}>
                    <FaMoneyBillWave className={styles.offerIcon} />
                    {offer?.price != null ? `${offer.price}€` : 'Prix non disponible'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;