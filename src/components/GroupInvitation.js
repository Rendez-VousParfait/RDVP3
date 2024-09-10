import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import styles from './GroupInvitation.module.css';

const GroupInvitation = () => {
  const { groupId } = useParams();
  const { user } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupAndJoin = async () => {
      if (!groupId) {
        setError("ID de groupe manquant");
        setLoading(false);
        return;
      }

      try {
        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) {
          throw new Error("Le groupe n'existe pas");
        }

        const groupData = groupSnap.data();
        setGroup(groupData);

        if (user) {
          if (!groupData.members.includes(user.email)) {
            await updateDoc(groupRef, {
              members: arrayUnion(user.email),
              lastUpdated: serverTimestamp()
            });
            console.log("Utilisateur ajouté au groupe");
          } else {
            console.log("L'utilisateur est déjà membre du groupe");
          }
          navigate(`/groups/${groupId}`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupAndJoin();
  }, [groupId, user, navigate]);

  if (loading) {
    return <div className={styles.loader}>Chargement...</div>;
  }

  if (error) {
    return <div className={styles.error}>Erreur : {error}</div>;
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <h2>Rejoindre le groupe : {group?.name}</h2>
        <p>Vous devez vous connecter ou vous inscrire pour rejoindre ce groupe.</p>
        <div className={styles.buttonContainer}>
          <button 
            className={styles.button} 
            onClick={() => navigate('/login', { state: { from: `/invitation/${groupId}` }})}>
            Se connecter
          </button>
          <button 
            className={styles.button} 
            onClick={() => navigate('/signup', { state: { from: `/invitation/${groupId}` }})}>
            S'inscrire
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default GroupInvitation;