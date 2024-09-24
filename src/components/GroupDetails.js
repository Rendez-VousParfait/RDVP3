// GroupDetails.js
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faSignOutAlt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import { fetchGroupDetails, inviteToGroup, leaveGroup } from "./GroupUtils";
import styles from "./GroupDetails.module.css";

const GroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGroupDetails = async () => {
      setIsLoading(true);
      try {
        const groupData = await fetchGroupDetails(groupId);
        setGroup(groupData);
      } catch (err) {
        setError("Erreur lors du chargement des détails du groupe");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (groupId) {
      loadGroupDetails();
    }
  }, [groupId]);

  const handleInvite = async () => {
    if (inviteEmail.trim()) {
      try {
        await inviteToGroup(groupId, inviteEmail.trim(), group.name);
        setInviteEmail("");
        // Rafraîchir les détails du groupe
        const updatedGroup = await fetchGroupDetails(groupId);
        setGroup(updatedGroup);
      } catch (error) {
        console.error("Erreur lors de l'invitation :", error);
        setError("Erreur lors de l'envoi de l'invitation");
      }
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(groupId, user.email);
      navigate("/groups");
    } catch (error) {
      console.error("Erreur lors de la tentative de quitter le groupe:", error);
      setError("Erreur lors de la tentative de quitter le groupe");
    }
  };

  const handleGroupSearch = () => {
    navigate(`/search?groupId=${groupId}`);
  };

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!group) return <div>Groupe non trouvé</div>;

  return (
    <div className={styles.groupDetails}>
      <h2>{group.name}</h2>
      <div className={styles.memberSection}>
        <h3>Membres :</h3>
        <ul>
          {group.members.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>
      </div>
      <div className={styles.inviteSection}>
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="Email de l'invité"
        />
        <button onClick={handleInvite}>
          <FontAwesomeIcon icon={faUserPlus} /> Inviter
        </button>
      </div>
      {group.invitedMembers && group.invitedMembers.length > 0 && (
        <div className={styles.invitedSection}>
          <h3>Membres invités :</h3>
          <ul>
            {group.invitedMembers.map((member) => (
              <li key={member}>{member}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleGroupSearch} className={styles.searchButton}>
        <FontAwesomeIcon icon={faSearch} /> Lancer la recherche de groupe
      </button>
      <button onClick={handleLeaveGroup} className={styles.leaveButton}>
        <FontAwesomeIcon icon={faSignOutAlt} /> Quitter le groupe
      </button>
    </div>
  );
};

export default GroupDetails;
