import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserPlus,
  faPlus,
  faSync,
  faSearch,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./GroupManager.module.css";
import { fetchUserGroups, createGroup, joinGroup } from "./GroupUtils";
import { useAuth } from "../hooks/useAuth";
import { AppContext } from "../context/AppContext";
import GroupCreationStep from "./GroupCreationStep"; // Ajoutez cette ligne

const GroupManager = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const { groupId: urlGroupId } = useParams();

  const [selectedOption, setSelectedOption] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [groupId, setGroupId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [invitationGroupId, setInvitationGroupId] = useState(null);

  // Supprimez ces lignes car elles ne sont plus utilisées
  // const [userGroups, setUserGroups] = useState([]);
  // const [error, setError] = useState(null);

  useEffect(() => {
    if (user && !authLoading && !state.userGroups) {
      dispatch({ type: "SET_LOADING", payload: true });
      fetchUserGroups(user.email)
        .then(groups => {
          dispatch({ type: "SET_USER_GROUPS", payload: groups });
        })
        .catch(error => {
          dispatch({ type: "SET_ERROR", payload: error.message });
        })
        .finally(() => {
          dispatch({ type: "SET_LOADING", payload: false });
        });
    }
  }, [user, authLoading, dispatch, state.userGroups]);

  useEffect(() => {
    if (currentStep === 4 && groupId) {
      navigate(`/groups/${groupId}`);
    }
  }, [currentStep, groupId, navigate]);

  useEffect(() => {
    if (urlGroupId) {
      setInvitationGroupId(urlGroupId);
      setCurrentStep(3);
      setSelectedOption("join");
      setGroupId(urlGroupId);
    }
  }, [urlGroupId]);

  const fetchGroups = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const fetchedGroups = await fetchUserGroups(user.email);
      dispatch({ type: "SET_USER_GROUPS", payload: fetchedGroups });
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes :", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowOptions = () => {
    setCurrentStep(2);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setCurrentStep(3);
  };

  const handleGroupCreated = async (newGroupName) => {
    try {
      const newGroupId = await createGroup(newGroupName, user.uid, user.email);
      setGroupId(newGroupId);
      setCurrentStep(4);
      dispatch({ type: "SET_LOADING", payload: true });
      const updatedGroups = await fetchUserGroups(user.email);
      dispatch({ type: "SET_USER_GROUPS", payload: updatedGroups });
      dispatch({ type: "SET_LOADING", payload: false });
      return newGroupId;
    } catch (error) {
      console.error("Erreur lors de la création du groupe:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const handleJoinGroup = async () => {
    const idToJoin = invitationGroupId || groupId.trim();
    if (idToJoin) {
      try {
        await joinGroup(idToJoin, user.email);
        fetchGroups();
        navigate(`/groups/${idToJoin}`);
      } catch (error) {
        console.error(
          "Erreur lors de la tentative de rejoindre le groupe:",
          error,
        );
        // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
      }
    }
  };

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  const filteredGroups = state.userGroups ? state.userGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const renderGroupList = () => {
    if (!state.userGroups) {
      return <div className={styles.loading}>Chargement des groupes...</div>;
    }

    return (
      <ul className={styles.groupList}>
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <li
              key={group.id}
              className={styles.groupItem}
              onClick={() => handleGroupClick(group.id)}
            >
              <h3>{group.name}</h3>
              <p>{group.members.length} membres</p>
            </li>
          ))
        ) : (
          <li>Aucun groupe trouvé</li>
        )}
      </ul>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className={styles.section}>
              <h3>Mes groupes</h3>
              <div className={styles.options}>
                <button onClick={handleShowOptions}>
                  <FontAwesomeIcon icon={faPlus} /> Créer ou rejoindre un groupe
                </button>
                <button onClick={fetchGroups} disabled={isLoading}>
                  <FontAwesomeIcon icon={faSync} spin={isLoading} />
                  {isLoading ? "Rafraîchissement..." : "Rafraîchir les groupes"}
                </button>
              </div>
              <div className={styles.searchBar}>
                <FontAwesomeIcon icon={faSearch} />
                <input
                  type="text"
                  placeholder="Rechercher un groupe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {renderGroupList()}
            </div>
          </>
        );
      case 2:
        return (
          <div className={styles.section}>
            <h3>Choisissez une option</h3>
            <div className={styles.options}>
              <button onClick={() => handleOptionClick("create")}>
                <FontAwesomeIcon icon={faUsers} /> Créer un groupe
              </button>
              <button onClick={() => handleOptionClick("join")}>
                <FontAwesomeIcon icon={faUserPlus} /> Rejoindre un groupe
              </button>
            </div>
          </div>
        );
      case 3:
        if (selectedOption === "create") {
          return (
            <div className={styles.section}>
              <h3>Créer un nouveau groupe</h3>
              <GroupCreationStep onGroupCreated={handleGroupCreated} />
            </div>
          );
        } else if (selectedOption === "join") {
          return (
            <div className={styles.section}>
              <h3>
                {invitationGroupId
                  ? "Rejoindre le groupe via invitation"
                  : "Rejoindre un groupe existant"}
              </h3>
              <div className={styles.joinGroup}>
                {!invitationGroupId && (
                  <input
                    type="text"
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    placeholder="Identifiant du groupe"
                  />
                )}
                <button
                  onClick={handleJoinGroup}
                  disabled={!groupId && !invitationGroupId}
                >
                  <FontAwesomeIcon icon={faUserPlus} /> Rejoindre
                </button>
              </div>
            </div>
          );
        }
        break;
      case 4:
        return null;
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (authLoading) {
      return <div className={styles.loadingIndicator}><FontAwesomeIcon icon={faSpinner} spin /> Chargement de l'authentification...</div>;
    }

    if (!user) {
      navigate("/login");
      return null;
    }

    return (
      <>
        <h2>Gestion des Groupes</h2>
        {state.error && <div className={styles.error}>Erreur : {state.error}</div>}
        {renderStep()}
      </>
    );
  };

  return (
    <div className={styles.groupManager}>
      {renderContent()}
    </div>
  );
};

export default GroupManager;
