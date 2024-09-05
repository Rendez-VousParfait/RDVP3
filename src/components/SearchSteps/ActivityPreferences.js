import React, { useState } from "react";
import styles from "./ActivityPreferences.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFutbol,
  faBrain,
  faLandmark,
  faGlassCheers,
  faSpa,
  faUtensils,
  faUsers,
  faBirthdayCake,
  faCalendarAlt,
  faLeaf,
  faHiking,
  faSwimmer,
  faBicycle,
  faVolleyballBall,
  faChess,
  faBook,
  faTheaterMasks,
  faMusic,
  faCocktail,
  faWineGlass,
  faSeedling,
  faHotTub,
  faPalette,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";

const ActivityPreferences = ({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
}) => {
  const [flippedCards, setFlippedCards] = useState({});

  const activityTypes = [
    {
      id: "sport",
      icon: faFutbol,
      label: "Sport",
      subCategories: [
        { id: "hiking", icon: faHiking, label: "Randonnée" },
        { id: "swimming", icon: faSwimmer, label: "Natation" },
        { id: "cycling", icon: faBicycle, label: "Cyclisme" },
        { id: "ballSports", icon: faVolleyballBall, label: "Sports de balle" },
      ],
    },
    {
      id: "reflexion",
      icon: faBrain,
      label: "Réflexion",
      subCategories: [
        { id: "chess", icon: faChess, label: "Échecs" },
        { id: "reading", icon: faBook, label: "Lecture" },
      ],
    },
    {
      id: "culturel",
      icon: faLandmark,
      label: "Culturel",
      subCategories: [
        { id: "theater", icon: faTheaterMasks, label: "Théâtre" },
        { id: "music", icon: faMusic, label: "Musique" },
      ],
    },
    {
      id: "fete",
      icon: faGlassCheers,
      label: "Fête",
      subCategories: [
        { id: "nightclub", icon: faCocktail, label: "Boîte de nuit" },
        { id: "wineTasting", icon: faWineGlass, label: "Dégustation de vin" },
      ],
    },
    {
      id: "detente",
      icon: faSpa,
      label: "Détente",
      subCategories: [
        { id: "yoga", icon: faSeedling, label: "Yoga" },
        { id: "spa", icon: faHotTub, label: "Spa" },
      ],
    },
    { id: "culinaire", icon: faUtensils, label: "Culinaire" },
    {
      id: "art",
      icon: faPalette,
      label: "Art",
      subCategories: [
        { id: "painting", icon: faPalette, label: "Peinture" },
        { id: "sculpture", icon: faPalette, label: "Sculpture" },
      ],
    },
    {
      id: "photo",
      icon: faCamera,
      label: "Photographie",
      subCategories: [
        { id: "landscape", icon: faCamera, label: "Paysage" },
        { id: "portrait", icon: faCamera, label: "Portrait" },
      ],
    },
  ];

  const specialInterests = [
    { id: "jeuxEquipe", icon: faUsers, label: "Jeux en équipe" },
    {
      id: "anniversaires",
      icon: faBirthdayCake,
      label: "Lieux d'anniversaires",
    },
    {
      id: "evenementsLocaux",
      icon: faCalendarAlt,
      label: "Des événements locaux",
    },
    { id: "ecoResponsabilite", icon: faLeaf, label: "Éco-responsabilité" },
  ];

  const handlePreferenceClick = (category, value) => {
    const currentPreferences = formData.activityPreferences[category] || [];
    const updatedPreferences = currentPreferences.includes(value)
      ? currentPreferences.filter((item) => item !== value)
      : [...currentPreferences, value];

    handleInputChange("activityPreferences", {
      ...formData.activityPreferences,
      [category]: updatedPreferences,
    });
  };

  const handleSubCategoryClick = (activityId, subCategoryId) => {
    const currentSubCategories =
      formData.activityPreferences.subCategories || {};
    const updatedSubCategories = {
      ...currentSubCategories,
      [activityId]: currentSubCategories[activityId]?.includes(subCategoryId)
        ? currentSubCategories[activityId].filter((id) => id !== subCategoryId)
        : [...(currentSubCategories[activityId] || []), subCategoryId],
    };

    handleInputChange("activityPreferences", {
      ...formData.activityPreferences,
      subCategories: updatedSubCategories,
    });

    setTimeout(() => toggleFlip(activityId), 300);
  };

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetSelections = () => {
    handleInputChange("activityPreferences", {
      types: [],
      subCategories: {},
      encadrement: "",
      accessibility: "",
      specialInterests: [],
    });
    setFlippedCards({});
  };

  const getTotalSelections = () => {
    const { types, subCategories, specialInterests } =
      formData.activityPreferences;
    const subCategoriesCount = Object.values(subCategories || {}).flat().length;
    return (
      (types?.length || 0) +
      subCategoriesCount +
      (specialInterests?.length || 0)
    );
  };

  const surpriseMe = () => {
    const randomTypes = activityTypes
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((type) => type.id);

    const randomSubCategories = {};
    randomTypes.forEach((typeId) => {
      const type = activityTypes.find((t) => t.id === typeId);
      if (type.subCategories) {
        randomSubCategories[typeId] = [
          type.subCategories[
            Math.floor(Math.random() * type.subCategories.length)
          ].id,
        ];
      }
    });

    const randomSpecialInterests = specialInterests
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map((interest) => interest.id);

    const surpriseSelections = {
      types: randomTypes,
      subCategories: randomSubCategories,
      encadrement: Math.random() < 0.5 ? "guide" : "autonome",
      accessibility: Math.random() < 0.5 ? "tous" : "pmr",
      specialInterests: randomSpecialInterests,
    };

    handleInputChange("activityPreferences", surpriseSelections);
    setFlippedCards({});
  };

  return (
    <div className={styles["search-step"]}>
      <div className={styles["progress-indicator"]}>
        Étape {currentStep} sur {totalSteps}
      </div>
      <h2 className={styles["step-title"]}>Préférences Activités</h2>

      <div className={styles["selection-counter"]}>
        Sélections totales : {getTotalSelections()}
      </div>

      <div className={styles["preferences-section"]}>
        <h3 className={styles["section-title"]}>Choix du type d'activités</h3>
        <div className={styles["preferences-options"]}>
          {activityTypes.map(({ id, icon, label, subCategories }) => (
            <div
              key={id}
              className={`${styles["flip-card"]} ${flippedCards[id] ? styles["flipped"] : ""} ${
                formData.activityPreferences.subCategories?.[id]?.length > 0
                  ? styles["has-selection"]
                  : ""
              }`}
            >
              <div className={styles["flip-card-inner"]}>
                <div className={styles["flip-card-front"]}>
                  <button
                    className={`${styles["preference-button"]} ${
                      formData.activityPreferences.types?.includes(id)
                        ? styles["selected"]
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreferenceClick("types", id);
                      toggleFlip(id);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={icon}
                      className={styles["preference-icon"]}
                    />
                    <span>{label}</span>
                  </button>
                </div>
                <div className={styles["flip-card-back"]}>
                  {subCategories && (
                    <div className={styles["sub-categories"]}>
                      {subCategories.map((subCat) => (
                        <button
                          key={subCat.id}
                          className={`${styles["sub-category-button"]} ${
                            formData.activityPreferences.subCategories?.[
                              id
                            ]?.includes(subCat.id)
                              ? styles["selected"]
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubCategoryClick(id, subCat.id);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={subCat.icon}
                            className={styles["sub-category-icon"]}
                          />
                          <span>{subCat.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles["preferences-section"]}>
        <h3 className={styles["section-title"]}>Encadrement</h3>
        <select
          className={styles["select-input"]}
          value={formData.activityPreferences.encadrement || ""}
          onChange={(e) =>
            handleInputChange("activityPreferences", {
              ...formData.activityPreferences,
              encadrement: e.target.value,
            })
          }
        >
          <option value="">Sélectionnez un type d'encadrement</option>
          <option value="guide">Avec guide</option>
          <option value="autonome">En autonomie</option>
        </select>
      </div>

      <div className={styles["preferences-section"]}>
        <h3 className={styles["section-title"]}>Accessibilité</h3>
        <select
          className={styles["select-input"]}
          value={formData.activityPreferences.accessibility || ""}
          onChange={(e) =>
            handleInputChange("activityPreferences", {
              ...formData.activityPreferences,
              accessibility: e.target.value,
            })
          }
        >
          <option value="">Sélectionnez une option d'accessibilité</option>
          <option value="tous">Pour tous</option>
          <option value="pmr">Accessible PMR</option>
        </select>
      </div>

      <div className={styles["preferences-section"]}>
        <h3 className={styles["section-title"]}>
          Vous cherchez particulièrement :
        </h3>
        <div className={styles["preferences-options"]}>
          {specialInterests.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => handlePreferenceClick("specialInterests", id)}
              className={`${styles["preference-button"]} ${
                formData.activityPreferences.specialInterests?.includes(id)
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

      <button className={styles["reset-button"]} onClick={resetSelections}>
        Réinitialiser les sélections
      </button>

      <button className={styles["surprise-button"]} onClick={surpriseMe}>
        Surprise me!
      </button>

      <div className={styles["navigation-buttons"]}>
        <button className={styles["nav-button"]} onClick={prevStep}>
          Précédent
        </button>
        <button className={styles["nav-button"]} onClick={nextStep}>
          Rechercher
        </button>
      </div>
    </div>
  );
};

export default ActivityPreferences;
