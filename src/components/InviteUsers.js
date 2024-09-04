import React, { useState } from "react";
import styles from "./InviteUsers.module.css";
import "../style/buttons.css";

const MAX_INVITES = 20;

const InviteUsers = ({ groupId, onInviteSent, onClose }) => {
  const [invitedUsers, setInvitedUsers] = useState([""]);

  const addEmailField = () => {
    if (invitedUsers.length < MAX_INVITES) {
      setInvitedUsers([...invitedUsers, ""]);
    }
  };

  const handleEmailChange = (index, value) => {
    const newInvitedUsers = [...invitedUsers];
    newInvitedUsers[index] = value;
    setInvitedUsers(newInvitedUsers);
  };

  const removeEmailField = (index) => {
    const newInvitedUsers = invitedUsers.filter((_, i) => i !== index);
    setInvitedUsers(newInvitedUsers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validEmails = invitedUsers.filter(email => email.trim());
    if (validEmails.length > 0) {
      onInviteSent({ groupId, emails: validEmails });
    }
  };

  return (
    <div className={styles.inviteUsersContainer}>
      <h3>Inviter des membres (max {MAX_INVITES})</h3>
      <form onSubmit={handleSubmit} className={styles.inviteForm}>
        {invitedUsers.map((email, index) => (
          <div key={index} className={styles.emailInputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              placeholder={`Email de l'invité ${index + 1}`}
            />
            {invitedUsers.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeEmailField(index)}
                className={styles.removeButton}
              >
                X
              </button>
            )}
          </div>
        ))}
        {invitedUsers.length < MAX_INVITES && (
          <button 
            type="button" 
            onClick={addEmailField}
            className={styles.addButton}
          >
            Ajouter un autre email
          </button>
        )}
        <button type="submit" className={styles.inviteButton}>
          Inviter
        </button>
      </form>
      <button onClick={onClose} className={styles.closeButton}>
        Fermer
      </button>
    </div>
  );
};

export default InviteUsers;