import React, { useState } from "react";
import styles from "./ComposeTrip.module.css";
import "../../style/buttons.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../style/datepicker-custom.css";

const ComposeTrip = ({ formData, handleInputChange, nextStep, prevStep }) => {
  const [selectedActivities, setSelectedActivities] = useState(
    formData.activities || [],
  );

  const toggleActivity = (activity) => {
    setSelectedActivities((prevActivities) => {
      if (prevActivities.includes(activity)) {
        return prevActivities.filter((a) => a !== activity);
      } else {
        return [...prevActivities, activity];
      }
    });
  };

  const handleActivityChange = () => {
    handleInputChange("activities", selectedActivities);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    handleInputChange("tripStartDate", start);
    handleInputChange("tripEndDate", end);
  };

  return (
    <div className={styles["search-step"]}>
      <h2>
        <FontAwesomeIcon icon={faUsers} />
        Compose ton séjour
      </h2>
      <div className={styles["date-selector"]}>
        <label>Dates du séjour</label>
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
      <div className={styles["activity-selector"]}>
        {["activité", "repas", "hébergement"].map((activity) => (
          <button
            key={activity}
            className={`custom-button ${selectedActivities.includes(activity) ? "selected" : ""}`}
            onClick={() => {
              toggleActivity(activity);
              handleActivityChange();
            }}
          >
            {activity.charAt(0).toUpperCase() + activity.slice(1)}
          </button>
        ))}
      </div>
      <div className={styles["budget-selector"]}>
        <label htmlFor="budget">Budget par personne</label>
        <input
          id="budget"
          type="number"
          value={formData.budget || ""}
          onChange={(e) => handleInputChange("budget", e.target.value)}
          min="0"
          required
        />
      </div>
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

export default ComposeTrip;
