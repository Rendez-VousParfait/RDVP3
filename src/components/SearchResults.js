import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  CircularProgress,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faEuroSign,
  faHotel,
  faUtensils,
  faRunning,
  faMapMarkerAlt,
  faWifi,
  faParking,
  faWheelchair,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./SearchResults.css";

const SearchResults = ({
  results,
  isGroupSearch,
  userRole,
  onSaveSearch,
  onSaveParticipation,
  isBroadenedSearch,
}) => {
  console.log("SearchResults props:", { results, isGroupSearch, userRole });

  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    hotel: true,
    activity: true,
    restaurant: true,
  });

  const [enhancedResultsWithImages, setEnhancedResultsWithImages] = useState(null);

  const enhancedResults = useMemo(() => {
    if (!results) return {};
    return {
      hotels: results.hotels || [],
      activities: results.activities || [],
      restaurants: results.restaurants || [],
    };
  }, [results]);

  const fetchImageUrls = useCallback(async () => {
    if (!enhancedResults) return enhancedResults;
    console.log("Initial results:", enhancedResults);
    const enhancedData = { ...enhancedResults };

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

      enhancedData[resultKey] = enhancedData[resultKey].map((item) => {
        const imageUrl = imageMap[item.id] || item.imageUrl || "/placeholder.jpg";
        console.log(`Image URL for ${resultKey} item ${item.id}:`, imageUrl);
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
  }, [enhancedResults]);

  useEffect(() => {
    const loadImageUrls = async () => {
      if (enhancedResults && Object.keys(enhancedResults).length > 0) {
        setIsLoading(true);
        const resultsWithImages = await fetchImageUrls();
        console.log("Results with images:", resultsWithImages);
        setEnhancedResultsWithImages(resultsWithImages);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    loadImageUrls();
  }, [enhancedResults, fetchImageUrls]);

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
    if (type === "hotel" && item) {
      if (item.equipments1 === "Wi-Fi gratuit")
        amenities.push(
          <FontAwesomeIcon key="wifi" icon={faWifi} className="amenityIcon" />,
        );
      if (item.equipments3 === "Parking")
        amenities.push(
          <FontAwesomeIcon
            key="parking"
            icon={faParking}
            className="amenityIcon"
          />,
        );
    }
    if (item && item.accessibility === "Oui") {
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

  const renderResultItem = (item, type) => {
    console.log(`Rendering ${type} item:`, item);
    console.log(`Image URL for ${type} item:`, item.imageUrl);

    return (
      <div key={item.id} className={`resultItem ${type}`}>
        <img 
          src={item.imageUrl || "/placeholder.jpg"}
          alt={item.name || "Image non disponible"}
          className="resultImage"
          onError={(e) => {
            console.error(`Error loading image for ${type} item:`, item.id);
            e.target.onerror = null;
            e.target.src = "/placeholder.jpg";
          }}
        />
        <div className="resultInfo">
          <h3>{item.name_hotel || item.name_activty || item.name_restaurant || "Nom non disponible"}</h3>
          {type === "hotel" && (
            <>
              <div className="rating">{renderStars(item.notation || 0)}</div>
              <p>{item.location || item.adress || "Emplacement non spécifié"}</p>
              <p className="price">
                <FontAwesomeIcon icon={faEuroSign} />
                {renderPrice(item.price)}
              </p>
              <div className="amenities">{renderAmenities(type, item)}</div>
            </>
          )}
          {type === "activity" && (
            <>
              <p>{item.description || "Description non disponible"}</p>
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {item.location || "Emplacement non spécifié"}
              </p>
              <p className="price">
                <FontAwesomeIcon icon={faEuroSign} />
                {renderPrice(item.budget)}
              </p>
            </>
          )}
          {type === "restaurant" && (
            <>
              <p>{item.description || "Description non disponible"}</p>
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {item.adress || "Adresse non spécifiée"}
              </p>
              <p className="price">
                <FontAwesomeIcon icon={faEuroSign} />
                {renderPrice(item.budget)}
              </p>
            </>
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

  const handleSaveSearch = async () => {
    if (onSaveSearch) {
      await onSaveSearch();
    }
  };

  const handleSaveParticipation = async () => {
    if (onSaveParticipation) {
      await onSaveParticipation();
    }
  };

  const renderPrice = (price) => {
    if (price == null || price === undefined) {
      return "Prix non disponible";
    }
    return typeof price === "number" ? `${price.toFixed(2)} €` : price;
  };

  if (isLoading) {
    return (
      <div className="loadingContainer">
        <CircularProgress />
        <p>Chargement des résultats...</p>
      </div>
    );
  }

  if (!enhancedResultsWithImages || Object.values(enhancedResultsWithImages).every(arr => arr.length === 0)) {
    console.log("No results found");
    return <p className="noResults">Aucun résultat trouvé. Veuillez élargir vos critères de recherche.</p>;
  }

  console.log("Rendering search results:", enhancedResultsWithImages);

  return (
    <div className="searchResults">
      <h2>Résultats de la recherche</h2>
      {isBroadenedSearch && (
        <p className="broadenedSearchInfo">
          Ces résultats proviennent d'une recherche élargie basée sur vos critères initiaux.
        </p>
      )}
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
      {renderResultSection(enhancedResultsWithImages.hotels, "Hôtels", faHotel, "hotel")}
      {renderResultSection(
        enhancedResultsWithImages.activities,
        "Activités",
        faRunning,
        "activity",
      )}
      {renderResultSection(
        enhancedResultsWithImages.restaurants,
        "Restaurants",
        faUtensils,
        "restaurant",
      )}
      {isGroupSearch && (
        <div className="groupActions">
          {userRole === "creator" && (
            <Button
              onClick={handleSaveSearch}
              className="saveSearchBtn"
              startIcon={<FontAwesomeIcon icon={faSave} />}
            >
              Enregistrer la recherche pour le groupe
            </Button>
          )}
          {userRole === "member" && (
            <Button
              onClick={handleSaveParticipation}
              className="saveParticipationBtn"
              startIcon={<FontAwesomeIcon icon={faSave} />}
            >
              Enregistrer ma participation
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
