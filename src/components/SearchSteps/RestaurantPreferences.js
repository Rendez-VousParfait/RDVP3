import React from "react";
import styles from "./RestaurantPreferences.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faFlag,
  faWheatAlt,
  faCalendarDay,
  faUmbrellaBeach,
  faMusic,
  faBaby,
} from "@fortawesome/free-solid-svg-icons";

const RestaurantPreferences = ({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
}) => {
  const cuisineTypes = [
    { id: "duMonde", icon: faGlobe, label: "Du monde" },
    { id: "francaise", icon: faFlag, label: "Française" },
    { id: "sansGluten", icon: faWheatAlt, label: "Sans gluten" },
    { id: "ephemere", icon: faCalendarDay, label: "Éphémère" },
  ];

  const equipments = [
    { id: "rooftop", icon: faUmbrellaBeach, label: "Roof-top" },
    { id: "musique", icon: faMusic, label: "Musique" },
    { id: "enfantsBas", icon: faBaby, label: "Enfants bas-âge" },
  ];

  const handlePreferenceClick = (category, value) => {
    const currentPreferences = formData.restaurantPreferences[category] || [];
    const updatedPreferences = currentPreferences.includes(value)
      ? currentPreferences.filter((item) => item !== value)
      : [...currentPreferences, value];

    handleInputChange("restaurantPreferences", {
      ...formData.restaurantPreferences,
      [category]: updatedPreferences,
    });
  };

  return (
    <div className={styles["search-step"]}>
      <div className={styles["progress-indicator"]}>
        Étape {currentStep} sur {totalSteps}
      </div>
      <h2 className={styles["step-title"]}>Préférences Restaurants</h2>

      <div className={styles["preferences-section"]}>
        <h3 className={styles["section-title"]}>Type de cuisine</h3>
        <div className={styles["preferences-options"]}>
          {cuisineTypes.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => handlePreferenceClick("cuisineTypes", id)}
              className={`${styles["preference-button"]} ${
                formData.restaurantPreferences.cuisineTypes?.includes(id)
                  ? styles["selected"]
                  : ""
              }`}
            >
              <FontAwesomeIcon
                icon={icon}
                className={styles["preference-icon"]}
              />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles["preferences-section"]}>
        <h3 className={styles["section-title"]}>Équipements</h3>
        <div className={styles["preferences-options"]}>
          {equipments.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => handlePreferenceClick("equipments", id)}
              className={`${styles["preference-button"]} ${
                formData.restaurantPreferences.equipments?.includes(id)
                  ? styles["selected"]
                  : ""
              }`}
            >
              <FontAwesomeIcon
                icon={icon}
                className={styles["preference-icon"]}
              />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles["navigation-buttons"]}>
        <button className={styles["nav-button"]} onClick={prevStep}>
          Précédent
        </button>
        <button className={styles["nav-button"]} onClick={nextStep}>
          Suivant
        </button>
      </div>
    </div>
  );
};

export default RestaurantPreferences;
