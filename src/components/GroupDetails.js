import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faSignOutAlt,
  faSearch,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth";
import {
  fetchGroupDetails,
  inviteToGroup,
  leaveGroup,
  fetchSavedSearch,
  checkGroupStatus,
  initiateGroupSearch,
} from "./GroupUtils";
import { Card, CardContent, Typography } from "@mui/material";
import styles from "./GroupDetails.module.css";
import Modal from "./Modal";

const GroupDetails = () => {
  console.log("GroupDetails component started");
  
  // Ajout de la vérification du domaine
  useEffect(() => {
    const currentDomain = window.location.hostname;
    const allowedDomains = ["localhost", "replit.dev", "repl.co"];
    const isAllowedDomain = allowedDomains.some(domain => currentDomain.includes(domain));
    
    if (!isAllowedDomain) {
      console.error(`Domaine non autorisé: ${currentDomain}`);
      // Vous pouvez ajouter ici une logique pour gérer les domaines non autorisés
      // Par exemple, afficher un message d'erreur ou rediriger l'utilisateur
    } else {
      console.log(`Domaine autorisé: ${currentDomain}`);
    }
  }, []);

  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedSearch, setSavedSearch] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const loadGroupDetails = useCallback(async () => {
    console.log("loadGroupDetails started");
    setIsLoading(true);
    setError(null);
    try {
      const [groupData, savedSearchData, status] = await Promise.all([
        fetchGroupDetails(groupId),
        fetchSavedSearch(groupId),
        user ? checkGroupStatus(groupId, user.email) : null
      ]);

      setGroup(groupData);
      setSavedSearch(savedSearchData);
      if (status) setUserStatus(status);

      console.log("All data fetched successfully");
    } catch (err) {
      console.error("Error in loadGroupDetails:", err);
      setError("Erreur lors du chargement des détails du groupe. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }, [groupId, user]);

  useEffect(() => {
    console.log("GroupDetails useEffect triggered", { user, groupId });
    if (groupId && user) {
      loadGroupDetails();
    } else {
      console.log("Waiting for user or groupId");
    }
  }, [groupId, loadGroupDetails, user]);

  const handleInvite = async () => {
    if (inviteEmail.trim()) {
      try {
        await inviteToGroup(groupId, inviteEmail.trim(), group.name);
        setInviteEmail("");
        await loadGroupDetails();
      } catch (error) {
        console.error("Erreur lors de l'invitation :", error);
        setError("Erreur lors de l'envoi de l'invitation");
      }
    }
  };

  const handleLeaveGroup = async () => {
    if (!user) return;
    try {
      await leaveGroup(groupId, user.email);
      navigate("/groups");
    } catch (error) {
      console.error("Erreur lors de la tentative de quitter le groupe:", error);
      setError("Erreur lors de la tentative de quitter le groupe");
    }
  };

  const handleGroupSearch = async () => {
    if (user && user.email === group.creator && group.members.length >= 2) {
      try {
        await initiateGroupSearch(groupId);
        navigate(`/search`, {
          state: { 
            groupId,
            isGroupSearch: true,
            isCreator: true,
            step: 2
          }
        });
      } catch (error) {
        console.error("Erreur lors de l'initiation de la recherche de groupe:", error);
        setModalMessage(error.message || "Une erreur est survenue lors de l'initiation de la recherche de groupe.");
        setShowModal(true);
      }
    } else {
      setModalMessage("Vous ne pouvez pas lancer la recherche. Assurez-vous d'être le créateur du groupe et qu'il y a au moins deux membres.");
      setShowModal(true);
    }
  };

  const handleViewSavedSearch = () => {
    console.log("Navigating to search results with groupId:", groupId);
    navigate(`/group/${groupId}/search-results`);
  };

  console.log("Rendering GroupDetails", { isLoading, error, group });
  if (isLoading) return <div className={styles.loading}>Chargement des détails du groupe...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!group) return <div className={styles.notFound}>Groupe non trouvé</div>;

  const isCreator = user && user.email === group.creator;

  return (
    <div className={styles.groupDetails}>
      <h2 className={styles.groupName}>{group.name}</h2>
      <div className={styles.memberSection}>
        <h3>Membres :</h3>
        <ul className={styles.memberList}>
          {group.members.map((member) => (
            <li key={member} className={styles.memberItem}>
              {member}
              {member === group.creator && (
                <span className={styles.creatorBadge}> (Créateur)</span>
              )}
              {userStatus && userStatus.memberPreferences && userStatus.memberPreferences[member] && (
                <span className={styles.submittedBadge}> (Préférences soumises)</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      {isCreator && (
        <div className={styles.inviteSection}>
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Email de l'invité"
            className={styles.inviteInput}
          />
          <button onClick={handleInvite} className={styles.inviteButton}>
            <FontAwesomeIcon icon={faUserPlus} /> Inviter
          </button>
        </div>
      )}
      {group.invitedMembers && group.invitedMembers.length > 0 && (
        <div className={styles.invitedSection}>
          <h3>Membres invités :</h3>
          <ul className={styles.invitedList}>
            {group.invitedMembers.map((member) => (
              <li key={member} className={styles.invitedItem}>
                {member}
              </li>
            ))}
          </ul>
        </div>
      )}
      {isCreator && (
        <button 
          onClick={handleGroupSearch} 
          className={styles.searchButton}
          disabled={group.members.length < 2}
        >
          <FontAwesomeIcon icon={faSearch} /> 
          Lancer la recherche de groupe
        </button>
      )}
      {/* Supprimez ou commentez la section pour les membres non-créateurs */}
      {/* {!isCreator && userStatus && userStatus.searchInitiated && !userStatus.hasSubmittedPreferences && (
        <button onClick={handleParticipateSearch} className={styles.participateButton}>
          <FontAwesomeIcon icon={faSearch} /> Participer à la recherche de groupe
        </button>
      )} */}
      {savedSearch && (
        <Card
          className={styles.savedSearchCard}
          onClick={handleViewSavedSearch}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              Résultats de recherche de groupe
            </Typography>
            <Typography color="text.secondary">
              <FontAwesomeIcon icon={faCalendar} />{" "}
              {savedSearch.date
                ? new Date(savedSearch.date).toLocaleDateString()
                : "Date non disponible"}
            </Typography>
          </CardContent>
        </Card>
      )}
      <button onClick={handleLeaveGroup} className={styles.leaveButton}>
        <FontAwesomeIcon icon={faSignOutAlt} /> Quitter le groupe
      </button>
      {showModal && (
        <Modal
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}
      {/* Supprimez ou commentez cette section */}
      {/*
      {userStatus && userStatus.searchInitiated && (
        <div>
          <h3>État de la recherche de groupe</h3>
          <p>La recherche de groupe est en cours.</p>
        </div>
      )}
      */}
    </div>
  );
};

export default GroupDetails;