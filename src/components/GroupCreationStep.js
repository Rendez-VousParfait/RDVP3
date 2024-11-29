import React, { useState } from "react";
import styles from "./GroupManager.module.css";

const GroupCreationStep = ({ onGroupCreated }) => {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onGroupCreated(groupName);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.groupCreationForm}>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Nom du groupe"
        required
        className={styles.groupNameInput}
      />
      <button type="submit" className={styles.createGroupButton}>
        Créer le groupe
      </button>
    </form>
  );
};

export default GroupCreationStep;