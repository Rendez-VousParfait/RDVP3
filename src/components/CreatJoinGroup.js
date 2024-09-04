import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatGroup from './CreatGroup';
import InviteUsers from './InviteUsers';
import styles from './CreateJoinGroup.module.css';

const CreateJoinGroup = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [groupId, setGroupId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupCreated, setGroupCreated] = useState(false);
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleGroupCreated = async (newGroupName) => {
    // Logique pour créer un groupe (à implémenter)
    console.log("Groupe créé:", newGroupName);
    setGroupName(newGroupName);
    setGroupCreated(true);
    setGroupId("nouveau_group_id"); // Remplacer par l'ID réel du groupe créé
  };

  const handleInviteSent = async ({ emails }) => {
    // Logique pour envoyer des invitations (à implémenter)
    console.log("Invitations envoyées à:", emails);
    navigate('/group-management');
  };

  const handleJoinGroup = async () => {
    // Logique pour rejoindre un groupe (à implémenter)
    console.log("Rejoindre le groupe:", groupId);
    navigate('/group-management');
  };

  return (
    <div className={styles.createJoinGroup}>
      <h2>Créer ou Rejoindre un Groupe</h2>
      <div className={styles.options}>
        <button onClick={() => handleOptionClick('create')}>Créer un groupe</button>
        <button onClick={() => handleOptionClick('join')}>Rejoindre un groupe</button>
      </div>
      {selectedOption === 'create' && !groupCreated && (
        <CreatGroup
          onGroupCreated={handleGroupCreated}
          groupName={groupName}
          setGroupName={setGroupName}
        />
      )}
      {selectedOption === 'create' && groupCreated && (
        <InviteUsers
          groupId={groupId}
          onInviteSent={handleInviteSent}
          personCount="5"
        />
      )}
      {selectedOption === 'join' && (
        <div className={styles.joinGroup}>
          <input
            type="text"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            placeholder="Identifiant du groupe"
          />
          <button onClick={handleJoinGroup}>Rejoindre</button>
        </div>
      )}
    </div>
  );
};

export default CreateJoinGroup;