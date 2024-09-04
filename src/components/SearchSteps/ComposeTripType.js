import React, { useState, useEffect } from "react";
import styles from "./ComposeTripType.module.css";
import { FaUsers, FaHome, FaHeart, FaUserAlt } from "react-icons/fa";

const ComposeTripType = ({
  formData,
  handleInputChange,
  nextStep,
  currentStep,
  totalSteps,
}) => {
  const tripTypes = [
    { id: "amis", icon: FaUsers, label: "Amis" },
    { id: "famille", icon: FaHome, label: "Famille" },
    { id: "couple", icon: FaHeart, label: "Couple" },
    { id: "solo", icon: FaUserAlt, label: "Solo" },
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

  return (
    <div className={styles["search-step"]}>
      <div className={styles["progress-indicator"]}>
        Étape {currentStep} sur {totalSteps}
      </div>
      <h2 className={styles["step-title"]}>Vous êtes :</h2>
      <div className={styles["trip-type-options"]}>
        {tripTypes.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => handleTripTypeClick(id)}
            className={`${styles["trip-type-button"]} ${formData.tripType === id ? styles["selected"] : ""}`}
          >
            <Icon className={styles["trip-type-icon"]} />
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
