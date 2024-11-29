import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHotel,
  faUtensils,
  faRunning,
  faSave,
  faStar,
  faMapMarkerAlt,
  faEuroSign,
} from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./GroupSearchResults.css";

const ProgressiveImage = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState("/placeholder.jpg");
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setError(false);
    };
    img.onerror = () => {
      console.error(`Erreur de chargement de l'image: ${src}`);
      setError(true);
    };
  }, [src]);

  if (error) {
    return <div className={`${className} placeholder`}>{alt}</div>;
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
    />
  );
};

const GroupSearchResults = ({ 
  results, 
  groupId, 
  onSaveSearch, 
  onSaveParticipation, 
  isMember, 
  userRole 
}) => {
  console.log("GroupSearchResults props:", { results, groupId, isMember, userRole });

  const [filters, setFilters] = useState({
    hotel: true,
    activity: true,
    restaurant: true,
  });

  const [enhancedResultsWithImages, setEnhancedResultsWithImages] = useState(null);

  const formattedResults = useMemo(() => {
    if (!results) return null;
    return {
      hotels: results.hotels || [],
      activities: results.activities || [],
      restaurants: results.restaurants || []
    };
  }, [results]);

  const fetchImageUrls = useCallback(async () => {
    if (!formattedResults) return formattedResults;
    console.log("Initial results:", formattedResults);
    const enhancedData = { ...formattedResults };

    const getImageUrls = async (collectionName, resultKey) => {
      if (!enhancedData[resultKey]) {
        console.log(`No data for ${resultKey}`);
        return;
      }

      const querySnapshot = await getDocs(collection(db, collectionName));
      const imageMap = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`Image data for ${resultKey}:`, data);
        imageMap[data.id] = data.image1 || "/placeholder.jpg";
      });

      enhancedData[resultKey] = enhancedData[resultKey].map((item) => {
        const imageUrl = imageMap[item.id] || "/placeholder.jpg";
        console.log(`Mapped image URL for ${resultKey} item ${item.id}:`, imageUrl);
        return {
          ...item,
          imageUrl: imageUrl,
        };
      });
    };

    await Promise.all([
      getImageUrls("AccomodationPreferences", "hotels"),
      getImageUrls("ActivityPreferences", "activities"),
      getImageUrls("RestaurantPreferences", "restaurants"),
    ]);

    console.log("Enhanced data:", enhancedData);
    return enhancedData;
  }, [formattedResults]);

  useEffect(() => {
    const loadImageUrls = async () => {
      if (formattedResults) {
        const resultsWithImages = await fetchImageUrls();
        console.log("Results with images:", resultsWithImages);
        setEnhancedResultsWithImages(resultsWithImages);
      }
    };

    loadImageUrls();
  }, [formattedResults, fetchImageUrls]);

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.checked });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={i < Math.round(rating) ? "star-filled" : "star-empty"}
        />
      );
    }
    return stars;
  };

  const renderResultItem = (item, type) => {
    console.log(`Rendering ${type} item:`, item);
    return (
      <div key={item.id} className={`resultItem ${type}`}>
        <ProgressiveImage 
          src={item.imageUrl || item.image1 || "/placeholder.jpg"}
          alt={item.name || item.name_hotel || item.name_activty || item.name_restaurant || "Image non disponible"}
          className="resultImage"
        />
        <div className="resultInfo">
          <h3>{item.name || item.name_hotel || item.name_activty || item.name_restaurant}</h3>
          {item.rating && (
            <div className="rating">
              {renderStars(item.rating)}
              <span>{item.rating.toFixed(1)}</span>
            </div>
          )}
          <p className="description">{item.description || "Pas de description disponible"}</p>
          {item.adress && (
            <p className="address">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> {item.adress}
            </p>
          )}
          <p className="price">
            <FontAwesomeIcon icon={faEuroSign} /> 
            {item.price || item.budget || "Non spécifié"}
          </p>
          {type === "hotel" && item.standing && (
            <p className="standing">Standing: {item.standing}</p>
          )}
          {type === "activity" && item.duration && (
            <p className="duration">Durée: {item.duration}</p>
          )}
          {type === "restaurant" && item.cuisine_origine && (
            <p className="cuisine">Cuisine: {item.cuisine_origine}</p>
          )}
        </div>
      </div>
    );
  };

  const renderResultSection = (items, title, icon, type) => {
    console.log(`Rendering ${type} section:`, items);
    if (!items || items.length === 0 || !filters[type]) return null;

    return (
      <div className={`resultSection ${type}`}>
        <h3>
          <FontAwesomeIcon icon={icon} /> {title}
        </h3>
        <div className="resultList">
          {items.map((item) => renderResultItem(item, type))}
        </div>
      </div>
    );
  };

  if (!enhancedResultsWithImages) {
    return <div className="loading">Chargement des résultats...</div>;
  }

  return (
    <div className="groupSearchResults">
      <h2>Résultats de la recherche de groupe</h2>
      <div className="filters">
        <label>
          <input
            type="checkbox"
            name="hotel"
            checked={filters.hotel}
            onChange={handleFilterChange}
          />
          Hôtels
        </label>
        <label>
          <input
            type="checkbox"
            name="activity"
            checked={filters.activity}
            onChange={handleFilterChange}
          />
          Activités
        </label>
        <label>
          <input
            type="checkbox"
            name="restaurant"
            checked={filters.restaurant}
            onChange={handleFilterChange}
          />
          Restaurants
        </label>
      </div>
      {renderResultSection(enhancedResultsWithImages.hotels, "Hôtels", faHotel, "hotel")}
      {renderResultSection(enhancedResultsWithImages.activities, "Activités", faRunning, "activity")}
      {renderResultSection(enhancedResultsWithImages.restaurants, "Restaurants", faUtensils, "restaurant")}
      {userRole === "creator" && (
        <button onClick={onSaveSearch} className="saveButton">
          <FontAwesomeIcon icon={faSave} /> Enregistrer la recherche
        </button>
      )}
      {isMember && (
        <button onClick={onSaveParticipation} className="saveButton">
          <FontAwesomeIcon icon={faSave} /> Enregistrer ma participation
        </button>
      )}
    </div>
  );
};

export default GroupSearchResults;
