import React, { useState, useEffect } from "react";
import styles from "./ComposeTripType.module.css";
import "../../style/buttons.css";

const ComposeTripType = ({ formData, handleInputChange, nextStep }) => {
  const tripTypes = ["amis", "famille", "couple", "solo"];
  const [showPersonCount, setShowPersonCount] = useState(false);

  useEffect(() => {
    setShowPersonCount(
      formData.tripType !== "solo" && formData.tripType !== "",
    );
  }, [formData.tripType]);

  const handleTripTypeClick = (type) => {
    handleInputChange("tripType", type);
    handleInputChange("personCount", ""); // Reset person count when changing trip type
    handleInputChange("needsGroupCreation", type !== "solo"); // Set needsGroupCreation based on trip type
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
      <h2>Vous êtes :</h2>
      <div className={styles["trip-type-options"]}>
        {tripTypes.map((type) => (
          <button
            key={type}
            onClick={() => handleTripTypeClick(type)}
            className={`custom-button ${formData.tripType === type ? "selected" : ""}`}
          >
            <i className={`icon-${type}`}></i>
            {type.charAt(0).toUpperCase() + type.slice(1)}
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
          className="custom-button button-nav"
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
