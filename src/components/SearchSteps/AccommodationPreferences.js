import React from 'react';

const AccommodationPreferences = ({ formData, handleInputChange, nextStep, prevStep }) => {
  const accommodationTypes = ['Hôtel', 'Appart Hôtel', 'Chambres d\'hôtes'];
  const roomTypes = ['Chambre simple', 'Chambre double', 'Suite'];
  const equipments = ['Spa', 'Piscine', 'Salle de sport', 'Hammam'];

  return (
    <div className="search-step">
      <h2>Préférences Hébergement</h2>
      <div className="accommodation-types">
        <h3>Choix du type d'hébergement</h3>
        {accommodationTypes.map(type => (
          <label key={type}>
            <input 
              type="checkbox" 
              checked={formData.accommodationPreferences.types?.includes(type)} 
              onChange={() => {
                const updatedTypes = formData.accommodationPreferences.types?.includes(type)
                  ? formData.accommodationPreferences.types.filter(t => t !== type)
                  : [...(formData.accommodationPreferences.types || []), type];
                handleInputChange('accommodationPreferences', {...formData.accommodationPreferences, types: updatedTypes});
              }}
            />
            {type}
          </label>
        ))}
      </div>
      <div className="standing">
        <h3>Standing</h3>
        <select 
          value={formData.accommodationPreferences.standing} 
          onChange={(e) => handleInputChange('accommodationPreferences', {...formData.accommodationPreferences, standing: e.target.value})}
        >
          <option value="">Sélectionnez un standing</option>
          <option value="economique">Économique</option>
          <option value="standard">Standard</option>
          <option value="luxe">Luxe</option>
        </select>
      </div>
      <div className="room-types">
        <h3>Type de chambre</h3>
        {roomTypes.map(type => (
          <label key={type}>
            <input 
              type="radio" 
              name="roomType"
              checked={formData.accommodationPreferences.roomType === type} 
              onChange={() => handleInputChange('accommodationPreferences', {...formData.accommodationPreferences, roomType: type})}
            />
            {type}
          </label>
        ))}
      </div>
      <div className="equipments">
        <h3>Les équipements</h3>
        {equipments.map(equipment => (
          <label key={equipment}>
            <input 
              type="checkbox" 
              checked={formData.accommodationPreferences.equipments?.includes(equipment)} 
              onChange={() => {
                const updatedEquipments = formData.accommodationPreferences.equipments?.includes(equipment)
                  ? formData.accommodationPreferences.equipments.filter(e => e !== equipment)
                  : [...(formData.accommodationPreferences.equipments || []), equipment];
                handleInputChange('accommodationPreferences', {...formData.accommodationPreferences, equipments: updatedEquipments});
              }}
            />
            {equipment}
          </label>
        ))}
      </div>
      <button className="custom-button" onClick={prevStep}>Précédent</button>
      <button className="custom-button" onClick={nextStep}>Suivant</button>
    </div>
  );
};

export default AccommodationPreferences;