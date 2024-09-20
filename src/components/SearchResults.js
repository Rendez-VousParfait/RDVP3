import React, { useState, useEffect } from "react";
import { CircularProgress, Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faEuroSign,
  faHotel,
  faUtensils,
  faRunning,
  faPercent,
  faMapMarkerAlt,
  faWifi,
  faParking,
  faSwimmingPool,
  faWheelchair,
  faClock,
  faCalendar,
  faLeaf,
  faGlassMartiniAlt,
  faUmbrellaBeach,
  faTree,
  faCity,
} from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./SearchResults.css";

const SearchResults = ({ results, isGroupSearch, userRole }) => {
  const [enhancedResults, setEnhancedResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    hotel: true,
    activity: true,
    restaurant: true,
  });
  const [imageLoadedStates, setImageLoadedStates] = useState({});

  useEffect(() => {
    const fetchImageUrls = async () => {
      setIsLoading(true);
      console.log("Initial results:", results);
      const enhancedData = { ...results };

      const getImageUrls = async (collectionName, resultKey) => {
        if (!enhancedData[resultKey]) {
          console.log(`No data for ${resultKey}`);
          return;
        }

        const querySnapshot = await getDocs(collection(db, collectionName));
        const imageMap = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          imageMap[data.id] = data.image1 || "/placeholder.jpg";
        });

        enhancedData[resultKey] = enhancedData[resultKey].map((item) => ({
          ...item,
          imageUrl: imageMap[item.id] || "/placeholder.jpg",
        }));
      };

      await getImageUrls("ActivityPreferences", "activities");
      await getImageUrls("RestaurantPreferences", "restaurants");
      await getImageUrls("AccomodationPreferences", "accommodations");

      console.log("Enhanced data:", enhancedData);
      setEnhancedResults(enhancedData);
      setIsLoading(false);

      const initialImageLoadedStates = {};
      Object.values(enhancedData).forEach(category => {
        if (Array.isArray(category)) {
          category.forEach(item => {
            initialImageLoadedStates[item.id] = false;
          });
        }
      });
      setImageLoadedStates(initialImageLoadedStates);
    };

    if (results) {
      fetchImageUrls();
    }
  }, [results]);

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.checked });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={i <= rating ? "star filled" : "star"}
        />,
      );
    }
    return stars;
  };

  const renderAmenities = (type, item) => {
    const amenities = [];
    if (type === "hotel") {
      if (item.wifi || item.equipments1 === "Wi-Fi gratuit")
        amenities.push(
          <FontAwesomeIcon key="wifi" icon={faWifi} className="amenityIcon" />,
        );
      if (item.parking || item.equipments3 === "Parking")
        amenities.push(
          <FontAwesomeIcon
            key="parking"
            icon={faParking}
            className="amenityIcon"
          />,
        );
      if (item.pool)
        amenities.push(
          <FontAwesomeIcon
            key="pool"
            icon={faSwimmingPool}
            className="amenityIcon"
          />,
        );
    }
    if (item.accessibility === "Oui") {
      amenities.push(
        <FontAwesomeIcon
          key="accessible"
          icon={faWheelchair}
          className="amenityIcon"
        />,
      );
    }
    return amenities;
  };

  const renderEnvironmentIcon = (environment) => {
    switch (environment.toLowerCase()) {
      case "centre-ville":
        return <FontAwesomeIcon icon={faCity} />;
      case "vignobles":
        return <FontAwesomeIcon icon={faTree} />;
      case "extérieur":
        return <FontAwesomeIcon icon={faUmbrellaBeach} />;
      default:
        return null;
    }
  };

  const renderResultCard = (item, type) => {
    console.log("Rendering item:", item);
    console.log("Item type:", type);

    const imageLoaded = imageLoadedStates[item.id] || false;

    const handleImageLoad = () => {
      console.log("Image chargée:", item.image1);
      setImageLoadedStates(prev => ({ ...prev, [item.id]: true }));
    };

    const handleImageError = (e) => {
      console.error("Erreur de chargement de l'image:", item.image1);
      e.target.onerror = null;
      e.target.src = "/placeholder.jpg";
      setImageLoadedStates(prev => ({ ...prev, [item.id]: true }));
    };

    return (
      <div className="resultCard" key={item.id}>
        <div className="cardContent">
          <div className="imageContainer">
            {!imageLoaded && <div className="imagePlaceholder">Chargement...</div>}
            <img
              src={item.image1 || "/placeholder.jpg"}
              alt={item.name_hotel || item.name_activty || item.name_restaurant || "Image non disponible"}
              className="resultImage"
              style={{ display: imageLoaded ? 'block' : 'none' }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
          <div className="detailsContainer">
            <h2 className="cardTitle">
              {item.name_hotel || item.name_activty || item.name_restaurant || "Nom non disponible"}
            </h2>
            <p className="location">
              <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
              {item.adress || item.location || "Emplacement non spécifié"}
            </p>
            <div className="infoContainer">
              {type === "hotel" && (
                <>
                  <span className="infoBadge"><FontAwesomeIcon icon={faHotel} /> {item.accomodation_type || "Type non spécifié"}</span>
                  <span className="infoBadge"><FontAwesomeIcon icon={faStar} /> {item.standing || "Standing non spécifié"}</span>
                  <span className="infoBadge"><FontAwesomeIcon icon={faLeaf} /> {item.style || "Style non spécifié"}</span>
                </>
              )}
              {type === "restaurant" && (
                <>
                  <span className="infoBadge"><FontAwesomeIcon icon={faUtensils} /> {item.cuisine_origine || "Origine non spécifiée"}</span>
                  <span className="infoBadge"><FontAwesomeIcon icon={faLeaf} /> {item.cuisinetype || "Type non spécifié"}</span>
                </>
              )}
              {type === "activity" && (
                <>
                  <span className="infoBadge"><FontAwesomeIcon icon={faRunning} /> {item.activity_type || "Type non spécifié"}</span>
                  <span className="infoBadge"><FontAwesomeIcon icon={faUmbrellaBeach} /> {item.cadre || "Cadre non spécifié"}</span>
                </>
              )}
            </div>
            <p className="description">
              {item.description || "Description non disponible"}
            </p>
            {item.public_cible && (
              <p className="publicCible">
                Public cible: {item.public_cible}
              </p>
            )}
            {item.environment && (
              <p className="environment">
                {renderEnvironmentIcon(item.environment)} {item.environment}
              </p>
            )}
            {item.duration && (
              <p className="duration">
                <FontAwesomeIcon icon={faClock} /> Durée: {item.duration}
              </p>
            )}
            {(item.ambiance || item.ambiances) && (
              <p className="ambiance">
                <FontAwesomeIcon icon={faGlassMartiniAlt} /> Ambiance: {item.ambiance || item.ambiances}
              </p>
            )}
            <div className="ratingContainer">
              <div className="ratingStars">{renderStars(item.notation || item.evaluation || 0)}</div>
              <span className="ratingScore">{item.notation || item.evaluation || "N/A"}</span>
            </div>
            <div className="amenities">
              {renderAmenities(type, item)}
              {item.equipments1 && <span className="amenityChip">{item.equipments1}</span>}
              {item.equipments2 && <span className="amenityChip">{item.equipments2}</span>}
              {item.equipments3 && <span className="amenityChip">{item.equipments3}</span>}
              {item.services1 && <span className="amenityChip">{item.services1}</span>}
              {item.services2 && <span className="amenityChip">{item.services2}</span>}
            </div>
            {item.accessibility && (
              <p className="accessibility">
                <FontAwesomeIcon icon={faWheelchair} /> Accessibilité: {item.accessibility}
              </p>
            )}
            {item.score !== undefined && (
              <p className="score">
                <FontAwesomeIcon icon={faPercent} /> Correspondance:{" "}
                {typeof item.score === "number" ? item.score.toFixed(0) : item.score}%
              </p>
            )}
          </div>
          <div className="priceContainer">
            <p className="price">
              <FontAwesomeIcon icon={faEuroSign} />
              {item.price || item.budget
                ? `${item.price || item.budget}${type === "hotel" ? " /nuit" : " /personne"}`
                : "Prix non disponible"}
            </p>
            <button className="moreInfoBtn">Voir l'offre</button>
          </div>
        </div>
      </div>
    );
  };

  const renderResultSection = (items, title, icon, type) => {
    if (!items || items.length === 0 || !filters[type]) return null;

    return (
      <div className="resultSection">
        <h2 className="sectionTitle">
          <FontAwesomeIcon icon={icon} /> {title}
        </h2>
        <div className="cardContainer">
          {items.map((item) => renderResultCard(item, type))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="loadingContainer">
        <CircularProgress />
        <p>Chargement des résultats...</p>
      </div>
    );
  }

  if (!enhancedResults || Object.keys(enhancedResults).length === 0) {
    return (
      <p className="noResults">
        Aucun résultat trouvé
      </p>
    );
  }

  return (
    <div className="searchResults">
      <h1 className="resultsTitle">Résultats de recherche</h1>
      <div className="filtersContainer">
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.hotel}
                onChange={handleFilterChange}
                name="hotel"
              />
            }
            label="Hôtels"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.activity}
                onChange={handleFilterChange}
                name="activity"
              />
            }
            label="Activités"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.restaurant}
                onChange={handleFilterChange}
                name="restaurant"
              />
            }
            label="Restaurants"
          />
        </FormGroup>
      </div>
      {enhancedResults?.accommodations && renderResultSection(
        enhancedResults.accommodations,
        "Hébergements",
        faHotel,
        "hotel",
      )}
      {enhancedResults?.activities && renderResultSection(
        enhancedResults.activities,
        "Activités",
        faRunning,
        "activity",
      )}
      {enhancedResults?.restaurants && renderResultSection(
        enhancedResults.restaurants,
        "Restaurants",
        faUtensils,
        "restaurant",
      )}
    </div>
  );
};

export default SearchResults;