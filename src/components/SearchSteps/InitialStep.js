import React, { useState } from "react";
import "../Swiper.module.css";

const InitialStep = ({ formData, handleInputChange, nextStep }) => {
  const [showNextStep, setShowNextStep] = useState(false);

  const handleStartClick = () => {
    setShowNextStep(true);
    nextStep();
  };

  if (showNextStep) {
    return null; // Ne rien afficher, car le Swiper s'en chargera
  }

  return (
    <div>
      <h2>Bienvenue dans la planification de votre voyage</h2>
      <p>Commençons par quelques préférences de base.</p>
      <button onClick={handleStartClick}>Commencer</button>
    </div>
  );
};

export default InitialStep;
