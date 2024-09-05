import React from "react";
import styles from "./AccommodationPreferences.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faStar, faDoorOpen } from "@fortawesome/free-solid-svg-icons";

const AccommodationPreferences = ({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
}) => {
  const accommodationTypes = ["Hôtel", "Appart Hôtel", "Chambres d'hôtes"];
  const standings = ["Économique", "Standard", "Luxe"];
  const roomTypes = ["Chambre simple", "Chambre double", "Suite"];

  return (
    <div className={styles["search-step"]}>
      <div className={styles["progress-indicator"]}>
        Étape {currentStep} sur {totalSteps}
      </div>
      <h2 className={styles["step-title"]}>Préférences Hébergement</h2>

      <div className={styles["preference-section"]}>
        <h3><FontAwesomeIcon icon={faBed} /> Type d'hébergement</h3>
        <div className={styles["option-buttons"]}>
          {accommodationTypes.map((type) => (
            <button
              key={type}
              className={`${styles["option-button"]} ${formData.accommodationPreferences.types?.includes(type) ? styles["selected"] : ""}`}
              onClick={() => {
                const updatedTypes = formData.accommodationPreferences.types?.includes(type)
                  ? formData.accommodationPreferences.types.filter(t => t !== type)
                  : [...(formData.accommodationPreferences.types || []), type];
                handleInputChange("accommodationPreferences", { ...formData.accommodationPreferences, types: updatedTypes });
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className={styles["preference-section"]}>
        <h3><FontAwesomeIcon icon={faStar} /> Standing</h3>
        <div className={styles["option-buttons"]}>
          {standings.map((standing) => (
            <button
              key={standing}
              className={`${styles["option-button"]} ${formData.accommodationPreferences.standing === standing ? styles["selected"] : ""}`}
              onClick={() => handleInputChange("accommodationPreferences", { ...formData.accommodationPreferences, standing })}
            >
              {standing}
            </button>
          ))}
        </div>
      </div>

      <div className={styles["preference-section"]}>
        <h3><FontAwesomeIcon icon={faDoorOpen} /> Type de chambre</h3>
        <div className={styles["option-buttons"]}>
          {roomTypes.map((type) => (
            <button
              key={type}
              className={`${styles["option-button"]} ${formData.accommodationPreferences.roomType === type ? styles["selected"] : ""}`}
              onClick={() => handleInputChange("accommodationPreferences", { ...formData.accommodationPreferences, roomType: type })}
            >
              {type}
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

export default AccommodationPreferences;