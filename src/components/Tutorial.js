import React, { useState, useEffect, useMemo } from "react";
import styles from "./Tutorial.module.css";

const Tutorial = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const steps = useMemo(
    () => [
      {
        title: "Bienvenue dans le moteur de recherche",
        description:
          "Notre moteur de recherche avancé vous permet de trouver l'escapade parfaite en quelques clics. Commençons par explorer ses fonctionnalités !",
        image:
          "https://images.unsplash.com/photo-1488998427799-e3362cec87c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        tooltip: "Commencez votre recherche ici",
      },
      {
        title: "Filtres personnalisés",
        description:
          "Utilisez nos filtres pour affiner votre recherche. Vous pouvez sélectionner le type d'hébergement, les équipements souhaités, les activités à proximité et bien plus encore.",
        image:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        tooltip: "Affinez votre recherche avec ces filtres",
      },
      {
        title: "Budget et dates",
        description:
          "Définissez votre budget et vos dates de séjour. Notre moteur s'occupera de trouver les meilleures offres correspondant à vos critères.",
        image:
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1826&q=80",
        tooltip: "Sélectionnez vos dates et votre budget ici",
      },
      {
        title: "Résultats personnalisés",
        description:
          "Découvrez une liste de résultats parfaitement adaptés à vos préférences. Vous pouvez les trier par prix, popularité ou recommandations.",
        image:
          "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        tooltip: "Vos résultats personnalisés s'afficheront ici",
      },
    ],
    [],
  );

  useEffect(() => {
    if (currentStep >= steps.length && onComplete) {
      onComplete();
    }
  }, [currentStep, steps.length, onComplete]);

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleDontShowAgain = () => {
    localStorage.setItem("dontShowTutorial", "true");
    onSkip();
  };

  if (currentStep >= steps.length) {
    return null;
  }

  const currentStepData = steps[currentStep];

  if (!currentStepData) {
    console.error("Étape non trouvée:", currentStep);
    return null;
  }

  return (
    <div className={styles.tutorialOverlay}>
      <div className={styles.tutorialContent}>
        <img
          src={currentStepData.image}
          alt={currentStepData.title}
          className={styles.tutorialImage}
        />
        <div className={styles.textContent}>
          <h3>{currentStepData.title}</h3>
          <p>{currentStepData.description}</p>
          <div className={styles.progressIndicator}>
            {steps.map((_, index) => (
              <div
                key={index}
                className={`${styles.progressDot} ${index === currentStep ? styles.activeDot : ""}`}
                onClick={() => goToStep(index)}
              />
            ))}
          </div>
          <div className={styles.buttonContainer}>
            <button
              onClick={handleDontShowAgain}
              className={`${styles.tutorialButton} ${styles.dontShowButton}`}
            >
              Ne plus afficher
            </button>
            <button
              onClick={onSkip}
              className={`${styles.tutorialButton} ${styles.skipButton}`}
            >
              Passer
            </button>
            <button onClick={nextStep} className={styles.tutorialButton}>
              {currentStep < steps.length - 1 ? "Suivant" : "Terminer"}
            </button>
          </div>
        </div>
      </div>
      {showTooltip && (
        <div className={styles.tooltip}>{currentStepData.tooltip}</div>
      )}
      <button
        className={styles.tooltipToggle}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        {showTooltip ? "Masquer l'info" : "Afficher l'info"}
      </button>
    </div>
  );
};

export default Tutorial;
