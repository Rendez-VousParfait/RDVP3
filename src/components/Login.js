import React, { useState, useContext, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // La redirection sera gérée par le useEffect ci-dessus
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSocialLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // La redirection sera gérée par le useEffect ci-dessus
    } catch (error) {
      setError(error.message);
    }
  };

  if (user) {
    return null; // ou un composant de chargement si vous préférez
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Connexion</h2>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
            />
          </div>
          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Se souvenir de moi</label>
          </div>
          <button type="submit" className="login-button">
            Se connecter
          </button>
        </form>
        <div className="separator">
          <span>ou</span>
        </div>
        <div className="social-login">
          <button
            onClick={handleSocialLogin}
            className="social-button google-button"
          >
            <FontAwesomeIcon icon={faGoogle} />
            Se connecter avec Google
          </button>
        </div>
        <div className="login-footer">
          <Link to="/forgot-password">Mot de passe oublié ?</Link>
          <Link to="/signup" state={location.state}>Créer un compte</Link>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Login;