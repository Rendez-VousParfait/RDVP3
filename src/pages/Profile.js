import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const { user, userData } = useContext(AuthContext);
  const [preferences, setPreferences] = useState({
    activities: false,
    restaurants: false,
    outdoor: false,
    musicGenres: [],
    favoriteCuisine: "",
    preferredTime: "",
    travel: false,
    reading: false,
    gaming: false,
    favoriteSport: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPreferences(docSnap.data().preferences || preferences);
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { preferences }, { merge: true });
      setEditMode(false);
      alert("Préférences enregistrées avec succès !");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!user) {
    return <p>Veuillez vous connecter pour voir votre profil.</p>;
  }

  return (
    <div className="profile-container">
      <h2>Profil</h2>
      <div className="user-info">
        <img
          src={userData?.photoURL || "/default-profile.png"}
          alt="Profile"
          className="profile-image"
        />
        <p>
          <strong>Nom:</strong> {userData?.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Téléphone:</strong> {userData?.phone}
        </p>
        <p>
          <strong>Adresse:</strong> {userData?.address}
        </p>
      </div>

      <div className="preferences-section">
        <h3>Vos préférences en matière de sorties</h3>
        {editMode ? (
          <form onSubmit={handleSubmit} className="preferences-form">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="activities"
                  checked={preferences.activities}
                  onChange={handleChange}
                />
                Activités
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="restaurants"
                  checked={preferences.restaurants}
                  onChange={handleChange}
                />
                Restaurants
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="outdoor"
                  checked={preferences.outdoor}
                  onChange={handleChange}
                />
                Activités en plein air
              </label>
            </div>
            {/* Ajoutez ici les autres champs de préférences */}
            <button type="submit" className="save-button">
              Enregistrer les préférences
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setEditMode(false)}
            >
              Annuler
            </button>
          </form>
        ) : (
          <div className="preferences-display">
            <p>
              <span>Activités:</span>{" "}
              <span>{preferences.activities ? "Oui" : "Non"}</span>
            </p>
            <p>
              <span>Restaurants:</span>{" "}
              <span>{preferences.restaurants ? "Oui" : "Non"}</span>
            </p>
            <p>
              <span>Activités en plein air:</span>{" "}
              <span>{preferences.outdoor ? "Oui" : "Non"}</span>
            </p>
            {/* Affichez ici les autres préférences */}
            <button className="edit-button" onClick={() => setEditMode(true)}>
              Modifier les préférences
            </button>
          </div>
        )}
      </div>
      <button onClick={handleLogout} className="logout-button">
        Se déconnecter
      </button>
    </div>
  );
}

export default Profile;
