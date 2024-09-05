import React, { useState, useEffect } from "react";
import styles from "./PersonalizeAdvanced.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faRunning, faCar, faBus } from "@fortawesome/free-solid-svg-icons";

const PersonalizeAdvanced = ({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
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
  const activities = [
    "Concerts",
    "Randonnées",
    "Cinéma",
    "Sport",
    "Loisirs créatifs",
  ];

  useEffect(() => {
    handleInputChange("personalizationType", personalizationType);
  }, [personalizationType, handleInputChange]);

  const toggleSelection = (item, selectionType) => {
    if (selectionType === "activities") {
      const updatedActivities = formData.activities?.includes(item)
        ? formData.activities.filter(a => a !== item)
        : [...(formData.activities || []), item];
      handleInputChange("activities", updatedActivities);
    } else if (selectionType === "ambiances") {
      handleInputChange("ambiance", item);
    }
  };

  return (
    <div className={styles["search-step"]}>
      <div className={styles["progress-indicator"]}>
        Étape {currentStep} sur {totalSteps}
      </div>
      <h2 className={styles["step-title"]}>Personnalise ton séjour</h2>

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
                className={`${styles["option-button"]} ${formData.ambiance === ambiance ? styles["selected"] : ""}`}
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
              {activities.map((activity) => (
                <button
                  key={activity}
                  className={`${styles["option-button"]} ${formData.activities?.includes(activity) ? styles["selected"] : ""}`}
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
                className={`${styles["option-button"]} ${formData.accessibility === "car" ? styles["selected"] : ""}`}
                onClick={() => handleInputChange("accessibility", "car")}
              >
                <FontAwesomeIcon icon={faCar} /> En voiture
              </button>
              <button
                className={`${styles["option-button"]} ${formData.accessibility === "publicTransport" ? styles["selected"] : ""}`}
                onClick={() => handleInputChange("accessibility", "publicTransport")}
              >
                <FontAwesomeIcon icon={faBus} /> Transports en commun
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

export default PersonalizeAdvanced;