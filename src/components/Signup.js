import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, storage } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faPhone,
  faMapMarkerAlt,
  faImage,
  faPlane,
  faHotel,
  faUtensils,
  faLanguage,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const Signup = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    profilePicture: null,
    travelPreferences: {
      type: "",
      accommodation: [],
      activities: [],
      cuisine: [],
    },
    languages: [],
    destinations: [],
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: e.target.files[0],
      }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const user = userCredential.user;

      let profilePictureUrl = "";
      if (formData.profilePicture) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        const uploadTask = uploadBytesResumable(
          storageRef,
          formData.profilePicture,
        );
        await uploadTask;
        profilePictureUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        profilePictureUrl: profilePictureUrl,
        travelPreferences: formData.travelPreferences,
        languages: formData.languages,
        destinations: formData.destinations,
      });

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: user.displayName,
        profilePictureUrl: user.photoURL,
      });
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  const renderProgressBar = () => (
    <div className="progressIndicator">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`progressStep ${i <= step ? "active" : ""}`} />
      ))}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <BasicInfo
            formData={formData}
            handleInputChange={handleInputChange}
            handleProfilePictureChange={handleProfilePictureChange}
            nextStep={nextStep}
          />
        );
      case 1:
        return (
          <TravelPreferences
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 2:
        return (
          <LanguagesAndDestinations
            formData={formData}
            handleInputChange={handleInputChange}
            handleSignup={handleSignup}
            prevStep={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="signupContainer">
      {renderProgressBar()}
      <h2>Inscription</h2>
      {renderStep()}
      {error && <p className="error">{error}</p>}
      {step === 0 && (
        <button onClick={handleGoogleSignup} className="googleButton">
          <FontAwesomeIcon icon={faGoogle} />
          S'inscrire avec Google
        </button>
      )}
    </div>
  );
};

const BasicInfo = ({
  formData,
  handleInputChange,
  handleProfilePictureChange,
  nextStep,
}) => (
  <div className="formStep">
    <div className="inputGroup">
      <FontAwesomeIcon icon={faUser} className="inputIcon" />
      <input
        type="text"
        value={formData.username}
        onChange={(e) => handleInputChange("username", e.target.value)}
        placeholder="Nom d'utilisateur"
        required
      />
    </div>
    <div className="inputGroup">
      <FontAwesomeIcon icon={faEnvelope} className="inputIcon" />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        placeholder="Email"
        required
      />
    </div>
    <div className="inputGroup">
      <FontAwesomeIcon icon={faLock} className="inputIcon" />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        placeholder="Mot de passe"
        required
      />
    </div>
    <div className="inputGroup">
      <FontAwesomeIcon icon={faPhone} className="inputIcon" />
      <input
        type="tel"
        value={formData.phone}
        onChange={(e) => handleInputChange("phone", e.target.value)}
        placeholder="Téléphone"
      />
    </div>
    <div className="inputGroup">
      <FontAwesomeIcon icon={faMapMarkerAlt} className="inputIcon" />
      <input
        type="text"
        value={formData.address}
        onChange={(e) => handleInputChange("address", e.target.value)}
        placeholder="Adresse"
      />
    </div>
    <div className="inputGroup">
      <FontAwesomeIcon icon={faImage} className="inputIcon" />
      <input
        type="file"
        onChange={handleProfilePictureChange}
        accept="image/*"
      />
    </div>
    <button onClick={nextStep} className="nextButton">
      Suivant
    </button>
  </div>
);

const TravelPreferences = ({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
}) => (
  <div className="formStep">
    <h3>Type de voyage préféré</h3>
    <div className="optionButtons">
      {["Solo", "Couple", "Famille", "Amis"].map((type) => (
        <button
          key={type}
          className={`optionButton ${formData.travelPreferences.type === type ? "selected" : ""}`}
          onClick={() =>
            handleInputChange("travelPreferences", {
              ...formData.travelPreferences,
              type,
            })
          }
        >
          <FontAwesomeIcon icon={faPlane} className="optionIcon" />
          {type}
        </button>
      ))}
    </div>

    <h3>Hébergement préféré</h3>
    <div className="optionButtons">
      {["Hôtel", "Appartement", "Camping", "Auberge de jeunesse"].map((acc) => (
        <button
          key={acc}
          className={`optionButton ${formData.travelPreferences.accommodation.includes(acc) ? "selected" : ""}`}
          onClick={() => {
            const newAccommodation =
              formData.travelPreferences.accommodation.includes(acc)
                ? formData.travelPreferences.accommodation.filter(
                    (a) => a !== acc,
                  )
                : [...formData.travelPreferences.accommodation, acc];
            handleInputChange("travelPreferences", {
              ...formData.travelPreferences,
              accommodation: newAccommodation,
            });
          }}
        >
          <FontAwesomeIcon icon={faHotel} className="optionIcon" />
          {acc}
        </button>
      ))}
    </div>

    <h3>Activités préférées</h3>
    <div className="optionButtons">
      {["Plage", "Montagne", "Ville", "Culture", "Sport"].map((activity) => (
        <button
          key={activity}
          className={`optionButton ${formData.travelPreferences.activities.includes(activity) ? "selected" : ""}`}
          onClick={() => {
            const newActivities =
              formData.travelPreferences.activities.includes(activity)
                ? formData.travelPreferences.activities.filter(
                    (a) => a !== activity,
                  )
                : [...formData.travelPreferences.activities, activity];
            handleInputChange("travelPreferences", {
              ...formData.travelPreferences,
              activities: newActivities,
            });
          }}
        >
          <FontAwesomeIcon icon={faUtensils} className="optionIcon" />
          {activity}
        </button>
      ))}
    </div>

    <div className="navigationButtons">
      <button onClick={prevStep} className="prevButton">
        Précédent
      </button>
      <button onClick={nextStep} className="nextButton">
        Suivant
      </button>
    </div>
  </div>
);

const LanguagesAndDestinations = ({
  formData,
  handleInputChange,
  handleSignup,
  prevStep,
}) => (
  <div className="formStep">
    <h3>Langues parlées</h3>
    <div className="optionButtons">
      {["Français", "Anglais", "Espagnol", "Allemand", "Italien"].map(
        (lang) => (
          <button
            key={lang}
            className={`optionButton ${formData.languages.includes(lang) ? "selected" : ""}`}
            onClick={() => {
              const newLanguages = formData.languages.includes(lang)
                ? formData.languages.filter((l) => l !== lang)
                : [...formData.languages, lang];
              handleInputChange("languages", newLanguages);
            }}
          >
            <FontAwesomeIcon icon={faLanguage} className="optionIcon" />
            {lang}
          </button>
        ),
      )}
    </div>

    <div className="inputGroup">
      <FontAwesomeIcon icon={faGlobe} className="inputIcon" />
      <input
        type="text"
        value={formData.destinations.join(", ")}
        onChange={(e) =>
          handleInputChange("destinations", e.target.value.split(", "))
        }
        placeholder="Entrez vos destinations souhaitées, séparées par des virgules"
      />
    </div>

    <div className="navigationButtons">
      <button onClick={prevStep} className="prevButton">
        Précédent
      </button>
      <button onClick={handleSignup} className="signupButton">
        S'inscrire
      </button>
    </div>
  </div>
);

export default Signup;
