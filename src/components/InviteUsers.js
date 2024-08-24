import React, { useState, useEffect } from 'react';
import styles from './InviteUsers.module.css';
import '../style/buttons.css';

const InviteUsers = ({ groupId, onInviteSent, personCount }) => {
  const [invitedUsers, setInvitedUsers] = useState([]);

  useEffect(() => {
    const count = Math.max(0, parseInt(personCount) - 1);
    setInvitedUsers(Array(count).fill(''));
  }, [personCount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    invitedUsers.forEach(email => {
      if (email.trim()) {
        onInviteSent({ groupId, email: email.trim() });
      }
    });
  };

  const handleEmailChange = (index, value) => {
    const newInvitedUsers = [...invitedUsers];
    newInvitedUsers[index] = value;
    setInvitedUsers(newInvitedUsers);
  };

  return (
    <div className={styles.inviteUsersContainer}>
      <h3>Inviter des membres</h3>
      <form onSubmit={handleSubmit} className={styles.inviteForm}>
        {invitedUsers.map((email, index) => (
          <input
            key={index}
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(index, e.target.value)}
            placeholder={`Email de l'invité ${index + 1}`}
          />
        ))}
        {invitedUsers.length > 0 && (
          <button type="submit" className="custom-button">Inviter</button>
        )}
      </form>
    </div>
  );
};

export default InviteUsers;