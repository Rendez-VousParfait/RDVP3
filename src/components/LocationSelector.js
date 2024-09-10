import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faSearch, faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './LocationSelector.module.css';

const cities = [
  { name: 'Paris', icon: '🗼', description: "La ville de l'amour" },
  { name: 'Marseille', icon: '⚓', description: 'Cité phocéenne' },
  { name: 'Lyon', icon: '🍽️', description: 'Capitale gastronomique' },
  { name: 'Toulouse', icon: '🚀', description: 'La ville rose' },
  { name: 'Nice', icon: '🏖️', description: "Perle de la Côte d'Azur" },
  { name: 'Nantes', icon: '🐘', description: 'Cité des Ducs de Bretagne' },
  { name: 'Strasbourg', icon: '🏰', description: 'Capitale européenne' },
  { name: 'Montpellier', icon: '☀️', description: 'Ville ensoleillée du sud' },
  { name: 'Bordeaux', icon: '🍷', description: 'Capitale mondiale du vin' },
  { name: 'Lille', icon: '🧱', description: 'Capitale des Flandres' },
];

const LocationSelector = ({ selectedLocation, setSelectedLocation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredCities.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (e.key === 'Enter' && highlightedIndex !== -1) {
      setSelectedLocation(filteredCities[highlightedIndex].name);
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.locationSelector} ref={dropdownRef}>
      <div
        className={`${styles.selectedLocation} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.locationIcon} />
        <span>{selectedLocation}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`${styles.dropdownIcon} ${isOpen ? styles.open : ''}`}
        />
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.searchContainer}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher une ville"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              onKeyDown={handleKeyDown}
            />
            {searchTerm && (
              <FontAwesomeIcon
                icon={faTimes}
                className={styles.clearIcon}
                onClick={() => setSearchTerm('')}
              />
            )}
          </div>
          <ul className={styles.cityList}>
            {filteredCities.map((city, index) => (
              <li
                key={city.name}
                onClick={() => {
                  setSelectedLocation(city.name);
                  setIsOpen(false);
                }}
                className={`
                  ${city.name === selectedLocation ? styles.active : ''}
                  ${index === highlightedIndex ? styles.highlighted : ''}
                `}
              >
                <div className={styles.cityInfo}>
                  <span className={styles.cityIcon}>{city.icon}</span>
                  <div className={styles.cityText}>
                    <span className={styles.cityName}>{city.name}</span>
                    <span className={styles.cityDescription}>{city.description}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;