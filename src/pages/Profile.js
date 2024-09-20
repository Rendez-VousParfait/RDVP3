import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth, db, storage } from "../firebase";
import { signOut, deleteUser } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const { user, userData } = useContext(AuthContext);
  const [preferences, setPreferences] = useState({
    AccommodationPreferences: "",
    ReactestaurantPreferences: "",
    ActivityPreferences: "",
    dietaryRestrictions: "",
    interests: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageUpload, setImageUpload] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userInfo, setUserInfo] = useState({
    username: "",
    phone: "",
    address: "",
  });
  const [history, setHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPreferences({
            AccommodationPreferences: data.preferences?.AccommodationPreferences || "",
            ReactestaurantPreferences:
              data.preferences?.RestaurantPreferences || "",
            ActivityPreferences: data.preferences?.ActivityPreferences || "",
            dietaryRestrictions: data.preferences?.dietaryRestrictions || "",
            interests: Array.isArray(data.preferences?.interests)
              ? data.preferences.interests
              : [],
          });
          setUserInfo({
            username: data.username || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        }
        const historyRef = collection(db, "users", user.uid, "history");
        const historySnap = await getDocs(historyRef);
        const historyData = historySnap.docs.map((doc) => doc.data());
        setHistory(historyData);
      } else {
        navigate("/login");
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user, navigate]);

  const handleImageChange = (e) => {
    setImageUpload(e.target.files[0]);
  };

  const handleImageUpload = () => {
    if (!imageUpload) {
      alert("Veuillez sélectionner une image avant d'uploader.");
      return;
    }

    const storageRef = ref(storage, `profileImages/${user.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, imageUpload);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Erreur lors de l'upload de l'image:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { photoURL: downloadURL }, { merge: true });
        alert("Photo de profil mise à jour avec succès !");
      },
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestsChange = (e) => {
    const value = e.target.value;
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((item) => item !== value)
        : [...prev.interests, value],
    }));
  };

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { preferences, ...userInfo }, { merge: true });
      await addDoc(collection(db, "users", user.uid, "history"), {
        timestamp: new Date(),
        preferences,
      });
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

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      )
    ) {
      try {
        await deleteUser(user);
        navigate("/");
      } catch (error) {
        console.error("Erreur lors de la suppression du compte", error);
      }
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleVoiceInput = (field) => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInfo((prev) => ({
        ...prev,
        [field]: transcript,
      }));
    };
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!user) {
    return <p>Veuillez vous connecter pour voir votre profil.</p>;
  }

  return (
    <div className={`profile-container ${isDarkMode ? "dark-mode" : ""}`}>
      <h2>Profil</h2>
      <button onClick={toggleDarkMode} className="theme-toggle-button">
        {isDarkMode ? "Mode Clair" : "Mode Sombre"}
      </button>
      <div className="user-info">
        <div className="profile-image-wrapper">
          <img
            src={userData?.photoURL || "/default-profile.png"}
            alt="Profile"
            className="profile-image"
          />
        </div>
        {editMode ? (
          <div>
            <div className="input-group">
              <input
                type="text"
                name="username"
                value={userInfo.username}
                onChange={handleUserInfoChange}
                placeholder="Nom"
              />
              <button
                type="button"
                onClick={() => handleVoiceInput("username")}
                className="voice-input-button"
              >
                🎤
              </button>
            </div>
            <div className="input-group">
              <input
                type="text"
                name="phone"
                value={userInfo.phone}
                onChange={handleUserInfoChange}
                placeholder="Téléphone"
              />
              <button
                type="button"
                onClick={() => handleVoiceInput("phone")}
                className="voice-input-button"
              >
                🎤
              </button>
            </div>
            <div className="input-group">
              <input
                type="text"
                name="address"
                value={userInfo.address}
                onChange={handleUserInfoChange}
                placeholder="Adresse"
              />
              <button
                type="button"
                onClick={() => handleVoiceInput("address")}
                className="voice-input-button"
              >
                🎤
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p>
              <strong>Nom:</strong> {userInfo.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Téléphone:</strong> {userInfo.phone}
            </p>
            <p>
              <strong>Adresse:</strong> {userInfo.address}
            </p>
          </div>
        )}
      </div>

      <div className="image-upload-section">
        <label className="upload-label" htmlFor="profileImage">
          Choisir une photo
        </label>
        <input
          type="file"
          id="profileImage"
          className="image-input"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button onClick={handleImageUpload} className="upload-button">
          Télécharger
        </button>
        {uploadProgress > 0 && (
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="preferences-section">
        <h3>Vos préférences</h3>
        {editMode ? (
          <form onSubmit={handleSubmit} className="preferences-form">
            <textarea
              name="AccommodationPreferences"
              value={preferences.AccommodationPreferences}
              onChange={handleChange}
              placeholder="Préférences pour les hôtels"
            />
            <textarea
              name="RestaurantPreferences"
              value={preferences.RestaurantPreferences}
              onChange={handleChange}
              placeholder="Préférences pour les restaurants"
            />
            <textarea
              name="ActivityPreferences"
              value={preferences.ActivityPreferences}
              onChange={handleChange}
              placeholder="Préférences pour les activités"
            />
            <input
              type="text"
              name="dietaryRestrictions"
              value={preferences.dietaryRestrictions}
              onChange={handleChange}
              placeholder="Régime alimentaire ou restrictions"
            />
            <div>
              <p>Centres d'intérêt :</p>
              <label>
                <input
                  type="checkbox"
                  value="sport"
                  checked={preferences.interests.includes("sport")}
                  onChange={handleInterestsChange}
                />
                Sport
              </label>
              <label>
                <input
                  type="checkbox"
                  value="culture"
                  checked={preferences.interests.includes("culture")}
                  onChange={handleInterestsChange}
                />
                Culture
              </label>
              {/* Ajoutez d'autres intérêts selon vos besoins */}
            </div>
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
              <span>Préférences hôtels :</span> {preferences.AccommodationPreferences}
            </p>
            <p>
              <span>Préférences restaurants :</span>{" "}
              {preferences.RestaurantPreferences}
            </p>
            <p>
              <span>Préférences activités :</span>{" "}
              {preferences.ActivityPreferences}
            </p>
            <p>
              <span>Régime alimentaire :</span>{" "}
              {preferences.dietaryRestrictions}
            </p>
            <p>
              <span>Centres d'intérêt :</span>
              {preferences.interests && Array.isArray(preferences.interests)
                ? preferences.interests.join(", ")
                : "Aucun centre d'intérêt spécifié"}
            </p>
            <button className="edit-button" onClick={() => setEditMode(true)}>
              Modifier les préférences
            </button>
          </div>
        )}
      </div>

      <div className="history-section">
        <h3>Historique des modifications</h3>
        <ul className="history-list">
          {history.map((entry, index) => (
            <li key={index} className="history-item">
              <p className="history-date">
                {new Date(entry.timestamp.seconds * 1000).toLocaleString()}
              </p>
              <ul className="history-changes">
                {Object.entries(entry.preferences).map(([key, value]) => (
                  <li key={key}>
                    {key}: {Array.isArray(value) ? value.join(", ") : value}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleLogout} className="logout-button">
        Se déconnecter
      </button>
      <button onClick={handleDeleteAccount} className="delete-button">
        Supprimer le compte
      </button>
    </div>
  );
}

export default Profile;
