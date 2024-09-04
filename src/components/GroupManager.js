// UserGroups.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, arrayRemove } from 'firebase/firestore';
import styles from './UserGroups.module.css';

const UserGroups = ({ userId }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchUserGroups();
  }, [userId]);

  const fetchUserGroups = async () => {
    const q = query(collection(db, "groups"), where("members", "array-contains", userId));
    const querySnapshot = await getDocs(q);
    const fetchedGroups = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setGroups(fetchedGroups);
  };

  const leaveGroup = async (groupId) => {
    try {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        members: arrayRemove(userId)
      });
      fetchUserGroups(); // Refresh the list
    } catch (error) {
      console.error("Erreur lors du départ du groupe:", error);
    }
  };

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