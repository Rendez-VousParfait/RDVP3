import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, storage } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Checkbox,
  FormControlLabel,
  Chip,
  InputAdornment,
  Card,
  CardContent,
} from "@mui/material";
import {
  Person,
  Email,
  Lock,
  Phone,
  Home,
  Image,
  FlightTakeoff,
  Public,
  Google,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import "./Signup.css";

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

const Signup = () => {
  const [activeStep, setActiveStep] = useState(0);
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
        formData.password
      );
      const user = userCredential.user;

      let profilePictureUrl = "";
      if (formData.profilePicture) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        const uploadTask = uploadBytesResumable(
          storageRef,
          formData.profilePicture
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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    "Informations personnelles",
    "Préférences de voyage",
    "Langues et destinations",
  ];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BasicInfo
            formData={formData}
            handleInputChange={handleInputChange}
            handleProfilePictureChange={handleProfilePictureChange}
          />
        );
      case 1:
        return (
          <TravelPreferences
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <LanguagesAndDestinations
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      default:
        return "Unknown step";
    }
  };

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
              <Typography component="h1" variant="h4" align="center" gutterBottom>
                Inscription
              </Typography>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box sx={{ mt: 4 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {getStepContent(activeStep)}
                  </motion.div>
                </AnimatePresence>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
                >
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={
                      activeStep === steps.length - 1 ? handleSignup : handleNext
                    }
                  >
                    {activeStep === steps.length - 1 ? "S'inscrire" : "Suivant"}
                  </Button>
                </Box>
              </Box>
              {error && (
                <Typography color="error" align="center" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
              {activeStep === 0 && (
                <Button
                  startIcon={<Google />}
                  variant="outlined"
                  onClick={handleGoogleSignup}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  S'inscrire avec Google
                </Button>
              )}
            </CardContent>
          </Card>
        </MotionContainer>
      </Box>
    </ThemeProvider>
  );
};

const BasicInfo = ({
  formData,
  handleInputChange,
  handleProfilePictureChange,
}) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Nom d'utilisateur"
        value={formData.username}
        onChange={(e) => handleInputChange("username", e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person />
            </InputAdornment>
          ),
        }}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email />
            </InputAdornment>
          ),
        }}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Mot de passe"
        type="password"
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          ),
        }}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Téléphone"
        value={formData.phone}
        onChange={(e) => handleInputChange("phone", e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone />
            </InputAdornment>
          ),
        }}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Adresse"
        value={formData.address}
        onChange={(e) => handleInputChange("address", e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Home />
            </InputAdornment>
          ),
        }}
      />
    </Grid>
    <Grid item xs={12}>
      <Button
        variant="outlined"
        component="label"
        startIcon={<Image />}
        fullWidth
      >
        Choisir une photo de profil
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleProfilePictureChange}
        />
      </Button>
    </Grid>
  </Grid>
);

const TravelPreferences = ({ formData, handleInputChange }) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Typography variant="h6" gutterBottom>
        Type de voyage préféré
      </Typography>
      <Grid container spacing={1}>
        {["Solo", "Couple", "Famille", "Amis"].map((type) => (
          <Grid item key={type}>
            <Button
              variant={
                formData.travelPreferences.type === type
                  ? "contained"
                  : "outlined"
              }
              onClick={() =>
                handleInputChange("travelPreferences", {
                  ...formData.travelPreferences,
                  type,
                })
              }
              startIcon={<FlightTakeoff />}
            >
              {type}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="h6" gutterBottom>
        Hébergement préféré
      </Typography>
      <Grid container spacing={1}>
        {["Hôtel", "Appartement", "Camping", "Auberge de jeunesse"].map(
          (acc) => (
            <Grid item key={acc}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.travelPreferences.accommodation.includes(
                      acc
                    )}
                    onChange={(e) => {
                      const newAccommodation = e.target.checked
                        ? [...formData.travelPreferences.accommodation, acc]
                        : formData.travelPreferences.accommodation.filter(
                            (a) => a !== acc
                          );
                      handleInputChange("travelPreferences", {
                        ...formData.travelPreferences,
                        accommodation: newAccommodation,
                      });
                    }}
                  />
                }
                label={acc}
              />
            </Grid>
          )
        )}
      </Grid>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="h6" gutterBottom>
        Activités préférées
      </Typography>
      <Grid container spacing={1}>
        {["Plage", "Montagne", "Ville", "Culture", "Sport"].map((activity) => (
          <Grid item key={activity}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.travelPreferences.activities.includes(
                    activity
                  )}
                  onChange={(e) => {
                    const newActivities = e.target.checked
                      ? [...formData.travelPreferences.activities, activity]
                      : formData.travelPreferences.activities.filter(
                          (a) => a !== activity
                        );
                    handleInputChange("travelPreferences", {
                      ...formData.travelPreferences,
                      activities: newActivities,
                    });
                  }}
                />
              }
              label={activity}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  </Grid>
);

const LanguagesAndDestinations = ({ formData, handleInputChange }) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Typography variant="h6" gutterBottom>
        Langues parlées
      </Typography>
      <Grid container spacing={1}>
        {["Français", "Anglais", "Espagnol", "Allemand", "Italien"].map(
          (lang) => (
            <Grid item key={lang}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.languages.includes(lang)}
                    onChange={(e) => {
                      const newLanguages = e.target.checked
                        ? [...formData.languages, lang]
                        : formData.languages.filter((l) => l !== lang);
                      handleInputChange("languages", newLanguages);
                    }}
                  />
                }
                label={lang}
              />
            </Grid>
          )
        )}
      </Grid>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="h6" gutterBottom>
        Destinations souhaitées
      </Typography>
      <TextField
        fullWidth
        label="Ajouter une destination"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const newDestinations = [...formData.destinations, e.target.value];
            handleInputChange("destinations", newDestinations);
            e.target.value = "";
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Public />
            </InputAdornment>
          ),
        }}
      />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
        {formData.destinations.map((destination, index) => (
          <Chip
            key={index}
            label={destination}
            onDelete={() => {
              const newDestinations = formData.destinations.filter(
                (_, i) => i !== index
              );
              handleInputChange("destinations", newDestinations);
            }}
          />
        ))}
      </Box>
    </Grid>
  </Grid>
);

export default Signup;