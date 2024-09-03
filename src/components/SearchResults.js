import React from "react";
import "./SearchResults.css";

const SearchResults = ({ results }) => {
  return (
    <div className="search-results">
      <h2>Résultats de votre recherche</h2>
      <div className="results-section">
        <h3>Hôtels</h3>
        {results.hotels.map((hotel) => (
          <div key={hotel.id} className="result-item">
            <h4>{hotel.name}</h4>
            <p>{hotel.description}</p>
            <p>Prix: {hotel.price}€ par nuit</p>
          </div>
        ))}
      </div>
      <div className="results-section">
        <h3>Activités</h3>
        {results.activities.map((activity) => (
          <div key={activity.id} className="result-item">
            <h4>{activity.name}</h4>
            <p>{activity.description}</p>
            <p>Prix: {activity.price}€</p>
          </div>
        ))}
      </div>
      <div className="results-section">
        <h3>Restaurants</h3>
        {results.restaurants.map((restaurant) => (
          <div key={restaurant.id} className="result-item">
            <h4>{restaurant.name}</h4>
            <p>{restaurant.description}</p>
            <p>Prix moyen: {restaurant.price}€</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
