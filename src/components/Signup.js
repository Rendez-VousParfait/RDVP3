import React, { useState } from "react";
import { auth, db, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Enregistrer les informations supplémentaires dans Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: username,
        phone: phone,
        address: address,
      });

      navigate("/profile"); // Redirige vers la page de profil après l'inscription
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Enregistrer les informations supplémentaires dans Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: user.displayName,
        phone: "",
        address: "",
      });

      navigate("/profile"); // Redirige vers la page de profil après l'inscription
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <div className="user-icon">
            <i className="fas fa-user-plus"></i>
          </div>
          <h2>Inscription</h2>
          <p>Veuillez entrer vos informations pour vous inscrire</p>
        </div>
        <form className="signup-form" onSubmit={handleSignup}>
          <div className="form-group">
            <span className="input-icon">
              <i className="fas fa-user"></i>
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nom d'utilisateur"
              required
            />
          </div>
          <div className="form-group">
            <span className="input-icon">
              <i className="fas fa-envelope"></i>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <span className="input-icon">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
            />
          </div>
          <div className="form-group">
            <span className="input-icon">
              <i className="fas fa-phone"></i>
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Numéro de téléphone (facultatif)"
            />
          </div>
          <div className="form-group">
            <span className="input-icon">
              <i className="fas fa-home"></i>
            </span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Adresse (facultatif)"
            />
          </div>
          <button className="signup-button" type="submit">
            S'inscrire
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <div className="separator">
          <span>ou</span>
        </div>
        <div className="social-login">
          <button
            className="social-button google-button"
            onClick={handleGoogleSignup}
          >
            <i className="fab fa-google"></i> Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
