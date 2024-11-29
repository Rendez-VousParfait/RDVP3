import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faHeart,
  faUserGroup,
  faUtensils,
  faPersonWalking,
  faSignOutAlt,
  faClock,
  faLocationDot,
  faCalendarAlt,
  faCamera,
  faEdit
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Profile.module.css";

function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const translateExperienceType = (type) => {
    const translations = {
      'authentic': 'Lieux authentiques et locaux',
      'luxury': 'Cadre confortable et luxueux',
      'original': 'Activités originales et insolites',
      'cultural': 'Expériences culturelles enrichissantes',
      'festive': 'Moments festifs et animés'
    };
    return translations[type] || type || "Non renseigné";
  };

  const translateActivity = (activity) => {
    const translations = {
      'restaurants': 'Restaurants & Bars',
      'outdoor': 'Activités plein air',
      'cultural': 'Événements culturels',
      'relaxation': 'Détente & Spa'
    };
    return translations[activity] || activity;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setError("Profil non trouvé");
        }
      } catch (error) {
        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user && !loading) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!userData) {
    return <div className={styles.error}>Aucune donnée utilisateur trouvée</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <div className={styles.bannerOverlay} />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.profileImageWrapper}>
            <div className={styles.profileImage}>
              <img 
                src={userData.profilePictureUrl || "/default-avatar.png"} 
                alt="Avatar" 
              />
              <button className={styles.editPhotoButton}>
                <FontAwesomeIcon icon={faCamera} />
              </button>
            </div>
          </div>
          <h1>{userData.username || "Utilisateur"}</h1>
          <div className={styles.userInfo}>
            <p>
              <FontAwesomeIcon icon={faEnvelope} />
              {userData.email}
            </p>
            <p>
              <FontAwesomeIcon icon={faLocationDot} />
              {userData.address || "Adresse non renseignée"}
            </p>
            <p>
              <FontAwesomeIcon icon={faCalendarAlt} />
              Membre depuis {userData.createdAt?.toDate().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className={styles.personalitySection}>
          <h2 className={styles.sectionTitle}>Votre Personnalité Voyageur</h2>
          
          <div className={styles.personalityCards}>
            <div className={styles.personalityCard}>
              <div className={styles.cardHeader}>
                <FontAwesomeIcon icon={faHeart} className={styles.icon} />
                <h3>Style de Voyage</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.trait}>
                  <span className={styles.traitLabel}>Type d'Expérience</span>
                  <span className={styles.traitValue}>
                    {translateExperienceType(userData.preferences?.experienceType)}
                  </span>
                </div>
                <div className={styles.trait}>
                  <span className={styles.traitLabel}>Rythme</span>
                  <span className={styles.traitValue}>
                    {userData.preferences?.pace === 0 ? '🌿 Tranquille' :
                     userData.preferences?.pace === 1 ? '⚡️ Modéré' :
                     userData.preferences?.pace === 2 ? '🔥 Dynamique' :
                     "Non défini"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.personalityCard}>
              <div className={styles.cardHeader}>
                <FontAwesomeIcon icon={faUserGroup} className={styles.icon} />
                <h3>Dynamique de Groupe</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.trait}>
                  <span className={styles.traitLabel}>Rôle Préféré</span>
                  <span className={styles.traitValue}>
                    {userData.preferences?.groupRole === 'organizer' ? '👑 Leader' :
                     userData.preferences?.groupRole === 'follower' ? '🌟 Participant' :
                     userData.preferences?.groupRole === 'motivator' ? '🎯 Motivateur' :
                     "Non défini"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.personalityCard}>
              <div className={styles.cardHeader}>
                <FontAwesomeIcon icon={faPersonWalking} className={styles.icon} />
                <h3>Activités Favorites</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.trait}>
                  <span className={styles.traitLabel}>Week-end & Loisirs</span>
                </div>
                <div className={styles.activityTags}>
                  {userData.preferences?.weekendActivities?.map((activity, index) => (
                    <span key={index} className={styles.tag}>
                      {activity === 'restaurants' ? '🍽️ ' :
                       activity === 'outdoor' ? '🌲 ' :
                       activity === 'cultural' ? '🎭 ' :
                       activity === 'relaxation' ? '🧘‍♂️ ' : ''}
                      {translateActivity(activity)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.personalityCard}>
              <div className={styles.cardHeader}>
                <FontAwesomeIcon icon={faUtensils} className={styles.icon} />
                <h3>Préférences Culinaires</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.trait}>
                  <span className={styles.traitLabel}>Types de cuisine</span>
                </div>
                <div className={styles.cuisineTags}>
                  {userData.preferences?.cuisineTypes?.map((type, index) => (
                    <span key={index} className={styles.tag}>
                      {type === 'traditional' ? '🇫🇷 Traditionnelle' :
                       type === 'exotic' ? '🌏 Exotique' :
                       type === 'gastronomic' ? '⭐️ Gastronomique' :
                       type === 'vegetarian' ? '🥗 Végétarienne' :
                       type === 'brasserie' ? '🍺 Brasserie' : type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actionsSection}>
          <button className={styles.editButton}>
            <FontAwesomeIcon icon={faEdit} />
            Modifier mes préférences
          </button>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile; 