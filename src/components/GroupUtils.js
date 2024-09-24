// GroupUtils.js
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
  try {
    const groupsRef = collection(db, "groups");
    const q = query(
      groupsRef,
      where("members", "array-contains", userEmail),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes :", error);
    throw error;
  }
};

export const createGroup = async (name, userId, userEmail) => {
  try {
    const groupData = {
      name,
      createdAt: serverTimestamp(),
      createdBy: userId,
      members: [userEmail],
      invitedMembers: [],
    };
    const groupRef = await addDoc(collection(db, "groups"), groupData);
    return groupRef.id;
  } catch (error) {
    console.error("Erreur lors de la création du groupe:", error);
    throw error;
  }
};

export const fetchGroupDetails = async (groupId) => {
  try {
    const groupDoc = await getDoc(doc(db, "groups", groupId));
    if (groupDoc.exists()) {
      return { id: groupDoc.id, ...groupDoc.data() };
    } else {
      throw new Error("Group not found");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails du groupe:",
      error,
    );
    throw error;
  }
};

export const inviteToGroup = async (groupId, email, groupName) => {
  try {
    const sendInvitationEmail = httpsCallable(functions, "sendInvitationEmail");
    await sendInvitationEmail({ email, groupName, groupId });

    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
      invitedMembers: arrayUnion(email),
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error("Erreur lors de l'invitation à rejoindre le groupe:", error);
    throw error;
  }
};

export const leaveGroup = async (groupId, userEmail) => {
  try {
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
      members: arrayRemove(userEmail),
    });

    // Vérifier si le groupe est vide après le départ du membre
    const updatedGroup = await getDoc(groupRef);
    if (updatedGroup.exists() && updatedGroup.data().members.length === 0) {
      // Si le groupe est vide, le supprimer
      await deleteDoc(groupRef);
    }
  } catch (error) {
    console.error("Erreur lors de la tentative de quitter le groupe:", error);
    throw error;
  }
};

export const joinGroup = async (groupId, userEmail) => {
  try {
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
      members: arrayUnion(userEmail),
      invitedMembers: arrayRemove(userEmail),
    });
    return fetchGroupDetails(groupId);
  } catch (error) {
    console.error("Erreur lors de la tentative de rejoindre le groupe:", error);
    throw error;
  }
};

export const removeGroupMember = async (
  groupId,
  memberEmail,
  currentUserEmail,
) => {
  try {
    const groupRef = doc(db, "groups", groupId);
    const groupDoc = await getDoc(groupRef);

    if (!groupDoc.exists()) {
      throw new Error("Le groupe n'existe pas");
    }

    const groupData = groupDoc.data();
    if (groupData.createdBy !== currentUserEmail) {
      throw new Error("Seul le créateur du groupe peut supprimer des membres");
    }

    await updateDoc(groupRef, {
      members: arrayRemove(memberEmail),
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du membre du groupe:", error);
    throw error;
  }
};

export const updateGroupPreferences = async (groupId, preferences) => {
  try {
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
      preferences: preferences,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des préférences du groupe:",
      error,
    );
    throw error;
  }
};

export const checkGroupStatus = async (groupId) => {
  try {
    const groupDoc = await getDoc(doc(db, "groups", groupId));
    if (!groupDoc.exists()) {
      throw new Error("Le groupe spécifié n'existe pas.");
    }
    const groupData = groupDoc.data();
    const allMembersSubmitted = groupData.members.every(
      (member) =>
        groupData.memberPreferences && groupData.memberPreferences[member],
    );
    return {
      allMembersSubmitted,
      groupData: {
        tripType: groupData.tripType,
        dates: groupData.dates,
        budget: groupData.budget,
        personCount: groupData.members ? groupData.members.length : 1,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la vérification du statut du groupe:", error);
    throw error;
  }
};
