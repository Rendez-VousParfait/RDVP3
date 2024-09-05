import React, { useCallback, useMemo, useState, useEffect } from "react";
import styles from "./ComposeTrip.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBed,
  faUtensils,
  faRunning,
  faCalendarAlt,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ComposeTrip = React.memo(({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
}) => {
  const [localBudget, setLocalBudget] = useState(formData.budget || "");

  useEffect(() => {
    setLocalBudget(formData.budget || "");
  }, [formData.budget]);

  const handleDateChange = useCallback((dates) => {
    const [start, end] = dates;
    handleInputChange("dates", { start, end });
  }, [handleInputChange]);

  const toggleService = useCallback((service) => {
    handleInputChange("mainServices", (prevServices) => {
      if (prevServices.includes(service)) {
        return prevServices.filter((s) => s !== service);
      } else {
        return [...prevServices, service];
      }
    });
  }, [handleInputChange]);

  const handleBudgetChange = useCallback((e) => {
    const value = e.target.value;
    setLocalBudget(value);
    handleInputChange("budget", value === "" ? null : value);
  }, [handleInputChange]);

  const handleNext = useCallback((e) => {
    e.preventDefault();
    nextStep();
  }, [nextStep]);

  const handlePrev = useCallback((e) => {
    e.preventDefault();
    prevStep();
  }, [prevStep]);

  const services = useMemo(() => [
    { id: "hébergement", icon: faBed, label: "Hébergement" },
    { id: "repas", icon: faUtensils, label: "Repas" },
    { id: "activité", icon: faRunning, label: "Activité" },
  ], []);

  return (
    <div className={styles["search-step"]}>
      <div className={styles["progress-indicator"]}>
        Étape {currentStep} sur {totalSteps}
      </div>
      <h2 className={styles["step-title"]}>
        <FontAwesomeIcon icon={faUsers} /> Compose ton séjour
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
            onChange={(date) => handleDateChange([formData.dates.start, date])}
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
            {formData.dates.end ? ` au ${formData.dates.end.toLocaleDateString()}` : ''}
          </p>
        ) : (
          <p>Sélectionnez vos dates de séjour</p>
        )}
      </div>
      <div className={styles["service-selector"]}>
        {services.map(({ id, icon, label }) => (
          <button
            key={id}
            type="button"
            className={`${styles["service-button"]} ${
              formData.mainServices.includes(id) ? styles["selected"] : ""
            }`}
            onClick={() => toggleService(id)}
          >
            <FontAwesomeIcon icon={icon} className={styles["service-icon"]} />
            <span>{label}</span>
          </button>
        ))}
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
      <div className={styles["next-button-container"]}>
        <button type="button" className={styles["prev-button"]} onClick={handlePrev}>
          Précédent
        </button>
        <button type="button" className={styles["next-button"]} onClick={handleNext}>
          Suivant
        </button>
      </div>
    </div>
  );
});

export default ComposeTrip;