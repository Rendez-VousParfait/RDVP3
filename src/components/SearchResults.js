import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchResults.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faHeart,
  faBed,
  faUtensils,
  faRunning,
  faSort,
  faMapMarkerAlt,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";

const SearchResults = ({ results, currentStep, totalSteps }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    hotels: true,
    activities: true,
    restaurants: true,
  });
  const [favorites, setFavorites] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("recommended");
  const [compareItems, setCompareItems] = useState([]);
  const itemsPerPage = 5;

  useEffect(() => {
    const newFilteredItems = [
      ...(activeFilters.hotels ? results.hotels : []),
      ...(activeFilters.activities ? results.activities : []),
      ...(activeFilters.restaurants ? results.restaurants : []),
    ];
    setFilteredItems(sortItems(newFilteredItems));
    setCurrentPage(1);
  }, [activeFilters, results, sortCriteria]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleFilter = (filter) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const toggleFavorite = (id) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id],
    );
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill()
      .map((_, index) => (
        <FontAwesomeIcon
          key={index}
          icon={faStar}
          className={index < rating ? "star-filled" : "star-empty"}
        />
      ));
  };

  const sortItems = (items) => {
    switch (sortCriteria) {
      case "priceAsc":
        return [...items].sort((a, b) => a.price - b.price);
      case "priceDesc":
        return [...items].sort((a, b) => b.price - a.price);
      case "rating":
        return [...items].sort((a, b) => b.rating - a.rating);
      default:
        return items;
    }
  };

  const toggleCompare = (item) => {
    setCompareItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : prev.length < 3
          ? [...prev, item]
          : prev,
    );
  };

  return (
    <div className="search-step">
      <div className="progress-indicator">
        Étape {currentStep} sur {totalSteps}
      </div>
      <h2 className="step-title">Résultats de votre recherche</h2>

      <div className="filter-summary">
        Filtres actifs :
        {activeFilters.hotels && <span className="filter-tag">Hôtels</span>}
        {activeFilters.activities && (
          <span className="filter-tag">Activités</span>
        )}
        {activeFilters.restaurants && (
          <span className="filter-tag">Restaurants</span>
        )}
      </div>

      <div className="filter-sort-container">
        <div className="filter-buttons">
          <button
            className={`filter-button ${activeFilters.hotels ? "active" : ""}`}
            onClick={() => toggleFilter("hotels")}
          >
            <FontAwesomeIcon icon={faBed} /> Hôtels
          </button>
          <button
            className={`filter-button ${activeFilters.activities ? "active" : ""}`}
            onClick={() => toggleFilter("activities")}
          >
            <FontAwesomeIcon icon={faRunning} /> Activités
          </button>
          <button
            className={`filter-button ${activeFilters.restaurants ? "active" : ""}`}
            onClick={() => toggleFilter("restaurants")}
          >
            <FontAwesomeIcon icon={faUtensils} /> Restaurants
          </button>
        </div>
        <div className="sort-container">
          <FontAwesomeIcon icon={faSort} />
          <select
            onChange={(e) => setSortCriteria(e.target.value)}
            value={sortCriteria}
          >
            <option value="recommended">Recommandés</option>
            <option value="priceAsc">Prix croissant</option>
            <option value="priceDesc">Prix décroissant</option>
            <option value="rating">Mieux notés</option>
          </select>
        </div>
      </div>

      <div className="results-list">
        {currentItems.map((item) => (
          <div key={item.id} className="result-item">
            <div className="result-content">
              <h3>{item.name}</h3>
              <p className="result-description">{item.description}</p>
              <div className="result-details">
                <div className="rating">{renderStars(item.rating)}</div>
                <p className="price">{item.price}€</p>
              </div>
              <div className="result-actions">
                <button
                  className="details-button"
                  onClick={() => navigate(`/details/${item.id}`)}
                >
                  Plus de détails
                </button>
                <button
                  className={`favorite-button ${favorites.includes(item.id) ? "favorited" : ""}`}
                  onClick={() => toggleFavorite(item.id)}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <button
                  className={`compare-button ${compareItems.includes(item) ? "active" : ""}`}
                  onClick={() => toggleCompare(item)}
                >
                  <FontAwesomeIcon icon={faExchangeAlt} />
                </button>
                <button className="map-button">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {compareItems.length > 0 && (
        <div className="compare-panel">
          <h4>Comparaison ({compareItems.length}/3)</h4>
          {compareItems.map((item) => (
            <div key={item.id} className="compare-item">
              {item.name}
              <button onClick={() => toggleCompare(item)}>Retirer</button>
            </div>
          ))}
          {compareItems.length > 1 && (
            <button
              onClick={() =>
                navigate("/compare", { state: { items: compareItems } })
              }
            >
              Comparer
            </button>
          )}
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>

      <div className="navigation-buttons">
        <button className="nav-button" onClick={() => navigate(-1)}>
          Retour à la recherche
        </button>
        <button className="nav-button" onClick={() => navigate("/payment")}>
          Réserver et payer
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
