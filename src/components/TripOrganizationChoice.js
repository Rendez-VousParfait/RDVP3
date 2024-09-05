import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserPlus, faUserCog } from "@fortawesome/free-solid-svg-icons";
import styles from "./TripOrganizationChoice.module.css";

const TripOrganizationChoice = ({ nextStep, currentStep, totalSteps }) => {
  const navigate = useNavigate();

  const handleChoice = (choice) => {
    switch (choice) {
      case "create":
      case "join":
        navigate("/groups");
        break;
      case "personalize":
        nextStep();
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles["search-step"]}>
      <div className={styles["progress-indicator"]}>
        Étape {currentStep} sur {totalSteps}
      </div>
      <h2 className={styles["step-title"]}>Organisez votre voyage</h2>
      <div className={styles["choice-container"]}>
        <button
          className={styles["choice-button"]}
          onClick={() => handleChoice("create")}
        >
          <FontAwesomeIcon icon={faUsers} className={styles["choice-icon"]} />
          <span>Créer un Groupe</span>
        </button>
        <button
          className={styles["choice-button"]}
          onClick={() => handleChoice("join")}
        >
          <FontAwesomeIcon icon={faUserPlus} className={styles["choice-icon"]} />
          <span>Rejoindre un Groupe</span>
        </button>
        <button
          className={styles["choice-button"]}
          onClick={() => handleChoice("personalize")}
        >
          <FontAwesomeIcon icon={faUserCog} className={styles["choice-icon"]} />
          <span>Personnaliser moi-même</span>
        </button>
      </div>
    </div>
  );
};

export default TripOrganizationChoice;