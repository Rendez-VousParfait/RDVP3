import React, { useState, useCallback, useEffect, useMemo } from "react";
import styles from "./RestaurantPreferences.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faWheelchair,
  faTree,
  faBuilding,
  faEuroSign,
  faUsers,
  faHeart,
  faWineGlass,
  faLeaf,
  faGlassCheers,
  faSpa,
  faUmbrellaBeach,
  faCoffee,
  faHamburger,
  faPizzaSlice,
  faDrumstickBite,
  faFish,
  faCarrot,
} from "@fortawesome/free-solid-svg-icons";

const RestaurantPreferences = React.memo(
  ({
    formData,
    handlePreferencesChange,
    nextStep,
    prevStep,
    currentStep,
    totalSteps,
    isGroupSearch,
    userRole,
  }) => {
    const [error, setError] = useState("");

    useEffect(() => {
      console.log("RestaurantPreferences formData:", formData);
    }, [formData]);

    const cuisineTypes = useMemo(
      () => [
        { id: "Française", icon: faUtensils, label: "Française" },
        { id: "Européenne", icon: faWineGlass, label: "Européenne" },
        { id: "Moderne", icon: faCoffee, label: "Moderne" },
        { id: "Fusion", icon: faHamburger, label: "Fusion" },
        { id: "Gastronomique", icon: faUtensils, label: "Gastronomique" },
        { id: "Fruits de mer", icon: faFish, label: "Fruits de mer" },
        {
          id: "Traditionnelle",
          icon: faDrumstickBite,
          label: "Traditionnelle",
        },
        { id: "Brasserie", icon: faGlassCheers, label: "Brasserie" },
        { id: "Régionale", icon: faUtensils, label: "Régionale" },
        { id: "Créative", icon: faPizzaSlice, label: "Créative" },
        { id: "Bistrot", icon: faWineGlass, label: "Bistrot" },
        { id: "Fromagerie", icon: faCarrot, label: "Fromagerie" },
        { id: "Saine", icon: faLeaf, label: "Saine" },
      ],
      [],
    );

    const ambiances = useMemo(
      () => [
        { id: "Chic", icon: faWineGlass, label: "Chic" },
        { id: "Moderne", icon: faBuilding, label: "Moderne" },
        { id: "Intime", icon: faHeart, label: "Intime" },
        { id: "Convivial", icon: faUsers, label: "Convivial" },
        { id: "Luxe", icon: faSpa, label: "Luxe" },
        { id: "Rustique", icon: faTree, label: "Rustique" },
        { id: "Élégant", icon: faWineGlass, label: "Élégant" },
        { id: "Authentique", icon: faUmbrellaBeach, label: "Authentique" },
      ],
      [],
    );

    const services = useMemo(
      () => [
        { id: "Menu dégustation", icon: faUtensils, label: "Menu dégustation" },
        { id: "Terrasse", icon: faUmbrellaBeach, label: "Terrasse" },
        {
          id: "Options végétarienne",
          icon: faLeaf,
          label: "Options végétarienne",
        },
        { id: "Service VIP", icon: faWineGlass, label: "Service VIP" },
        { id: "Plats de saison", icon: faCarrot, label: "Plats de saison" },
        { id: "Menu du jour", icon: faUtensils, label: "Menu du jour" },
        { id: "Privatisation", icon: faUsers, label: "Privatisation" },
        { id: "Cave à vins", icon: faWineGlass, label: "Cave à vins" },
        {
          id: "Fruits de mer frais",
          icon: faFish,
          label: "Fruits de mer frais",
        },
        {
          id: "Cuisine régionale",
          icon: faUtensils,
          label: "Cuisine régionale",
        },
        { id: "Cheminée", icon: faTree, label: "Cheminée" },
        { id: "Bar à vins", icon: faWineGlass, label: "Bar à vins" },
        { id: "Sommelier", icon: faWineGlass, label: "Sommelier" },
        { id: "Plats à partager", icon: faUsers, label: "Plats à partager" },
        {
          id: "Spécialités locales",
          icon: faUtensils,
          label: "Spécialités locales",
        },
        {
          id: "Sélection de fromages",
          icon: faCarrot,
          label: "Sélection de fromages",
        },
        {
          id: "Accord mets-vins",
          icon: faWineGlass,
          label: "Accord mets-vins",
        },
      ],
      [],
    );

    const handlePreferenceClick = useCallback(
      (category, value) => {
        if (isGroupSearch && userRole !== "creator") return;
        handlePreferencesChange(
          "RestaurantPreferences",
          category,
          formData.RestaurantPreferences[category]?.includes(value)
            ? formData.RestaurantPreferences[category].filter(
                (item) => item !== value,
              )
            : [...(formData.RestaurantPreferences[category] || []), value],
        );
      },
      [
        isGroupSearch,
        userRole,
        handlePreferencesChange,
        formData.RestaurantPreferences,
      ],
    );

    const handleAccessibilityChange = useCallback(
      (e) => {
        handlePreferencesChange(
          "RestaurantPreferences",
          "accessibility",
          e.target.checked,
        );
      },
      [handlePreferencesChange],
    );

    const handleBudgetChange = useCallback(
      (e) => {
        const budget = e.target.value === "" ? null : Number(e.target.value);
        handlePreferencesChange("RestaurantPreferences", "budget", budget);
      },
      [handlePreferencesChange],
    );

    const handleNext = useCallback(() => {
      if (
        !formData.RestaurantPreferences?.cuisinetype ||
        formData.RestaurantPreferences.cuisinetype.length === 0
      ) {
        setError("Veuillez sélectionner au moins un type de cuisine");
        return;
      }
      setError("");
      nextStep();
    }, [formData.RestaurantPreferences?.cuisinetype, nextStep]);

    if (isGroupSearch && userRole !== "creator") {
      return (
        <div className={styles["search-step"]}>
          <div className={styles["progress-indicator"]}>
            Étape {currentStep} sur {totalSteps}
          </div>
          <h2 className={styles["step-title"]}>
            Préférences Restaurants du Groupe
          </h2>
          <div className={styles["group-preferences-summary"]}>
            {/* Afficher un résumé des préférences du groupe ici */}
          </div>
        </div>
      );
    }

    return (
      <div className={styles["search-step"]}>
        <div className={styles["progress-indicator"]}>
          Étape {currentStep} sur {totalSteps}
        </div>
        <h2 className={styles["step-title"]}>Préférences Restaurants</h2>

        <div className={styles["preferences-section"]}>
          <h3 className={styles["section-title"]}>Types de cuisine</h3>
          <div className={styles["preferences-options"]}>
            {cuisineTypes.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => handlePreferenceClick("cuisinetype", id)}
                className={`${styles["preference-button"]} ${
                  formData.RestaurantPreferences?.cuisinetype?.includes(id)
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
                  formData.RestaurantPreferences?.ambiance?.includes(id)
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
          <h3 className={styles["section-title"]}>Services</h3>
          <div className={styles["preferences-options"]}>
            {services.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => handlePreferenceClick("services", id)}
                className={`${styles["preference-button"]} ${
                  formData.RestaurantPreferences?.services?.includes(id)
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
              value={formData.RestaurantPreferences?.budget || ""}
              onChange={handleBudgetChange}
              placeholder="Budget maximum"
              className={styles["price-input"]}
            />
          </div>
        </div>

        <div className={styles["preferences-section"]}>
          <h3 className={styles["section-title"]}>Accessibilité PMR</h3>
          <label className={styles["checkbox-label"]}>
            <input
              type="checkbox"
              checked={formData.RestaurantPreferences?.accessibility || false}
              onChange={handleAccessibilityChange}
            />
            <FontAwesomeIcon
              icon={faWheelchair}
              className={styles["preference-icon"]}
            />
            Accès PMR requis
          </label>
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

export default RestaurantPreferences;
