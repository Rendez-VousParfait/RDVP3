// UserGroups.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, arrayRemove } from 'firebase/firestore';
import styles from './UserGroups.module.css';

const UserGroups = ({ userId, onGroupsChange }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchUserGroups();
  }, [userId]);

  const fetchUserGroups = async () => {
    try {
      console.log("Fetching groups for user:", userId);
      const q = query(collection(db, "groups"), where("members", "array-contains", userId));
      const querySnapshot = await getDocs(q);
      const fetchedGroups = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched groups:", fetchedGroups);
      setGroups(fetchedGroups);
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes:", error);
    }
  };

  const leaveGroup = async (groupId) => {
    try {
      console.log("Leaving group:", groupId);
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        members: arrayRemove(userId)
      });
      console.log("Successfully left group");
      fetchUserGroups(); // Refresh the list
      if (onGroupsChange) onGroupsChange(); // Notify parent component
    } catch (error) {
      console.error("Erreur lors du départ du groupe:", error);
    }
  };

  if (groups.length === 0) {
    return <p className={styles.noGroups}>Vous n'avez pas encore de groupes.</p>;
  }

  return (
    <div className={styles.userGroups}>
      <h3>Mes Groupes</h3>
      {groups.map(group => (
        <div key={group.id} className={styles.groupItem}>
          <h4>{group.name}</h4>
          <p>Créateur: {group.createdBy}</p>
          <p>Membres: {group.members.join(', ')}</p>
          <p>Invités: {group.invitedMembers ? group.invitedMembers.join(', ') : 'Aucun'}</p>
          <button onClick={() => leaveGroup(group.id)}>Quitter le groupe</button>
        </div>
      ))}
    </div>
  );
};

export default UserGroups;