import React, { useCallback, useState, useEffect, useMemo } from "react";
import styles from "./ComposeTrip.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCalendarAlt,
  faWallet,
  faHotel,
  faUtensils,
  faRunning,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ComposeTrip = React.memo(
  ({
    formData,
    handleInputChange,
    nextStep,
    prevStep,
    currentStep,
    totalSteps,
    isGroupSearch,
    userRole,
    searchId,
    userId,
  }) => {
    const [localBudget, setLocalBudget] = useState(formData.budget || "");
    const [error, setError] = useState("");
    const [selectedOptions, setSelectedOptions] = useState(
      formData.selectedOptions || {
        hotels: false,
        restaurants: false,
        activities: false,
      },
    );

    useEffect(() => {
      setLocalBudget(formData.budget || "");
      setSelectedOptions(
        formData.selectedOptions || {
          hotels: false,
          restaurants: false,
          activities: false,
        },
      );
    }, [formData.budget, formData.selectedOptions]);

    const handleDateChange = useCallback(
      (dates) => {
        const [start, end] = dates;
        handleInputChange({ target: { name: "dates", value: { start, end } } });
      },
      [handleInputChange],
    );

    const handleBudgetChange = useCallback(
      (e) => {
        const value = e.target.value;
        setLocalBudget(value);
        handleInputChange({
          target: { name: "budget", value: value === "" ? null : value },
        });
      },
      [handleInputChange],
    );

    const handleAccessibilityChange = useCallback(
      (e) => {
        handleInputChange({
          target: {
            name: "AccommodationPreferences.accessibility",
            value: e.target.checked,
          },
        });
        handleInputChange({
          target: {
            name: "ActivityPreferences.accessibility",
            value: e.target.checked,
          },
        });
        handleInputChange({
          target: {
            name: "RestaurantPreferences.accessibility",
            value: e.target.checked,
          },
        });
      },
      [handleInputChange],
    );

    const handleOptionChange = useCallback(
      (option) => {
        setSelectedOptions((prev) => {
          const newOptions = { ...prev, [option]: !prev[option] };
          handleInputChange({
            target: { name: "selectedOptions", value: newOptions },
          });
          return newOptions;
        });
      },
      [handleInputChange],
    );

    const handleNext = useCallback(
      (e) => {
        e.preventDefault();
        if (!formData.dates.start || !formData.dates.end) {
          setError("Veuillez sélectionner les dates de début et de fin.");
          return;
        }
        if (!formData.budget) {
          setError("Veuillez entrer un budget.");
          return;
        }
        if (
          !selectedOptions.hotels &&
          !selectedOptions.restaurants &&
          !selectedOptions.activities
        ) {
          setError(
            "Veuillez sélectionner au moins une option (hôtels, restaurants ou activités).",
          );
          return;
        }
        setError("");
        nextStep();
      },
      [formData, nextStep, selectedOptions],
    );

    const handlePrev = useCallback(
      (e) => {
        e.preventDefault();
        prevStep();
      },
      [prevStep],
    );

    const isAccessibilityChecked = useMemo(
      () =>
        formData.AccommodationPreferences.accessibility &&
        formData.ActivityPreferences.accessibility &&
        formData.RestaurantPreferences.accessibility,
      [
        formData.AccommodationPreferences.accessibility,
        formData.ActivityPreferences.accessibility,
        formData.RestaurantPreferences.accessibility,
      ],
    );

    if (isGroupSearch && userRole !== "creator") {
      return (
        <div className={styles["search-step"]}>
          <div className={styles["progress-indicator"]}>
            Étape {currentStep} sur {totalSteps}
          </div>
          <h2 className={styles["step-title"]}>
            <FontAwesomeIcon icon={faUsers} /> Détails du séjour de groupe
          </h2>
          <div className={styles["group-trip-details"]}>
            <p>
              <FontAwesomeIcon icon={faCalendarAlt} /> Dates du séjour :
              {formData.dates.start && formData.dates.end
                ? ` Du ${formData.dates.start.toLocaleDateString()} au ${formData.dates.end.toLocaleDateString()}`
                : " Non définies"}
            </p>
            <p>
              <FontAwesomeIcon icon={faWallet} /> Budget par personne :{" "}
              {formData.budget ? `${formData.budget}€` : "Non défini"}
            </p>
            <p>
              <FontAwesomeIcon icon={faUsers} /> Accessibilité PMR :
              {isAccessibilityChecked ? "Oui" : "Non"}
            </p>
          </div>
          <div className={styles["next-button-container"]}>
            <button
              type="button"
              className={styles["next-button"]}
              onClick={handleNext}
            >
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
          <FontAwesomeIcon icon={faUsers} />{" "}
          {isGroupSearch ? "Compose le séjour de groupe" : "Compose ton séjour"}
        </h2>
        <div className={styles["date-selector"]}>
          <label>
            <FontAwesomeIcon icon={faCalendarAlt} /> Dates du séjour
          </label>
          <div className={styles["date-picker-container"]}>
            <DatePicker
              selected={formData.dates.start}
              onChange={(date) => handleDateChange([date, formData.dates.end])}
              selectsStart
              startDate={formData.dates.start}
              endDate={formData.dates.end}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              placeholderText="Date de début"
              className={styles["date-picker"]}
            />
            <DatePicker
              selected={formData.dates.end}
              onChange={(date) =>
                handleDateChange([formData.dates.start, date])
              }
              selectsEnd
              startDate={formData.dates.start}
              endDate={formData.dates.end}
              minDate={formData.dates.start}
              dateFormat="dd/MM/yyyy"
              placeholderText="Date de fin"
              className={styles["date-picker"]}
            />
          </div>
        </div>
        <div className={styles["selected-dates"]}>
          {formData.dates.start ? (
            <p>
              Du {formData.dates.start.toLocaleDateString()}
              {formData.dates.end
                ? ` au ${formData.dates.end.toLocaleDateString()}`
                : ""}
            </p>
          ) : (
            <p>Sélectionnez vos dates de séjour</p>
          )}
        </div>
        <div className={styles["budget-selector"]}>
          <label htmlFor="budget">
            <FontAwesomeIcon icon={faWallet} /> Budget par personne
          </label>
          <input
            id="budget"
            type="number"
            value={localBudget}
            onChange={handleBudgetChange}
            min="0"
            placeholder="Entrez votre budget"
            required
          />
        </div>
        <div className={styles["accessibility-selector"]}>
          <label>
            <input
              type="checkbox"
              checked={isAccessibilityChecked}
              onChange={handleAccessibilityChange}
            />
            <FontAwesomeIcon icon={faUsers} /> Accessibilité PMR requise
          </label>
        </div>
        <div
          className={styles["trip-type-options"]}
          role="group"
          aria-label="Sélection des options de voyage"
        >
          <button
            onClick={() => handleOptionChange("hotels")}
            className={`${styles["trip-type-button"]} ${selectedOptions.hotels ? styles["selected"] : ""}`}
            aria-pressed={selectedOptions.hotels}
          >
            <FontAwesomeIcon
              icon={faHotel}
              className={styles["trip-type-icon"]}
              aria-hidden="true"
            />
            <span>Hôtels</span>
          </button>
          <button
            onClick={() => handleOptionChange("restaurants")}
            className={`${styles["trip-type-button"]} ${selectedOptions.restaurants ? styles["selected"] : ""}`}
            aria-pressed={selectedOptions.restaurants}
          >
            <FontAwesomeIcon
              icon={faUtensils}
              className={styles["trip-type-icon"]}
              aria-hidden="true"
            />
            <span>Restaurants</span>
          </button>
          <button
            onClick={() => handleOptionChange("activities")}
            className={`${styles["trip-type-button"]} ${selectedOptions.activities ? styles["selected"] : ""}`}
            aria-pressed={selectedOptions.activities}
          >
            <FontAwesomeIcon
              icon={faRunning}
              className={styles["trip-type-icon"]}
              aria-hidden="true"
            />
            <span>Activités</span>
          </button>
        </div>
        {error && <p className={styles["error-message"]}>{error}</p>}
        <div className={styles["next-button-container"]}>
          <button
            type="button"
            className={styles["prev-button"]}
            onClick={handlePrev}
          >
            Précédent
          </button>
          <button
            type="button"
            className={styles["next-button"]}
            onClick={handleNext}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  },
);

export default ComposeTrip;
