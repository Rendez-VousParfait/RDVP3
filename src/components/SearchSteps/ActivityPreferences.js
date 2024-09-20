import React, { useState, useCallback, useEffect, useMemo } from "react";
import styles from "./ActivityPreferences.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorOpen,
  faTree,
  faStore,
  faSpa,
  faCity,
  faLandmark,
  faWineGlass,
  faHotTub,
  faSnowflake,
  faUsers,
  faHandPointer,
  faRunning,
  faGift,
  faHome,
  faUmbrellaBeach,
  faWineBottle,
  faWater,
  faHeart,
  faGlassCheers,
  faUtensils,
  faClock,
  faEuroSign,
  faWheelchair,
} from "@fortawesome/free-solid-svg-icons";

const ActivityPreferences = React.memo(
  ({
    formData,
    handleInputChange,
    nextStep,
    prevStep,
    currentStep,
    totalSteps,
    isGroupSearch,
    userRole,
  }) => {
    const [error, setError] = useState("");

    useEffect(() => {
      console.log("ActivityPreferences formData:", formData);
    }, [formData]);

    const environments = useMemo(
      () => [
        { id: "Intérieur", icon: faDoorOpen, label: "Intérieur" },
        { id: "Extérieur", icon: faTree, label: "Extérieur" },
      ],
      [],
    );

    const cadres = useMemo(
      () => [
        { id: "Atelier-boutique", icon: faStore, label: "Atelier-boutique" },
        {
          id: "Centre de bien-être",
          icon: faSpa,
          label: "Centre de bien-être",
        },
        { id: "Centre-ville", icon: faCity, label: "Centre-ville" },
        {
          id: "Centre historique",
          icon: faLandmark,
          label: "Centre historique",
        },
        { id: "Vignobles", icon: faWineGlass, label: "Vignobles" },
        { id: "Spa", icon: faHotTub, label: "Spa" },
        {
          id: "Centre de cryothérapie",
          icon: faSnowflake,
          label: "Centre de cryothérapie",
        },
        { id: "Marché de Noël", icon: faGift, label: "Marché de Noël" },
        {
          id: "Salle d'escape game",
          icon: faDoorOpen,
          label: "Salle d'escape game",
        },
        { id: "Village viticole", icon: faHome, label: "Village viticole" },
        { id: "Ville et vignoble", icon: faCity, label: "Ville et vignoble" },
        { id: "Bord de mer", icon: faUmbrellaBeach, label: "Bord de mer" },
        { id: "Cave à vin", icon: faWineBottle, label: "Cave à vin" },
        { id: "Rivière", icon: faWater, label: "Rivière" },
        { id: "Parc", icon: faTree, label: "Parc" },
      ],
      [],
    );

    const ambiances = useMemo(
      () => [
        { id: "Relaxante", icon: faSpa, label: "Relaxante" },
        { id: "Ludique", icon: faGlassCheers, label: "Ludique" },
        { id: "Culturelle", icon: faLandmark, label: "Culturelle" },
        { id: "Aventureuse", icon: faTree, label: "Aventureuse" },
        { id: "Gastronomique", icon: faUtensils, label: "Gastronomique" },
        { id: "Conviviale", icon: faUsers, label: "Conviviale" },
        { id: "Interactive", icon: faHandPointer, label: "Interactive" },
        { id: "Festive", icon: faGlassCheers, label: "Festive" },
        { id: "Romantique", icon: faHeart, label: "Romantique" },
        { id: "Sportive", icon: faRunning, label: "Sportive" },
      ],
      [],
    );

    const durations = useMemo(
      () => [
        { id: "30 minutes", icon: faClock, label: "30 minutes" },
        { id: "1 heure", icon: faClock, label: "1 heure" },
        {
          id: "1 heure et 30 minutes",
          icon: faClock,
          label: "1 heure et 30 minutes",
        },
        { id: "2 heures", icon: faClock, label: "2 heures" },
        {
          id: "2 heures et 30 minutes",
          icon: faClock,
          label: "2 heures et 30 minutes",
        },
        { id: "3 heures", icon: faClock, label: "3 heures" },
        {
          id: "3 heures et 30 minutes",
          icon: faClock,
          label: "3 heures et 30 minutes",
        },
        { id: "4 heures", icon: faClock, label: "4 heures" },
        {
          id: "4 heures et 30 minutes",
          icon: faClock,
          label: "4 heures et 30 minutes",
        },
        { id: "5 heures", icon: faClock, label: "5 heures" },
        {
          id: "8 heures et 30 minutes",
          icon: faClock,
          label: "8 heures et 30 minutes",
        },
      ],
      [],
    );

    const handlePreferenceClick = useCallback(
      (category, value) => {
        if (isGroupSearch && userRole !== "creator") return;
        handleInputChange({
          target: {
            name: "ActivityPreferences",
            value: {
              ...formData.ActivityPreferences,
              [category]: formData.ActivityPreferences[category]?.includes(
                value,
              )
                ? formData.ActivityPreferences[category].filter(
                    (item) => item !== value,
                  )
                : [...(formData.ActivityPreferences[category] || []), value],
            },
          },
        });
      },
      [
        isGroupSearch,
        userRole,
        handleInputChange,
        formData.ActivityPreferences,
      ],
    );

    const handleAccessibilityChange = useCallback(
      (e) => {
        handleInputChange({
          target: {
            name: "ActivityPreferences",
            value: {
              ...formData.ActivityPreferences,
              accessibility: e.target.checked,
            },
          },
        });
      },
      [handleInputChange, formData.ActivityPreferences],
    );

    const handleBudgetChange = useCallback(
      (e) => {
        const budget = e.target.value === "" ? null : Number(e.target.value);
        handleInputChange({
          target: {
            name: "ActivityPreferences",
            value: {
              ...formData.ActivityPreferences,
              budget,
            },
          },
        });
      },
      [handleInputChange, formData.ActivityPreferences],
    );

    const handleNext = useCallback(() => {
      setError("");
      nextStep();
    }, [nextStep]);

    if (isGroupSearch && userRole !== "creator") {
      return (
        <div className={styles["search-step"]}>
          <div className={styles["progress-indicator"]}>
            Étape {currentStep} sur {totalSteps}
          </div>
          <h2 className={styles["step-title"]}>
            Préférences Activités du Groupe
          </h2>
          <div className={styles["group-preferences-summary"]}>
            {/* Afficher un résumé des préférences du groupe ici */}
          </div>
          <div className={styles["navigation-buttons"]}>
            <button className={styles["nav-button"]} onClick={prevStep}>
              Précédent
            </button>
            <button className={styles["nav-button"]} onClick={nextStep}>
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
        <h2 className={styles["step-title"]}>Préférences Activités</h2>

        <div className={styles["preferences-section"]}>
          <h3 className={styles["section-title"]}>Environnement</h3>
          <div className={styles["preferences-options"]}>
            {environments.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => handlePreferenceClick("environment", id)}
                className={`${styles["preference-button"]} ${
                  formData.ActivityPreferences?.environment?.includes(id)
                    ? styles["selected"]
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={icon}
                  className={styles["preference-icon"]}
                />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles["preferences-section"]}>
          <h3 className={styles["section-title"]}>Cadre</h3>
          <div className={styles["preferences-options"]}>
            {cadres.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => handlePreferenceClick("cadre", id)}
                className={`${styles["preference-button"]} ${
                  formData.ActivityPreferences?.cadre?.includes(id)
                    ? styles["selected"]
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={icon}
                  className={styles["preference-icon"]}
                />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles["preferences-section"]}>
          <h3 className={styles["section-title"]}>Ambiance</h3>
          <div className={styles["preferences-options"]}>
            {ambiances.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => handlePreferenceClick("ambiance", id)}
                className={`${styles["preference-button"]} ${
                  formData.ActivityPreferences?.ambiance?.includes(id)
                    ? styles["selected"]
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={icon}
                  className={styles["preference-icon"]}
                />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles["preferences-section"]}>
          <h3 className={styles["section-title"]}>Durée</h3>
          <div className={styles["preferences-options"]}>
            {durations.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() =>
                  handleInputChange({
                    target: {
                      name: "ActivityPreferences",
                      value: {
                        ...formData.ActivityPreferences,
                        duration: id,
                      },
                    },
                  })
                }
                className={`${styles["preference-button"]} ${
                  formData.ActivityPreferences?.duration === id
                    ? styles["selected"]
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={icon}
                  className={styles["preference-icon"]}
                />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles["preferences-section"]}>
          <h3 className={styles["section-title"]}>Accessibilité PMR</h3>
          <label className={styles["checkbox-label"]}>
            <input
              type="checkbox"
              checked={formData.ActivityPreferences?.accessibility || false}
              onChange={handleAccessibilityChange}
            />
            <FontAwesomeIcon
              icon={faWheelchair}
              className={styles["preference-icon"]}
            />
            Accès PMR requis
          </label>
        </div>

        <div className={styles["preferences-section"]}>
          <h3 className={styles["section-title"]}>
            Budget maximum par personne (en €)
          </h3>
          <div className={styles["price-input-container"]}>
            <FontAwesomeIcon
              icon={faEuroSign}
              className={styles["euro-icon"]}
            />
            <input
              type="number"
              value={formData.ActivityPreferences?.budget || ""}
              onChange={handleBudgetChange}
              placeholder="Budget maximum"
              className={styles["price-input"]}
            />
          </div>
        </div>

        {error && <p className={styles["error-message"]}>{error}</p>}

        <div className={styles["navigation-buttons"]}>
          <button className={styles["nav-button"]} onClick={prevStep}>
            Précédent
          </button>
          <button className={styles["nav-button"]} onClick={handleNext}>
            Suivant
          </button>
        </div>
      </div>
    );
  },
);

export default ActivityPreferences;
