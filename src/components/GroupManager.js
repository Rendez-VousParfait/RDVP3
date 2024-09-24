// GroupManager.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserPlus,
  faPlus,
  faSync,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./GroupManager.module.css";
import { AuthContext } from "../context/AuthContext";
import { fetchUserGroups, createGroup, joinGroup } from "./GroupUtils";

const GroupCreationStep = ({ onGroupCreated }) => {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (groupName.trim()) {
      await onGroupCreated(groupName.trim());
      setGroupName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.createGroupForm}>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Nom du groupe"
        required
      />
      <button type="submit">
        <FontAwesomeIcon icon={faPlus} /> Créer le groupe
      </button>
    </form>
  );
};

const GroupManager = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [groupId, setGroupId] = useState("");
  const [userGroups, setUserGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("User changed, fetching groups for:", user.email);
      fetchGroups();
    }
  }, [user]);

  const fetchGroups = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const fetchedGroups = await fetchUserGroups(user.email);
      setUserGroups(fetchedGroups);
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowOptions = () => {
    setShowOptions(true);
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
      fetchGroups();
      return newGroupId;
    } catch (error) {
      console.error("Erreur lors de la création du groupe:", error);
      throw error;
    }
  };

  const handleJoinGroup = async () => {
    if (groupId.trim()) {
      try {
        await joinGroup(groupId.trim(), user.email);
        fetchGroups();
        navigate(`/groups/${groupId.trim()}`);
      } catch (error) {
        console.error(
          "Erreur lors de la tentative de rejoindre le groupe:",
          error,
        );
      }
    }
  };

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  const filteredGroups = userGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const renderGroupList = () => (
    <ul className={styles.groupList}>
      {filteredGroups.map((group) => (
        <li
          key={group.id}
          className={styles.groupItem}
          onClick={() => handleGroupClick(group.id)}
        >
          <h3>{group.name}</h3>
          <p>{group.members.length} membres</p>
        </li>
      ))}
    </ul>
  );

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
              <h3>Rejoindre un groupe existant</h3>
              <div className={styles.joinGroup}>
                <input
                  type="text"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  placeholder="Identifiant du groupe"
                />
                <button onClick={handleJoinGroup} disabled={!groupId}>
                  <FontAwesomeIcon icon={faUserPlus} /> Rejoindre
                </button>
              </div>
            </div>
          );
        }
        break;
      case 4:
        navigate(`/groups/${groupId}`);
        return null;
      default:
        return null;
    }
  };

  return (
    <div className={styles.groupManager}>
      <h2>Gestion des Groupes</h2>
      {renderStep()}
    </div>
  );
};

export default GroupManager;
