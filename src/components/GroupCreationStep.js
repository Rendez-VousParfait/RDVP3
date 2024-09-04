import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import styles from "./GroupCreationStep.module.css";
import "../style/buttons.css";
import CreatGroup from "./CreatGroup";
import InviteUsers from "./InviteUsers";

/**
 * Composant pour la création de groupe et l'invitation des utilisateurs
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.formData - Les données du formulaire
 * @param {Function} props.handleInputChange - Fonction pour gérer les changements d'entrée
 * @param {Function} props.handleGroupCreated - Fonction pour gérer la création de groupe
 * @param {Function} props.handleInviteSent - Fonction pour gérer l'envoi d'invitations
 * @param {Function} props.nextStep - Fonction pour passer à l'étape suivante
 * @param {Function} props.prevStep - Fonction pour revenir à l'étape précédente
 */
const GroupCreationStep = ({
  formData,
  handleInputChange,
  handleGroupCreated,
  handleInviteSent,
  nextStep,
  prevStep,
}) => {
  const [groupCreated, setGroupCreated] = useState(false);
  const [groupName, setGroupName] = useState(formData.groupName || "");

  // Animation pour le fade-in
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  // Animation pour le slide-up
  const slideUp = useSpring({
    transform: "translateY(0)",
    from: { transform: "translateY(50px)" },
    config: { tension: 300, friction: 10 },
  });

  /**
   * Gère la création d'un nouveau groupe
   * @param {string} newGroupName - Le nom du nouveau groupe
   */
  const onGroupCreated = async (newGroupName) => {
    await handleGroupCreated(newGroupName);
    setGroupCreated(true);
  };

  return (
    <animated.div style={fadeIn} className={styles["search-step"]}>
      <h2>Création de Groupe et Invitation</h2>
      <animated.div
        style={slideUp}
        className={styles["group-creation-container"]}
      >
        <CreatGroup
          onGroupCreated={onGroupCreated}
          groupName={groupName}
          setGroupName={setGroupName}
        />
      </animated.div>
      {groupCreated && (
        <animated.div
          style={slideUp}
          className={styles["invite-users-container"]}
        >
          <InviteUsers
            groupId={formData.groupId}
            onInviteSent={handleInviteSent}
            personCount={formData.personCount}
          />
        </animated.div>
      )}
      <div className={styles["buttons"]}>
        <button className="custom-button button-nav" onClick={prevStep}>
          Précédent
        </button>
        <button className="custom-button button-nav" onClick={nextStep}>
          Suivant
        </button>
      </div>
    </animated.div>
  );
};

export default GroupCreationStep;