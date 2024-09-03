import React from "react";
import styles from "./RestaurantPreferences.module.css";

const RestaurantPreferences = ({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
}) => {
  const cuisineTypes = ["Du monde", "Française", "Sans gluten", "Éphémère"];
  const equipments = ["Roof-top", "Musique", "Enfants bas-âge"];

  const handleCheckboxChange = (category, value) => {
    const isSelected =
      formData.restaurantPreferences[category]?.includes(value);
    const updatedValues = isSelected
      ? formData.restaurantPreferences[category].filter(
          (item) => item !== value,
        )
      : [...(formData.restaurantPreferences[category] || []), value];

    handleInputChange("restaurantPreferences", {
      ...formData.restaurantPreferences,
      [category]: updatedValues,
    });
  };

  return (
    <div className={styles.searchStep}>
      <h2 className={styles.title}>Préférences Restaurants</h2>
      <div className={styles.cuisineTypes}>
        <h3 className={styles.sectionTitle}>Type de cuisine</h3>
        {cuisineTypes.map((type) => (
          <label key={type} className={styles.label}>
            <input
              type="checkbox"
              checked={formData.restaurantPreferences.cuisineTypes?.includes(
                type,
              )}
              onChange={() => handleCheckboxChange("cuisineTypes", type)}
              className={styles.checkbox}
            />
            {type}
          </label>
        ))}
      </div>
      <div className={styles.equipments}>
        <h3 className={styles.sectionTitle}>Équipements</h3>
        {equipments.map((equipment) => (
          <label key={equipment} className={styles.label}>
            <input
              type="checkbox"
              checked={formData.restaurantPreferences.equipments?.includes(
                equipment,
              )}
              onChange={() => handleCheckboxChange("equipments", equipment)}
              className={styles.checkbox}
            />
            {equipment}
          </label>
        ))}
      </div>
      <div className={styles.buttons}>
        <button className="custom-button button-nav" onClick={prevStep}>
          Précédent
        </button>
        <button className="custom-button button-nav" onClick={nextStep}>
          Suivant
        </button>
      </div>
    </div>
  );
};

export default RestaurantPreferences;
