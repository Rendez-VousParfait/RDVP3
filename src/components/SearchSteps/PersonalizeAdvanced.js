import React, { useState, useEffect } from "react";
import styles from "./PersonalizeAdvanced.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faRunning, faCar, faBus, faUtensils, faHotel, faUser } from "@fortawesome/free-solid-svg-icons";

const PersonalizeAdvanced = ({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
  isGroupSearch,
  userRole,
}) => {
  const [personalizationType, setPersonalizationType] = useState(
    formData.personalizationType || "ambiance"
  );

  const ambiances = [
    "Romantique",
    "Aventure",
    "Détente",
    "Culturelle",
    "Festive",
  ];

  useEffect(() => {
    if (!isGroupSearch || userRole === 'creator') {
      handleInputChange("personalizationType", personalizationType);
    }
  }, [personalizationType, handleInputChange, isGroupSearch, userRole]);

  const toggleSelection = (item, selectionType) => {
    if (isGroupSearch && userRole !== 'creator') return;

    if (selectionType === "activities") {
      handleInputChange("ActivityPreferences.type", prevTypes => {
        const updatedTypes = prevTypes?.includes(item)
          ? prevTypes.filter(a => a !== item)
          : [...(prevTypes || []), item];
        return updatedTypes;
      });
    } else if (selectionType === "ambiances") {
      handleInputChange("AccommodationPreferences.ambiance", item);
      handleInputChange("ActivityPreferences.ambiance", [item]);
      handleInputChange("RestaurantPreferences.ambiances", [item]);
    }
  };

  if (isGroupSearch && userRole !== 'creator') {
    return (
      <div className={styles["search-step"]}>
        <div className={styles["progress-indicator"]}>
          Étape {currentStep} sur {totalSteps}
        </div>
        <h2 className={styles["step-title"]}>Personnalisation du séjour de groupe</h2>
        <div className={styles["group-preferences-summary"]}>
          <h3>Type de personnalisation : {formData.personalizationType}</h3>
          {formData.personalizationType === "ambiance" && (
            <>
              <h4>Ambiance sélectionnée :</h4>
              <p>{formData.AccommodationPreferences.ambiance}</p>
            </>
          )}
          {formData.personalizationType === "preferences" && (
            <>
              <h4>Activités sélectionnées :</h4>
              <ul>
                {formData.ActivityPreferences.type?.map(activity => (
                  <li key={activity}>{activity}</li>
                ))}
              </ul>
              <p>Accessibilité : {formData.ActivityPreferences.accessibility ? "Accès PMR requis" : "Pas de besoin spécifique"}</p>
            </>
          )}
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
  }

  return (
    <div className={styles["search-step"]}>
      <div className={styles["progress-indicator"]}>
        Étape {currentStep} sur {totalSteps}
      </div>
      <h2 className={styles["step-title"]}>
        {isGroupSearch ? "Personnalise le séjour de groupe" : "Personnalise ton séjour"}
      </h2>

      <div className={styles["personalization-type"]}>
        <button
          className={`${styles["type-button"]} ${personalizationType === "ambiance" ? styles["selected"] : ""}`}
          onClick={() => setPersonalizationType("ambiance")}
        >
          Par ambiance
        </button>
        <button
          className={`${styles["type-button"]} ${personalizationType === "preferences" ? styles["selected"] : ""}`}
          onClick={() => setPersonalizationType("preferences")}
        >
          Par préférences
        </button>
      </div>

      {personalizationType === "ambiance" && (
        <div className={styles["option-section"]}>
          <h3><FontAwesomeIcon icon={faHeart} /> Ambiance</h3>
          <div className={styles["option-buttons"]}>
            {ambiances.map((ambiance) => (
              <button
                key={ambiance}
                className={`${styles["option-button"]} ${formData.AccommodationPreferences.ambiance === ambiance ? styles["selected"] : ""}`}
                onClick={() => toggleSelection(ambiance, "ambiances")}
              >
                {ambiance}
              </button>
            ))}
          </div>
        </div>
      )}

      {personalizationType === "preferences" && (
        <>
          <div className={styles["option-section"]}>
            <h3><FontAwesomeIcon icon={faRunning} /> Activités</h3>
            <div className={styles["option-buttons"]}>
              {formData.ActivityPreferences.type?.map((activity) => (
                <button
                  key={activity}
                  className={`${styles["option-button"]} ${formData.ActivityPreferences.type?.includes(activity) ? styles["selected"] : ""}`}
                  onClick={() => toggleSelection(activity, "activities")}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>
          <div className={styles["option-section"]}>
            <h3>Accessibilité</h3>
            <div className={styles["option-buttons"]}>
              <button
                className={`${styles["option-button"]} ${formData.ActivityPreferences.accessibility ? styles["selected"] : ""}`}
                onClick={() => handleInputChange("ActivityPreferences.accessibility", !formData.ActivityPreferences.accessibility)}
              >
                <FontAwesomeIcon icon={faCar} /> Accès PMR requis
              </button>
            </div>
          </div>
        </>
      )}

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

export default React.memo(PersonalizeAdvanced);