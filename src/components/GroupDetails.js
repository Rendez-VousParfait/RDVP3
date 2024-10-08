import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faSignOutAlt,
  faSearch,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import {
  fetchGroupDetails,
  inviteToGroup,
  leaveGroup,
  fetchSavedSearch,
} from "./GroupUtils";
import { Card, CardContent, Typography } from "@mui/material";
import styles from "./GroupDetails.module.css";

const GroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedSearch, setSavedSearch] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const loadGroupDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const groupData = await fetchGroupDetails(groupId);
      setGroup(groupData);
      const savedSearchData = await fetchSavedSearch(groupId);
      setSavedSearch(savedSearchData);
    } catch (err) {
      console.error("Erreur lors du chargement des détails du groupe:", err);
      setError("Erreur lors du chargement des détails du groupe");
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId) {
      loadGroupDetails();
    }
  }, [groupId, loadGroupDetails]);

  useEffect(() => {
    console.log("savedSearch:", savedSearch);
  }, [savedSearch]);

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

  const handleGroupSearch = () => {
    if (user && user.email === group.creator) {
      navigate("/search", { state: { groupId: groupId } });
    } else {
      setError(
        "Seul le créateur du groupe peut lancer une nouvelle recherche.",
      );
    }
  };

  const handleViewSavedSearch = () => {
    console.log("Navigating to search results with groupId:", groupId);
    navigate(`/group/${groupId}/search-results`);
  };

  if (isLoading) return <div className={styles.loading}>Chargement...</div>;
  if (error) return <div className={styles.error}>Erreur : {error}</div>;
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
        <button onClick={handleGroupSearch} className={styles.searchButton}>
          <FontAwesomeIcon icon={faSearch} /> Lancer la recherche de groupe
        </button>
      )}
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
    </div>
  );
};

export default GroupDetails;
