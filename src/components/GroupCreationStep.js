import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import styles from './GroupCreationStep.module.css';
import '../style/buttons.css';
import CreateGroup from './CreatGroup';
import InviteUsers from './InviteUsers';

const GroupCreationStep = ({ formData, handleInputChange, handleGroupCreated, handleInviteSent, nextStep, prevStep }) => {
  const [groupCreated, setGroupCreated] = useState(false);
  const [groupName, setGroupName] = useState(formData.groupName || '');

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 }
  });

  const slideUp = useSpring({
    transform: 'translateY(0)',
    from: { transform: 'translateY(50px)' },
    config: { tension: 300, friction: 10 }
  });

  const onGroupCreated = (newGroup) => {
    handleGroupCreated(newGroup);
    setGroupCreated(true);
    handleInputChange('groupName', newGroup.name);
  };

  return (
    <animated.div style={fadeIn} className={styles['search-step']}>
      <h2>Création de Groupe et Invitation</h2>
      <animated.div style={slideUp} className={styles['group-creation-container']}>
        <CreateGroup 
          onGroupCreated={onGroupCreated}
          groupName={groupName}
          setGroupName={setGroupName}
        />
      </animated.div>
      {groupCreated && (
        <animated.div style={slideUp} className={styles['invite-users-container']}>
          <InviteUsers 
            groupId={formData.groupName} 
            onInviteSent={handleInviteSent}
            personCount={formData.personCount}
          />
        </animated.div>
      )}
      <div className={styles['buttons']}>
        <button className="custom-button button-nav" onClick={prevStep}>Précédent</button>
        <button className="custom-button button-nav" onClick={nextStep}>Suivant</button>
      </div>
    </animated.div>
  );
};

export default GroupCreationStep;