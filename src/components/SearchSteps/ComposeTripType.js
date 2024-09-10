import React, { useState, useEffect } from "react";
import styles from "./ComposeTripType.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faHome, faHeart, faUserAlt } from "@fortawesome/free-solid-svg-icons";

const ComposeTripType = ({
  formData,
  handleInputChange,
  nextStep,
  currentStep,
  totalSteps,
  isGroupSearch,
  userRole,
}) => {
  const tripTypes = [
    { id: "amis", icon: faUsers, label: "Amis" },
    { id: "famille", icon: faHome, label: "Famille" },
    { id: "couple", icon: faHeart, label: "Couple" },
    { id: "solo", icon: faUserAlt, label: "Solo" },
  ];
  const [showPersonCount, setShowPersonCount] = useState(false);

  useEffect(() => {
    setShowPersonCount(
      formData.tripType !== "solo" && formData.tripType !== "",
    );
  }, [formData.tripType]);

  const handleTripTypeClick = (type) => {
    handleInputChange("tripType", type);
    handleInputChange("personCount", "");
    handleInputChange("needsGroupCreation", type !== "solo");
  };

  const handlePersonCountChange = (e) => {
    handleInputChange("personCount", e.target.value);
  };

  const handleNext = () => {
    if (formData.tripType !== "solo") {
      handleInputChange("needsGroupCreation", true);
    }
    nextStep();
  };

  // Si c'est une recherche de groupe et que l'utilisateur n'est pas le créateur, on affiche juste les informations
  if (isGroupSearch && userRole !== 'creator') {
    return (
      <div className={styles["search-step"]}>
        <div className={styles["progress-indicator"]}>
          Étape {currentStep} sur {totalSteps}
        </div>
        <h2 className={styles["step-title"]}>Détails du voyage de groupe</h2>
        <p>Type de voyage : {formData.tripType}</p>
        <p>Nombre de personnes : {formData.personCount}</p>
        <div className={styles["next-button-container"]}>
          <button className={styles["next-button"]} onClick={nextStep}>
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
      <h2 className={styles["step-title"]}>Vous êtes :</h2>
      <div className={styles["trip-type-options"]}>
        {tripTypes.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => handleTripTypeClick(id)}
            className={`${styles["trip-type-button"]} ${formData.tripType === id ? styles["selected"] : ""}`}
          >
            <FontAwesomeIcon icon={icon} className={styles["trip-type-icon"]} />
            <span>{label}</span>
          </button>
        ))}
      </div>
      {showPersonCount && (
        <div className={styles["person-count-container"]}>
          <label htmlFor="personCount">Nombre de personnes :</label>
          <input
            type="number"
            id="personCount"
            value={formData.personCount || ""}
            onChange={handlePersonCountChange}
            min="1"
            required
          />
        </div>
      )}
      <div className={styles["next-button-container"]}>
        <button
          className={styles["next-button"]}
          onClick={handleNext}
          disabled={
            !formData.tripType || (showPersonCount && !formData.personCount)
          }
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default ComposeTripType;