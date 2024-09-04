import React, { useState } from "react";
import styles from "./CreatGroup.module.css";
import "../style/buttons.css";

/**
 * Composant pour la création d'un groupe
 * @param {Object} props - Les propriétés du composant
 * @param {Function} props.onGroupCreated - Fonction appelée lors de la création du groupe
 * @param {string} props.groupName - Le nom du groupe
 * @param {Function} props.setGroupName - Fonction pour mettre à jour le nom du groupe
 */
const CreatGroup = ({ onGroupCreated, groupName, setGroupName }) => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Gère la soumission du formulaire de création de groupe
   * @param {Event} e - L'événement de soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (groupName.trim()) {
      setIsLoading(true);
      try {
        await onGroupCreated(groupName.trim());
      } catch (error) {
        console.error("Error creating group: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.createGroupContainer}>
      <h3>Créez votre groupe de voyage</h3>
      <form onSubmit={handleSubmit} className={styles.createGroupForm}>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Nom du groupe"
          required
        />
        <button type="submit" className="custom-button" disabled={isLoading}>
          {isLoading ? "Création..." : "Créer le groupe"}
        </button>
      </form>
    </div>
  );
};

export default CreatGroup;