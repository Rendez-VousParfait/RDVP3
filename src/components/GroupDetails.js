import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCog, faSignOutAlt, faTrash, faSearch, faSync, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { db, functions } from "../firebase";
import { doc, getDoc, updateDoc, deleteDoc, arrayRemove, arrayUnion, serverTimestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { AuthContext } from "../context/AuthContext";
import styles from "./GroupDetails.module.css";
import InviteUsers from "./InviteUsers";

const GroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [membersWithPreferences, setMembersWithPreferences] = useState(0);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const fetchGroupDetails = async () => {
    setIsLoading(true);
    try {
      const groupDoc = await getDoc(doc(db, "groups", groupId));
      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        setGroup({ id: groupDoc.id, ...groupData });
        const preferencesCount = Object.keys(groupData.memberPreferences || {}).length;
        setMembersWithPreferences(preferencesCount);
      } else {
        console.log("No such group!");
      }
    } catch (error) {
      console.error("Error fetching group details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const groupRef = doc(db, "groups", groupId);
      const groupDoc = await getDoc(groupRef);
      const groupData = groupDoc.data();

      const updatedMembers = groupData.members.filter(member => member !== user.email);

      if (updatedMembers.length === 0) {
        await deleteDoc(groupRef);
      } else {
        await updateDoc(groupRef, {
          members: updatedMembers,
          lastUpdated: serverTimestamp(),
        });
      }

      navigate('/groups');
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteDoc(doc(db, "groups", groupId));
      navigate('/groups');
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleInviteSent = async ({ emails }) => {
    try {
      console.log("Début de handleInviteSent avec emails:", emails);

      const sendInvitationEmail = httpsCallable(functions, 'sendInvitationEmail');

      const groupRef = doc(db, "groups", groupId);
      const groupDoc = await getDoc(groupRef);

      if (!groupDoc.exists()) {
        throw new Error(`Le groupe ${groupId} n'existe pas.`);
      }

      const groupData = groupDoc.data();
      console.log("Données actuelles du groupe:", groupData);

      const currentInvitedMembers = groupData.invitedMembers || [];
      const updatedInvitedMembers = [...new Set([...currentInvitedMembers, ...emails])];

      console.log("Liste mise à jour des invités:", updatedInvitedMembers);

      await updateDoc(groupRef, {
        invitedMembers: updatedInvitedMembers,
        lastUpdated: serverTimestamp(),
      });

      console.log(`Groupe mis à jour dans Firebase pour ${groupId}. Invités : ${updatedInvitedMembers.join(", ")}`);

      for (const email of emails) {
        await sendInvitationEmail({ 
          email, 
          groupName: group.name, 
          invitationLink: `https://votre-app.com/join-group/${groupId}` 
        });
        console.log(`Invitation envoyée à ${email}`);
      }

      console.log("Toutes les invitations ont été envoyées et le groupe a été mis à jour");
      setShowInviteModal(false);
      fetchGroupDetails();
    } catch (error) {
      console.error("Erreur lors de l'envoi des invitations :", error);
    }
  };

  const handleGroupSearch = () => {
    navigate(`/search?groupId=${groupId}`);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!group) {
    return <div className={styles.error}>Group not found</div>;
  }

  const filteredMembers = group.members.filter(member => 
    member.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles["search-step"]}>
      <h2 className={styles["step-title"]}>{group.name}</h2>
      <p>Créé le : {group.createdAt.toDate().toLocaleDateString()}</p>
      <div className={styles.progressIndicator}>
        {membersWithPreferences}/{group.members.length} membres ont rempli leurs préférences
      </div>
      <div className={styles["initial-options"]}>
        <button className={styles["refresh-button"]} onClick={fetchGroupDetails}>
          <FontAwesomeIcon icon={faSync} className={styles["button-icon"]} />
          <span>Rafraîchir les détails</span>
        </button>
      </div>
      <div className={styles.searchBar}>
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Rechercher un membre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <h3>Membres ({group.members.length}):</h3>
      <div className={styles.membersList}>
        {filteredMembers.map(member => (
          <div key={member} className={styles.memberCard}>
            <span>{member}</span>
            <button className={styles.memberActionButton}>
              <FontAwesomeIcon icon={faUserCog} /> Personnaliser
            </button>
          </div>
        ))}
      </div>
      {group.invitedMembers && group.invitedMembers.length > 0 && (
        <>
          <h3>Membres invités ({group.invitedMembers.length}):</h3>
          <div className={styles.membersList}>
            {group.invitedMembers.map(member => (
              <div key={member} className={styles.memberCard}>
                <span>{member}</span>
                <span className={styles.invitationPending}>Invitation en attente</span>
              </div>
            ))}
          </div>
        </>
      )}
      <div className={styles.groupActions}>
        <button className={styles.groupActionButton} onClick={() => setShowInviteModal(true)}>
          <FontAwesomeIcon icon={faUserPlus} /> Inviter des membres
        </button>
        <button className={styles.groupActionButton} onClick={handleLeaveGroup}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Quitter le groupe
        </button>
        {group.createdBy === user.uid && (
          <button className={styles.groupActionButton} onClick={handleDeleteGroup}>
            <FontAwesomeIcon icon={faTrash} /> Supprimer le groupe
          </button>
        )}
        <button className={styles.groupActionButton} onClick={handleGroupSearch}>
          <FontAwesomeIcon icon={faSearch} /> Recherche de groupe
        </button>
      </div>
      {showInviteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <InviteUsers
              groupId={groupId}
              onInviteSent={handleInviteSent}
              onClose={() => setShowInviteModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;