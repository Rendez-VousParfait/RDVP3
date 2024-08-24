import React, { useState } from "react";
import styles from "./CreatGroup.module.css";
import "../style/buttons.css";
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Assurez-vous que le chemin est correct

const CreateGroup = ({ onGroupCreated, groupName, setGroupName }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (groupName.trim()) {
      setIsLoading(true);
      try {
        const groupRef = await addDoc(collection(db, "groups"), {
          name: groupName.trim(),
          createdAt: new Date(),
          members: [] // Initialement vide
        });
        onGroupCreated({ id: groupRef.id, name: groupName.trim() });
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
          {isLoading ? 'Création...' : 'Créer le groupe'}
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;