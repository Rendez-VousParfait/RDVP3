import { db, functions } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  doc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

export const fetchUserGroups = async (userEmail) => {
  console.log("Fetching user groups for:", userEmail);
  try {
    const groupsRef = collection(db, "groups");
    const q = query(
      groupsRef,
      where("members", "array-contains", userEmail),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    const groups = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Fetched groups:", groups);
    return groups;
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes :", error);
    throw error;
  }
};

export const createGroup = async (name, userId, userEmail) => {
  console.log("Creating group:", { name, userId, userEmail });
  try {
    if (typeof name !== "string" || name.trim() === "") {
      throw new Error("Le nom du groupe doit être une chaîne de caractères non vide");
    }
    
    const groupData = {
      name: name.trim(),
      createdAt: serverTimestamp(),
      createdBy: userEmail,
      creator: userEmail,
      members: [userEmail],
      invitedMembers: [],
      searchInitiated: false,
    };
    const groupRef = await addDoc(collection(db, "groups"), groupData);
    console.log("Group created with ID:", groupRef.id);
    return groupRef.id;
  } catch (error) {
    console.error("Erreur lors de la création du groupe:", error);
    throw error;
  }
};

export const fetchGroupDetails = async (groupId) => {
  console.log("Fetching group details for:", groupId);
  try {
    const groupDoc = await getDoc(doc(db, "groups", groupId));
    if (groupDoc.exists()) {
      const groupData = { id: groupDoc.id, ...groupDoc.data() };
      console.log("Fetched group details:", groupData);
      return groupData;
    } else {
      console.error("Group not found:", groupId);
      throw new Error("Group not found");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du groupe:", error);
    throw error;
  }
};

export const inviteToGroup = async (groupId, email, groupName) => {
  console.log("Inviting to group:", { groupId, email, groupName });
  try {
    const sendInvitationEmail = httpsCallable(functions, "sendInvitationEmail");
    await sendInvitationEmail({ email, groupName, groupId });

    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
      invitedMembers: arrayUnion(email),
      lastUpdated: serverTimestamp(),
    });
    console.log("Invitation sent and group updated");
  } catch (error) {
    console.error("Erreur lors de l'invitation à rejoindre le groupe:", error);
    throw error;
  }
};

export const leaveGroup = async (groupId, userEmail) => {
  console.log("Leaving group:", { groupId, userEmail });
  try {
    const groupRef = doc(db, "groups", groupId);
    const groupDoc = await getDoc(groupRef);
    const groupData = groupDoc.data();

    if (groupData.creator === userEmail) {
      console.error("Le créateur ne peut pas quitter le groupe");
      throw new Error("Le créateur ne peut pas quitter le groupe");
    }

    await updateDoc(groupRef, {
      members: arrayRemove(userEmail),
    });

    const updatedGroup = await getDoc(groupRef);
    if (updatedGroup.exists() && updatedGroup.data().members.length === 0) {
      await deleteDoc(groupRef);
      console.log("Group deleted as it became empty");
    } else {
      console.log("User removed from group");
    }
  } catch (error) {
    console.error("Erreur lors de la tentative de quitter le groupe:", error);
    throw error;
  }
};

export const joinGroup = async (groupId, userEmail) => {
  console.log("Joining group:", { groupId, userEmail });
  try {
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
      members: arrayUnion(userEmail),
      invitedMembers: arrayRemove(userEmail),
    });
    const updatedGroup = await fetchGroupDetails(groupId);
    console.log("User joined group. Updated group:", updatedGroup);
    return updatedGroup;
  } catch (error) {
    console.error("Erreur lors de la tentative de rejoindre le groupe:", error);
    throw error;
  }
};

export const removeGroupMember = async (groupId, memberEmail, currentUserEmail) => {
  console.log("Removing group member:", { groupId, memberEmail, currentUserEmail });
  try {
    const groupRef = doc(db, "groups", groupId);
    const groupDoc = await getDoc(groupRef);

    if (!groupDoc.exists()) {
      console.error("Le groupe n'existe pas:", groupId);
      throw new Error("Le groupe n'existe pas");
    }

    const groupData = groupDoc.data();
    if (groupData.creator !== currentUserEmail) {
      console.error("Seul le créateur du groupe peut supprimer des membres");
      throw new Error("Seul le créateur du groupe peut supprimer des membres");
    }

    if (memberEmail === groupData.creator) {
      console.error("Le créateur ne peut pas être supprimé du groupe");
      throw new Error("Le créateur ne peut pas être supprimé du groupe");
    }

    await updateDoc(groupRef, {
      members: arrayRemove(memberEmail),
    });
    console.log("Member removed from group");
  } catch (error) {
    console.error("Erreur lors de la suppression du membre du groupe:", error);
    throw error;
  }
};

export const updateGroupPreferences = async (groupId, preferences) => {
  console.log("Updating group preferences:", { groupId, preferences });
  try {
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
      preferences: preferences,
      lastUpdated: serverTimestamp(),
    });
    console.log("Group preferences updated");
  } catch (error) {
    console.error("Erreur lors de la mise à jour des préférences du groupe:", error);
    throw error;
  }
};

