import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";
import styles from "./Signup.css";
import "../style/buttons.css";

const Signup = () => {
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
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: username,
        phone: phone,
        address: address,
      });

      navigate("/profile");
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
        phone: "",
        address: "",
      });

      navigate("/profile");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h2>Inscription</h2>
      <form onSubmit={handleSignup} className={styles.signupForm}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nom d'utilisateur"
          required
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Téléphone"
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Adresse"
        />
        <button type="submit" className="custom-button">
          S'inscrire
        </button>
      </form>
      <button onClick={handleGoogleSignup} className="custom-button google-button">
        S'inscrire avec Google
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Signup;