import React, { useState } from "react";
import "./SearchForm.css";

const SearchForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: "",
    dateFrom: "",
    dateTo: "",
    guests: 1,
    budget: "",
    interests: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInterestChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      interests: prevState.interests.includes(value)
        ? prevState.interests.filter((interest) => interest !== value)
        : [...prevState.interests, value],
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Ici, vous pouvez ajouter la logique pour envoyer les données à votre backend
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-step">
            <h2>Où voulez-vous aller ?</h2>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              placeholder="Entrez votre destination"
              required
            />
          </div>
        );
      case 2:
        return (
          <div className="form-step">
            <h2>Quand voulez-vous partir ?</h2>
            <input
              type="date"
              name="dateFrom"
              value={formData.dateFrom}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="dateTo"
              value={formData.dateTo}
              onChange={handleInputChange}
              required
            />
          </div>
        );
      case 3:
        return (
          <div className="form-step">
            <h2>Combien de personnes ?</h2>
            <input
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
        );
      case 4:
        return (
          <div className="form-step">
            <h2>Quel est votre budget ?</h2>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              placeholder="Entrez votre budget"
              required
            />
          </div>
        );
      case 5:
        return (
          <div className="form-step">
            <h2>Quels sont vos centres d'intérêt ?</h2>
            <div className="interests-grid">
              {[
                "Culture",
                "Nature",
                "Gastronomie",
                "Sport",
                "Détente",
                "Shopping",
              ].map((interest) => (
                <label key={interest}>
                  <input
                    type="checkbox"
                    name="interests"
                    value={interest}
                    checked={formData.interests.includes(interest)}
                    onChange={handleInterestChange}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      {renderStep()}
      <div className="form-navigation">
        {step > 1 && (
          <button type="button" onClick={prevStep}>
            Précédent
          </button>
        )}
        {step < 5 ? (
          <button type="button" onClick={nextStep}>
            Suivant
          </button>
        ) : (
          <button type="submit">Rechercher</button>
        )}
      </div>
    </form>
  );
};

export default SearchForm;