export const checkGroupStatus = async (groupId, userEmail) => {
  console.log("Checking group status:", { groupId, userEmail });
  try {
    const groupDoc = await getDoc(doc(db, "groups", groupId));
    if (!groupDoc.exists()) {
      console.error("Le groupe spécifié n'existe pas:", groupId);
      throw new Error("Le groupe spécifié n'existe pas.");
    }
    const groupData = groupDoc.data();
    
    const canInitiateSearch = groupData.members.length >= 2;
    const userRole = groupData.creator === userEmail ? "creator" : "member";
    
    return {
      isCreator: groupData.creator === userEmail,
      searchInitiated: groupData.searchInitiated || false,
      canInitiateSearch,
      hasSubmittedPreferences: groupData.memberPreferences && groupData.memberPreferences[userEmail],
      groupData: {
        tripType: groupData.tripType,
        dates: groupData.dates,
        budget: groupData.budget,
        personCount: groupData.members.length
      },
      savedSearch: groupData.savedSearch || null,
      userRole // Ajoutez cette ligne pour utiliser userRole
    };
  } catch (error) {
    console.error("Erreur lors de la vérification du statut du groupe:", error);
    throw error;
  }
};

export const fetchSavedSearch = async (groupId) => {
  console.log("Fetching saved search for group:", groupId);
  try {
    const groupDoc = await getDoc(doc(db, "groups", groupId));
    if (groupDoc.exists()) {
      const groupData = groupDoc.data();
      const savedSearch = groupData.savedSearch || null;
      console.log("Fetched saved search:", savedSearch);
      return savedSearch;
    } else {
      console.error("Group not found:", groupId);
      throw new Error("Group not found");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la recherche sauvegardée:", error);
    throw error;
  }
};

export const saveGroupSearch = async (groupId, searchResults) => {
  console.log("Saving group search:", { groupId, searchResults });
  if (!groupId || typeof groupId !== "string") {
    console.error("GroupId invalide:", groupId);
    throw new Error("GroupId invalide");
  }
  try {
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
      savedSearch: searchResults,
      lastUpdated: serverTimestamp(),
    });
    console.log("Recherche sauvegardée avec succès dans Firestore");
  } catch (error) {
    console.error("Erreur détaillée lors de la sauvegarde de la recherche de groupe:", error);
    throw error;
  }
};

export const initiateGroupSearch = async (groupId) => {
  console.log("Initiating group search:", groupId);
  try {
    const groupRef = doc(db, "groups", groupId);
    const groupDoc = await getDoc(groupRef);
    
    if (!groupDoc.exists()) {
      throw new Error("Le groupe spécifié n'existe pas.");
    }
    
    const groupData = groupDoc.data();
    
    if (groupData.members.length < 2) {
      throw new Error("Il faut au moins deux membres dans le groupe pour lancer la recherche.");
    }
    
    await updateDoc(groupRef, {
      searchInitiated: true,
      lastUpdated: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'initiation de la recherche de groupe:", error);
    throw error;
  }
};

export const saveGroupParticipation = async (groupId, userEmail, searchResults) => {
  console.log("Saving group participation:", { groupId, userEmail, searchResults });
  try {
    const saveParticipationFunction = httpsCallable(functions, "saveGroupParticipation");
    const result = await saveParticipationFunction({ groupId, searchResults });
    console.log(`Participation sauvegardée avec succès pour l'utilisateur ${userEmail} dans le groupe ${groupId}. Result:`, result);

    // Mettre à jour la participation de l'utilisateur dans Firestore
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
      [`memberParticipations.${userEmail}`]: searchResults,
      lastUpdated: serverTimestamp(),
    });

    return result;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la participation:", error);
    throw error;
  }
};

// Ajoutez ces fonctions si elles n'existent pas déjà
export const fetchGroupMembersPreferences = async (groupId) => {
  // Implémentez la logique pour récupérer les préférences des membres du groupe
  console.log("Fetching group members preferences for:", groupId);
  // ... logique de récupération ...
};

export const performGroupSearch = async (groupId) => {
  console.log("Performing group search for:", groupId);
  try {
    const performGroupSearchFunction = httpsCallable(functions, "performGroupSearch");
    const result = await performGroupSearchFunction({ groupId });
    console.log("Group search results:", result.data);
    return result.data;
  } catch (error) {
    console.error("Erreur lors de la recherche de groupe:", error);
    throw error;
  }
};

// Assurez-vous que ces fonctions sont incluses dans l'export par défaut
export default {
  fetchUserGroups,
  createGroup,
  fetchGroupDetails,
  inviteToGroup,
  leaveGroup,
  joinGroup,
  removeGroupMember,
  updateGroupPreferences,
  checkGroupStatus,
  fetchSavedSearch,
  saveGroupSearch,
  initiateGroupSearch,
  saveGroupParticipation,
  fetchGroupMembersPreferences,
  performGroupSearch,
};
