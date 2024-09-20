import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./ComposeTripType.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faHome,
  faHeart,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";

const ComposeTripType = React.memo(
  ({
    formData,
    handleInputChange,
    nextStep,
    currentStep,
    totalSteps,
    isGroupSearch,
    userRole,
    saveGroupMemberPreferences,
  }) => {
    const tripTypes = useMemo(
      () => [
        { id: "amis", icon: faUsers, label: "Amis" },
        { id: "famille", icon: faHome, label: "Famille" },
        { id: "couple", icon: faHeart, label: "Couple" },
        { id: "solo", icon: faUserAlt, label: "Solo" },
      ],
      [],
    );

    const [showPersonCount, setShowPersonCount] = useState(false);
    const [showGroupCreation, setShowGroupCreation] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      setShowPersonCount(
        formData.tripType !== "solo" && formData.tripType !== "",
      );
      setShowGroupCreation(
        !isGroupSearch && ["amis", "famille"].includes(formData.tripType),
      );

      if (formData.tripType === "couple") {
        handleInputChange({ target: { name: "personCount", value: 2 } });
      } else if (["amis", "famille"].includes(formData.tripType)) {
        handleInputChange({
          target: {
            name: "personCount",
            value: formData.invitedUsers.length + 1,
          },
        });
      } else if (formData.tripType === "solo") {
        handleInputChange({ target: { name: "personCount", value: 1 } });
      }

      // Initialiser les préférences en fonction du type de voyage
      if (formData.tripType) {
        handleInputChange({
          target: {
            name: "AccommodationPreferences",
            value: {
              accomodation_type: [],
              standing: [],
              environment: [],
              equipments1: [],
              equipments2: [],
              equipments3: [],
              style: [],
              restauration_option: [],
              price: null,
            },
          },
        });
        handleInputChange({
          target: {
            name: "ActivityPreferences",
            value: {
              accessibility: false,
              cadre: [],
              ambiance: [],
              duration: "",
              budget: null,
              type: [],
            },
          },
        });
        handleInputChange({
          target: {
            name: "RestaurantPreferences",
            value: {
              accessibility: false,
              ambiances: [],
              budget: "",
              cuisinetype: [],
              services: [],
            },
          },
        });
      }
    }, [
      formData.tripType,
      formData.invitedUsers,
      isGroupSearch,
      handleInputChange,
    ]);

    const handleTripTypeClick = useCallback(
      (type) => {
        handleInputChange({ target: { name: "tripType", value: type } });
      },
      [handleInputChange],
    );

    const handlePersonCountChange = useCallback(
      (e) => {
        const count = parseInt(e.target.value, 10);
        if (count > 0) {
          handleInputChange({ target: { name: "personCount", value: count } });
          setError("");
        } else {
          setError("Le nombre de personnes doit être supérieur à 0");
        }
      },
      [handleInputChange],
    );

    const handleInvitedUsersChange = useCallback(
      (e) => {
        const emails = e.target.value.split(",").map((email) => email.trim());
        const validEmails = emails.filter((email) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        );
        handleInputChange({
          target: { name: "invitedUsers", value: validEmails },
        });
        if (validEmails.length !== emails.length) {
          setError("Certains emails ne sont pas valides");
        } else {
          setError("");
        }
      },
      [handleInputChange],
    );

    const handleNext = useCallback(() => {
      if (isGroupSearch) {
        saveGroupMemberPreferences();
      }
      nextStep();
    }, [nextStep, isGroupSearch, saveGroupMemberPreferences]);

    if (isGroupSearch && userRole !== "creator") {
      return (
        <div className={styles["search-step"]}>
          <div className={styles["progress-indicator"]}>
            Étape {currentStep} sur {totalSteps}
          </div>
          <h2 className={styles["step-title"]}>Détails du voyage de groupe</h2>
          <p>Type de voyage : {formData.tripType}</p>
          <p>Nombre de personnes : {formData.personCount}</p>
          <button className={styles["next-button"]} onClick={nextStep}>
            Suivant
          </button>
        </div>
      );
    }

    return (
      <div className={styles["search-step"]}>
        <div className={styles["progress-indicator"]}>
          Étape {currentStep} sur {totalSteps}
        </div>
        <h2 className={styles["step-title"]}>Vous êtes :</h2>
        <div
          className={styles["trip-type-options"]}
          role="group"
          aria-label="Sélection du type de voyage"
        >
          {tripTypes.map(
            ({ id, icon, label }) =>
              (!isGroupSearch || id !== "solo") && (
                <button
                  key={id}
                  onClick={() => handleTripTypeClick(id)}
                  className={`${styles["trip-type-button"]} ${formData.tripType === id ? styles["selected"] : ""}`}
                  aria-pressed={formData.tripType === id}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    className={styles["trip-type-icon"]}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </button>
              ),
          )}
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
              aria-invalid={error !== ""}
            />
          </div>
        )}
        {error && (
          <p className={styles["error-message"]} role="alert">
            {error}
          </p>
        )}
        <div className={styles["next-button-container"]}>
          <button
            className={styles["next-button"]}
            onClick={handleNext}
            disabled={
              !formData.tripType ||
              (showPersonCount && !formData.personCount) ||
              error !== ""
            }
          >
            Suivant
          </button>
        </div>
      </div>
    );
  },
);

export default ComposeTripType;
