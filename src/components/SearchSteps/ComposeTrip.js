import React, { useState } from "react";
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

const ComposeTrip = ({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
}) => {
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    handleInputChange("tripStartDate", start);
    handleInputChange("tripEndDate", end);
  };

  const toggleService = (service) => {
    const updatedServices = formData.mainServices.includes(service)
      ? formData.mainServices.filter((s) => s !== service)
      : [...formData.mainServices, service];
    handleInputChange("mainServices", updatedServices);
  };

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
        <DatePicker
          selected={formData.tripStartDate}
          onChange={handleDateChange}
          startDate={formData.tripStartDate}
          endDate={formData.tripEndDate}
          selectsRange
          inline
          minDate={new Date()}
          dateFormat="dd/MM/yyyy"
          calendarClassName={styles["datepicker-calendar"]}
        />
      </div>
      <div className={styles["selected-dates"]}>
        {formData.tripStartDate && formData.tripEndDate ? (
          <p>
            Du {formData.tripStartDate.toLocaleDateString()} au{" "}
            {formData.tripEndDate.toLocaleDateString()}
          </p>
        ) : (
          <p>Sélectionnez vos dates de séjour</p>
        )}
      </div>
      <div className={styles["service-selector"]}>
        {[
          { id: "hébergement", icon: faBed, label: "Hébergement" },
          { id: "repas", icon: faUtensils, label: "Repas" },
          { id: "activité", icon: faRunning, label: "Activité" },
        ].map(({ id, icon, label }) => (
          <button
            key={id}
            className={`${styles["service-button"]} ${formData.mainServices.includes(id) ? styles["selected"] : ""}`}
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
          value={formData.budget || ""}
          onChange={(e) => handleInputChange("budget", e.target.value)}
          min="0"
          required
        />
      </div>
      <div className={styles["next-button-container"]}>
        <button className={styles["prev-button"]} onClick={prevStep}>
          Précédent
        </button>
        <button className={styles["next-button"]} onClick={nextStep}>
          Suivant
        </button>
      </div>
    </div>
  );
};

export default ComposeTrip;
