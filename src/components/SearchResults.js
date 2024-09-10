import React from 'react';
import styles from './SearchResults.css';

const SearchResults = ({ results, isGroupSearch }) => {
  return (
    <div className={styles.searchResults}>
      <h2>Résultats de recherche</h2>

      <h3>Hôtels</h3>
      <ul>
        {results.hotels.map((hotel, index) => (
          <li key={index} className={styles.resultItem}>
            <h4>{hotel.name}</h4>
            <p>Prix: {hotel.price}€</p>
            <p>Type: {hotel.type}</p>
            {isGroupSearch && hotel.score !== undefined && (
              <p>Score: {hotel.score.toFixed(2)}</p>
            )}
          </li>
        ))}
      </ul>

      <h3>Activités</h3>
      <ul>
        {results.activities.map((activity, index) => (
          <li key={index} className={styles.resultItem}>
            <h4>{activity.name}</h4>
            <p>Prix: {activity.price}€</p>
            <p>Catégorie: {activity.category}</p>
            {isGroupSearch && activity.score !== undefined && (
              <p>Score: {activity.score.toFixed(2)}</p>
            )}
          </li>
        ))}
      </ul>

      <h3>Restaurants</h3>
      <ul>
        {results.restaurants.map((restaurant, index) => (
          <li key={index} className={styles.resultItem}>
            <h4>{restaurant.name}</h4>
            <p>Prix: {restaurant.price}€</p>
            <p>Cuisine: {restaurant.cuisine}</p>
            {isGroupSearch && restaurant.score !== undefined && (
              <p>Score: {restaurant.score.toFixed(2)}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;