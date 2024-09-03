import React, { useState, useEffect } from "react";
import styles from "./PersonalizeAdvanced.module.css";
import "../../style/buttons.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faHeart } from "@fortawesome/free-solid-svg-icons";

const PersonalizeAdvanced = ({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
}) => {
  const [personalizationType, setPersonalizationType] = useState(
    formData.personalizationType || "",
  );
  const [selectedActivities, setSelectedActivities] = useState(
    formData.activities || [],
  );
  const [accessibility, setAccessibility] = useState(
    formData.accessibility || "",
  );

  const activities = [
    "Concerts",
    "Randonnées",
    "Cinéma",
    "Sport",
    "Loisirs créatifs",
  ];
  const ambiances = [
    "Romantique",
    "Aventure",
    "Détente",
    "Culturelle",
    "Festive",
  ];

  useEffect(() => {
    handleInputChange("personalizationType", personalizationType);
    handleInputChange("activities", selectedActivities);
    handleInputChange("accessibility", accessibility);
  }, [personalizationType, selectedActivities, accessibility]);

  const toggleSelection = (item, selectionType) => {
    if (selectionType === "activities") {
      setSelectedActivities((prev) =>
        prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item],
      );
    } else if (selectionType === "ambiances") {
      setSelectedActivities([item]);
    }
  };

  return (
    <div className={styles["search-step"]}>
      <h2>
        <FontAwesomeIcon icon={faLightbulb} />
        Personnalise ton séjour
      </h2>
      <div className={styles["personalization-type"]}>
        <button
          className={`custom-button ${personalizationType === "ambiance" ? "selected" : ""}`}
          onClick={() => setPersonalizationType("ambiance")}
        >
          Par ambiance
        </button>
        <button
          className={`custom-button ${personalizationType === "preferences" ? "selected" : ""}`}
          onClick={() => setPersonalizationType("preferences")}
        >
          Par préférences
        </button>
      </div>
      {personalizationType === "ambiance" && (
        <div className={styles["ambiance-options"]}>
          {ambiances.map((ambiance) => (
            <button
              key={ambiance}
              className={`custom-button ${selectedActivities.includes(ambiance) ? "selected" : ""}`}
              onClick={() => toggleSelection(ambiance, "ambiances")}
            >
              {ambiance}
            </button>
          ))}
        </div>
      )}
      {personalizationType === "preferences" && (
        <>
          <div className={styles["activity-options"]}>
            {activities.map((activity) => (
              <button
                key={activity}
                className={`custom-button ${selectedActivities.includes(activity) ? "selected" : ""}`}
                onClick={() => toggleSelection(activity, "activities")}
              >
                {activity}
              </button>
            ))}
          </div>
          <div className={styles["accessibility-options"]}>
            <button
              className={`custom-button ${accessibility === "car" ? "selected" : ""}`}
              onClick={() => setAccessibility("car")}
            >
              En voiture
            </button>
            <button
              className={`custom-button ${accessibility === "publicTransport" ? "selected" : ""}`}
              onClick={() => setAccessibility("publicTransport")}
            >
              Transports en commun
            </button>
          </div>
        </>
      )}
      <div className={styles["buttons"]}>
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

export default PersonalizeAdvanced;
