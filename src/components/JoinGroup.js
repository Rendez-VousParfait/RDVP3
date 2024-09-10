import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase'; // Assurez-vous que ces imports sont corrects
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const JoinGroup = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const joinGroup = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          // Redirigez vers la page de connexion si l'utilisateur n'est pas connecté
          navigate('/login', { state: { from: `/join-group/${groupId}` } });
          return;
        }

        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) {
          throw new Error("Le groupe n'existe pas");
        }

        await updateDoc(groupRef, {
          members: arrayUnion(user.email)
        });

        // Redirigez vers la page du groupe après avoir rejoint
        navigate(`/groups/${groupId}`);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    joinGroup();
  }, [groupId, navigate]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return null; // Ce composant ne rend rien car il redirige immédiatement
};

export default JoinGroup;