import React, { useState } from "react";
import styles from "./CreatGroup.module.css";
import "../style/buttons.css";

const CreateGroup = ({ onGroupCreated, groupName, setGroupName }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (groupName.trim()) {
      setIsLoading(true);
      try {
        await onGroupCreated({ name: groupName.trim() });
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

export default CreateGroup;