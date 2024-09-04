import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserPlus, faPlus, faSync, faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "./GroupManagement.module.css";
import CreatGroup from "./CreatGroup";
import InviteUsers from "./InviteUsers";
import { AuthContext } from "../context/AuthContext";
import { db, functions } from "../firebase";
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, doc, getDoc, updateDoc, deleteDoc, arrayRemove } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

const GroupManagement = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groupCreated, setGroupCreated] = useState(false);
  const { user } = useContext(AuthContext);
  const [userGroups, setUserGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("User changed, fetching groups for:", user.email);
      fetchUserGroups();
    }
  }, [user]);

  const fetchUserGroups = async () => {
    if (!user) {
      console.log("No user, skipping group fetch");
      return;
    }
    setIsLoading(true);
    try {
      console.log("Fetching user groups for:", user.email);
      const groupsRef = collection(db, "groups");
      const q = query(groupsRef, 
        where("members", "array-contains", user.email),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const fetchedGroups = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched groups:", fetchedGroups);
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
      const groupData = {
        name: newGroupName,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        members: [user.email],
        invitedMembers: [],
      };

      const groupRef = await addDoc(collection(db, "groups"), groupData);
      console.log("Groupe créé avec ID: ", groupRef.id);
      setGroupId(groupRef.id);
      setGroupCreated(true);
      setGroupName(newGroupName);
      setCurrentStep(4);  // Passer à l'étape d'invitation
      return groupRef.id;
    } catch (error) {
      console.error("Erreur lors de la création du groupe:", error);
      throw error;
    }
  };

  const handleInviteSent = async ({ emails }) => {
    try {
      console.log("Début de handleInviteSent avec emails:", emails);
      console.log("GroupId au début de handleInviteSent:", groupId);

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
          groupName, 
          invitationLink: `https://votre-app.com/join-group/${groupId}` 
        });
        console.log(`Invitation envoyée à ${email}`);
      }

      console.log("Toutes les invitations ont été envoyées et le groupe a été mis à jour");
      navigate(`/groups/${groupId}`);  // Naviguer vers la page de gestion du groupe
    } catch (error) {
      console.error("Erreur lors de l'envoi des invitations :", error);
    }
  };

  const handleGroupClick = async (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  const filteredGroups = userGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderGroupList = () => (
    <div className={styles.groupList}>
      {filteredGroups.map(group => (
        <div key={group.id} className={styles.groupCard} onClick={() => handleGroupClick(group.id)}>
          <h3>{group.name}</h3>
          <p>{group.members.length} membres</p>
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    console.log("Rendering step:", currentStep);
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className={styles["initial-options"]}>
              <button
                onClick={handleShowOptions}
                className={styles["create-join-button"]}
              >
                <FontAwesomeIcon icon={faPlus} className={styles["button-icon"]} />
                <span>Créer ou rejoindre un groupe</span>
              </button>
              <button
                onClick={fetchUserGroups}
                className={styles["refresh-button"]}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faSync} className={styles["button-icon"]} spin={isLoading} />
                <span>{isLoading ? "Rafraîchissement..." : "Rafraîchir les groupes"}</span>
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
          </>
        );
      case 2:
        return (
          <div className={styles["trip-type-options"]}>
            <button
              onClick={() => handleOptionClick("create")}
              className={`${styles["trip-type-button"]} ${
                selectedOption === "create" ? styles["selected"] : ""
              }`}
            >
              <FontAwesomeIcon icon={faUsers} className={styles["trip-type-icon"]} />
              <span>Créer un groupe</span>
            </button>
            <button
              onClick={() => handleOptionClick("join")}
              className={`${styles["trip-type-button"]} ${
                selectedOption === "join" ? styles["selected"] : ""
              }`}
            >
              <FontAwesomeIcon icon={faUserPlus} className={styles["trip-type-icon"]} />
              <span>Rejoindre un groupe</span>
            </button>
          </div>
        );
      case 3:
        if (selectedOption === "create") {
          return (
            <CreatGroup
              onGroupCreated={handleGroupCreated}
              groupName={groupName}
              setGroupName={setGroupName}
            />
          );
        } else if (selectedOption === "join") {
          return (
            <div className={styles["join-group-container"]}>
              <input
                type="text"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                placeholder="Identifiant du groupe"
                className={styles["group-id-input"]}
              />
              <button
                onClick={() => navigate(`/groups/${groupId}`)}
                className={styles["next-button"]}
                disabled={!groupId}
              >
                Rejoindre
              </button>
            </div>
          );
        }
        break;
      case 4:
        return (
          <InviteUsers
            groupId={groupId}
            onInviteSent={handleInviteSent}
            personCount="5"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles["search-step"]}>
      <h2 className={styles["step-title"]}>Gestion des Groupes</h2>
      {renderStep()}
    </div>
  );
};

export default GroupManagement;