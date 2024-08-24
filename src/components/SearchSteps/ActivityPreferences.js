import React from 'react';
import './ActivityPreferences.module.css'; 
import '../../style/buttons.css'; // Importer les styles consolidés

const ActivityPreferences = ({ formData, handleInputChange, nextStep, prevStep }) => {
  const activityTypes = ['Sport', 'Réflexion', 'Culturel', 'Fête', 'Détente', 'Culinaire'];
  const specialInterests = ['Jeux en équipe', 'Lieux d\'anniversaires', 'Des événements locaux', 'Éco-responsabilité'];

  return (
    <div className="search-step">
      <h2>Préférences Activités</h2>
      <div className="activity-types">
        <h3>Choix du type d'activités</h3>
        {activityTypes.map(type => (
          <label key={type}>
            <input 
              type="checkbox" 
              checked={formData.activityPreferences.types?.includes(type)} 
              onChange={() => {
                const updatedTypes = formData.activityPreferences.types?.includes(type)
                  ? formData.activityPreferences.types.filter(t => t !== type)
                  : [...(formData.activityPreferences.types || []), type];
                handleInputChange('activityPreferences', {...formData.activityPreferences, types: updatedTypes});
              }}
            />
            {type}
          </label>
        ))}
      </div>
      <div className="encadrement">
        <h3>Encadrement</h3>
        <select 
          value={formData.activityPreferences.encadrement} 
          onChange={(e) => handleInputChange('activityPreferences', {...formData.activityPreferences, encadrement: e.target.value})}
        >
          <option value="">Sélectionnez un type d'encadrement</option>
          <option value="guide">Avec guide</option>
          <option value="autonome">En autonomie</option>
        </select>
      </div>
      <div className="accessibility">
        <h3>Accessibilité</h3>
        <select 
          value={formData.activityPreferences.accessibility} 
          onChange={(e) => handleInputChange('activityPreferences', {...formData.activityPreferences, accessibility: e.target.value})}
        >
          <option value="">Sélectionnez une option d'accessibilité</option>
          <option value="tous">Pour tous</option>
          <option value="pmr">Accessible PMR</option>
        </select>
      </div>
      <div className="special-interests">
        <h3>Vous cherchez particulièrement :</h3>
        {specialInterests.map(interest => (
          <label key={interest}>
            <input 
              type="checkbox" 
              checked={formData.activityPreferences.specialInterests?.includes(interest)} 
              onChange={() => {
                const updatedInterests = formData.activityPreferences.specialInterests?.includes(interest)
                  ? formData.activityPreferences.specialInterests.filter(i => i !== interest)
                  : [...(formData.activityPreferences.specialInterests || []), interest];
                handleInputChange('activityPreferences', {...formData.activityPreferences, specialInterests: updatedInterests});
              }}
            />
            {interest}
          </label>
        ))}
      </div>
      <button className="custom-button" onClick={prevStep}>Précédent</button>
      <button className="custom-button" onClick={nextStep}>Rechercher</button>
    </div>
  );
};

export default ActivityPreferences;