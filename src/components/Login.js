import React, { useState, useContext, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import { Email, Lock, Google } from "@mui/icons-material";
import { motion } from "framer-motion";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF416C",
    },
    secondary: {
      main: "#8A2387",
    },
    text: {
      primary: "#333333",
    },
  },
});

const MotionContainer = motion(Container);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
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
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setError(error.message);
    }
  };

  if (user) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          background: "white",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MotionContainer
          component="main"
          maxWidth="sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            }}
          >
            <CardContent>
              <Typography
                component="h1"
                variant="h4"
                align="center"
                gutterBottom
              >
                Connexion
              </Typography>
              <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Adresse e-mail"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Se connecter
                </Button>
                <Button
                  startIcon={<Google />}
                  variant="outlined"
                  onClick={handleGoogleLogin}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Se connecter avec Google
                </Button>
              </Box>
              {error && (
                <Typography color="error" align="center" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Link to="/forgot-password" style={{ marginRight: "10px" }}>
                  Mot de passe oublié ?
                </Link>
                <Link to="/signup" state={location.state}>
                  Créer un compte
                </Link>
              </Box>
            </CardContent>
          </Card>
        </MotionContainer>
      </Box>
    </ThemeProvider>
  );
}

export default Login;
