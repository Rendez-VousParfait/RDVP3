import React, { useCallback, useMemo } from "react";
import styles from "./AccommodationPreferences.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHotel,
  faBuilding,
  faBed,
  faStar,
  faUsers,
  faBriefcase,
  faHeart,
  faEuroSign,
  faTree,
  faUtensils,
  faPalette,
  faCity,
  faWineGlass,
  faSwimmingPool,
  faSpa,
  faDumbbell,
  faGlassMartini,
  faConciergeBell,
  faWifi,
  faParking,
  faSmokingBan,
  faBars,
  faCocktail,
  faUmbrellaBeach,
  faLandmark,
  faHome,
  faTrain,
  faLeaf,
  faCrown,
  faCube,
  faTshirt,
  faDiamond,
  faColumns,
  faSquare,
  faGem,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";

const AccommodationPreferences = React.memo(
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
    const accomodation_type = useMemo(
      () => [
        { id: "Hotel", icon: faHotel, label: "Hôtel" },
        { id: "Appart-Hôtel", icon: faBuilding, label: "Appart-Hôtel" },
        { id: "Bed and Breakfast", icon: faBed, label: "Bed and Breakfast" },
        { id: "Maison d'hôtes", icon: faHome, label: "Maison d'hôtes" },
      ],
      [],
    );

    const standing = useMemo(
      () => [
        { id: "Économique", icon: faStar, label: "Économique" },
        { id: "Milieu de gamme", icon: faStar, label: "Milieu de gamme" },
        { id: "Haut de gamme", icon: faStar, label: "Haut de gamme" },
        { id: "Luxe", icon: faStar, label: "Luxe" },
      ],
      [],
    );

    const environment = useMemo(
      () => [
        {
          id: "Centre-ville historique",
          icon: faLandmark,
          label: "Centre-ville historique",
        },
        { id: "Centre-ville", icon: faCity, label: "Centre-ville" },
        {
          id: "Quartier des Grands Hommes",
          icon: faLandmark,
          label: "Quartier des Grands Hommes",
        },
        {
          id: "Quartier résidentiel chic",
          icon: faHome,
          label: "Quartier résidentiel chic",
        },
        {
          id: "Quartier des Chartrons",
          icon: faWineGlass,
          label: "Quartier des Chartrons",
        },
        {
          id: "Quartier Mériadeck",
          icon: faBuilding,
          label: "Quartier Mériadeck",
        },
        { id: "Triangle d'Or", icon: faLandmark, label: "Triangle d'Or" },
        {
          id: "Quartier des Bassins à flot",
          icon: faUmbrellaBeach,
          label: "Quartier des Bassins à flot",
        },
        { id: "Jardin Public", icon: faTree, label: "Jardin Public" },
        {
          id: "Quartier Euratlantique",
          icon: faBuilding,
          label: "Quartier Euratlantique",
        },
        { id: "Bordeaux-Lac", icon: faUmbrellaBeach, label: "Bordeaux-Lac" },
        { id: "La Bastide", icon: faLandmark, label: "La Bastide" },
        {
          id: "Quartier de la gare",
          icon: faTrain,
          label: "Quartier de la gare",
        },
      ],
      [],
    );

    const equipments = useMemo(
      () => [
        { id: "Spa", icon: faSpa, label: "Spa" },
        { id: "Piscine", icon: faSwimmingPool, label: "Piscine" },
        { id: "Restaurant", icon: faUtensils, label: "Restaurant" },
        { id: "Bar", icon: faGlassMartini, label: "Bar" },
        { id: "Wi-Fi gratuit", icon: faWifi, label: "Wi-Fi gratuit" },
        { id: "Salle de fitness", icon: faDumbbell, label: "Salle de fitness" },
        {
          id: "Restaurant gastronomique",
          icon: faUtensils,
          label: "Restaurant gastronomique",
        },
        { id: "Bar à cigares", icon: faSmokingBan, label: "Bar à cigares" },
        { id: "Jardin privé", icon: faTree, label: "Jardin privé" },
        {
          id: "Service de chambre",
          icon: faConciergeBell,
          label: "Service de chambre",
        },
        { id: "Parking", icon: faParking, label: "Parking" },
        { id: "Bar à champagne", icon: faBars, label: "Bar à champagne" },
        {
          id: "Bar Panoramique",
          icon: faGlassMartini,
          label: "Bar Panoramique",
        },
        {
          id: "Piscine sur le toit",
          icon: faSwimmingPool,
          label: "Piscine sur le toit",
        },
        {
          id: "Restaurant sur le toit",
          icon: faUtensils,
          label: "Restaurant sur le toit",
        },
        { id: "Bar à vin", icon: faWineGlass, label: "Bar à vin" },
        { id: "Bar à cocktails", icon: faCocktail, label: "Bar à cocktails" },
        { id: "Bar à thème", icon: faGlassMartini, label: "Bar à thème" },
        {
          id: "Service de blanchisserie",
          icon: faTshirt,
          label: "Service de blanchisserie",
        },
      ],
      [],
    );

    const style = useMemo(
      () => [
        { id: "Luxueux", icon: faCrown, label: "Luxueux" },
        { id: "Élégant", icon: faStar, label: "Élégant" },
        { id: "Romantique", icon: faHeart, label: "Romantique" },
        { id: "Chic", icon: faDiamond, label: "Chic" },
        { id: "Moderne", icon: faCube, label: "Moderne" },
        { id: "Historique", icon: faLandmark, label: "Historique" },
        { id: "Contemporain", icon: faSquare, label: "Contemporain" },
        { id: "Classique", icon: faColumns, label: "Classique" },
        { id: "Éclectique", icon: faPalette, label: "Éclectique" },
        { id: "Raffiné", icon: faGem, label: "Raffiné" },
        { id: "Accueillant", icon: faSmile, label: "Accueillant" },
        { id: "Convivial", icon: faUsers, label: "Convivial" },
        { id: "Naturel", icon: faLeaf, label: "Naturel" },
        { id: "Coloré", icon: faPalette, label: "Coloré" },
      ],
      [],
    );

    const public_cible = useMemo(
      () => [
        { id: "Couples", icon: faHeart, label: "Couples" },
        { id: "Familles", icon: faUsers, label: "Familles" },
        { id: "Affaires", icon: faBriefcase, label: "Affaires" },
      ],
      [],
    );

    const handlePreferenceChange = useCallback(
      (category, value) => {
        if (isGroupSearch && userRole !== "creator") return;

        handleInputChange({
          target: {
            name: "AccommodationPreferences",
            value: {
              ...formData.AccommodationPreferences,
              [category]: formData.AccommodationPreferences[category]?.includes(
                value,
              )
                ? formData.AccommodationPreferences[category].filter(
                    (item) => item !== value,
                  )
                : [
                    ...(formData.AccommodationPreferences[category] || []),
                    value,
                  ],
            },
          },
        });
      },
      [
        isGroupSearch,
        userRole,
        handleInputChange,
        formData.AccommodationPreferences,
      ],
    );

    const handlePriceChange = useCallback(
      (e) => {
        const price = e.target.value === "" ? null : Number(e.target.value);
        handleInputChange({
          target: {
            name: "AccommodationPreferences",
            value: {
              ...formData.AccommodationPreferences,
              price,
            },
          },
        });
      },
      [handleInputChange, formData.AccommodationPreferences],
    );

    if (isGroupSearch && userRole !== "creator") {
      return (
        <div className={styles["search-step"]}>
          <div className={styles["progress-indicator"]}>
            Étape {currentStep} sur {totalSteps}
          </div>
          <h2 className={styles["step-title"]}>
            Préférences Hébergement du Groupe
          </h2>
          {/* Afficher un résumé des préférences du groupe ici */}
        </div>
      );
    }

    return (
      <div className={styles["search-step"]}>
        <div className={styles["progress-indicator"]}>
          Étape {currentStep} sur {totalSteps}
        </div>
        <h2 className={styles["step-title"]}>Préférences Hébergement</h2>

        <div className={styles["preference-section"]}>
          <h3>
            <FontAwesomeIcon icon={faHotel} /> Type d'hébergement
          </h3>
          <div className={styles["option-buttons"]}>
            {accomodation_type.map(({ id, icon, label }) => (
              <button
                key={id}
                className={`${styles["option-button"]} ${formData.AccommodationPreferences.accomodation_type?.includes(id) ? styles["selected"] : ""}`}
                onClick={() => handlePreferenceChange("accomodation_type", id)}
              >
                <FontAwesomeIcon icon={icon} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles["preference-section"]}>
          <h3>
            <FontAwesomeIcon icon={faStar} /> Standing
          </h3>
          <div className={styles["option-buttons"]}>
            {standing.map(({ id, icon, label }) => (
              <button
                key={id}
                className={`${styles["option-button"]} ${formData.AccommodationPreferences.standing?.includes(id) ? styles["selected"] : ""}`}
                onClick={() => handlePreferenceChange("standing", id)}
              >
                <FontAwesomeIcon icon={icon} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles["preference-section"]}>
          <h3>
            <FontAwesomeIcon icon={faLandmark} /> Environnement
          </h3>
          <div className={styles["option-buttons"]}>
            {environment.map(({ id, icon, label }) => (
              <button
                key={id}
                className={`${styles["option-button"]} ${formData.AccommodationPreferences.environment?.includes(id) ? styles["selected"] : ""}`}
                onClick={() => handlePreferenceChange("environment", id)}
              >
                <FontAwesomeIcon icon={icon} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles["preference-section"]}>
          <h3>
            <FontAwesomeIcon icon={faSwimmingPool} /> Équipements
          </h3>
          <div className={styles["option-buttons"]}>
            {equipments.map(({ id, icon, label }) => (
              <button
                key={id}
                className={`${styles["option-button"]} ${formData.AccommodationPreferences.equipments?.includes(id) ? styles["selected"] : ""}`}
                onClick={() => handlePreferenceChange("equipments", id)}
              >
                <FontAwesomeIcon icon={icon} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles["preference-section"]}>
          <h3>
            <FontAwesomeIcon icon={faPalette} /> Style
          </h3>
          <div className={styles["option-buttons"]}>
            {style.map(({ id, icon, label }) => (
              <button
                key={id}
                className={`${styles["option-button"]} ${formData.AccommodationPreferences.style?.includes(id) ? styles["selected"] : ""}`}
                onClick={() => handlePreferenceChange("style", id)}
              >
                <FontAwesomeIcon icon={icon} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles["preference-section"]}>
          <h3>
            <FontAwesomeIcon icon={faUsers} /> Public cible
          </h3>
          <div className={styles["option-buttons"]}>
            {public_cible.map(({ id, icon, label }) => (
              <button
                key={id}
                className={`${styles["option-button"]} ${formData.AccommodationPreferences.public_cible?.includes(id) ? styles["selected"] : ""}`}
                onClick={() => handlePreferenceChange("public_cible", id)}
              >
                <FontAwesomeIcon icon={icon} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles["preference-section"]}>
          <h3>
            <FontAwesomeIcon icon={faEuroSign} /> Prix maximum par chambre (EUR)
          </h3>
          <div className={styles["price-input-container"]}>
            <FontAwesomeIcon
              icon={faEuroSign}
              className={styles["euro-icon"]}
            />
            <input
              type="number"
              value={formData.AccommodationPreferences.price || ""}
              onChange={handlePriceChange}
              placeholder="Prix maximum"
              className={styles["price-input"]}
            />
          </div>
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
  },
);

export default AccommodationPreferences;
