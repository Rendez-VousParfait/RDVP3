import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { googleProvider } from "../firebase";
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Slider,
  Box,
  Paper,
  InputAdornment,
  CircularProgress,
  LinearProgress,
  Chip
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Google,
  ArrowForward,
  ArrowBack,
  Explore,
  AttachMoney,
  Hotel,
  Apartment,
  Bed,
  Home,
  SpaOutlined,
  SportsEsports,
  Museum,
  Hiking,
  Restaurant,
  Group,
  TouchApp,
  Celebration,
  Favorite,
  SportsHandball,
  LocalActivity,
  NoMeals,
  School,
  Event,
  CheckCircle,
  Cancel,
  EuroSymbol,
  Whatshot,
  BlurOn,
  StarRate,
  SetMeal,
  History,
  LocalBar,
  LocationOn,
  Palette,
  LocalCafe,
  Nature,
  Spa
} from "@mui/icons-material";
import styled from "@emotion/styled";
import debounce from "lodash/debounce";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff4b81",
      light: "#ff6b6b",
      dark: "#e0436f",
    },
    secondary: {
      main: "#667eea",
      light: "#764ba2",
      dark: "#5a6fd6",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

const StyledContainer = styled(Paper)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  margin-top: 2rem;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #ff4b81 30%, #ff6b6b 90%);
  border-radius: 8px;
  border: 0;
  color: white;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 75, 129, 0.3);
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    background: linear-gradient(45deg, #ff6b6b 30%, #ff4b81 90%);
    box-shadow: 0 5px 7px 2px rgba(255, 75, 129, 0.5);
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    transform: none;
  }
`;

const StyledTextField = styled(TextField)`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  margin-bottom: 1rem;

  & .MuiOutlinedInput-root {
    transition: transform 0.3s ease-in-out;
    
    &:hover {
      transform: translateY(-2px);
    }

    &.Mui-focused {
      transform: translateY(-2px);
    }
  }
`;

const QuestionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const QuestionTitle = styled(Typography)`
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ProgressBar = styled(motion.div)`
  height: 6px;
  background: linear-gradient(90deg, #ff4b81, #ff6b6b);
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 0 3px 3px 0;
`;

const StyledMenuItem = styled(MenuItem)`
  transition: background-color 0.3s ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

const pageVariants = {
  initial: { opacity: 0, x: "-100vw" },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: "100vw" }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const TypingEffect = ({ text }) => {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 0.5 }}
    >
      {text}
    </motion.div>
  );
};

const StyledPasswordStrength = styled(LinearProgress)`
  height: 8px;
  border-radius: 4px;
  margin-top: 8px;
  background-color: rgba(255, 255, 255, 0.2);

  & .MuiLinearProgress-bar {
    background: ${props => 
      props.value <= 25 ? '#ff4b81' :
      props.value <= 50 ? '#ffa726' :
      props.value <= 75 ? '#66bb6a' :
      '#43a047'
    };
  }
`;

const StyledGoogleButton = styled(Button)`
  background: white;
  color: #666;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  height: 48px;
  margin-top: 1rem;
  
  &:hover {
    background: #f5f5f5;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  .MuiButton-startIcon {
    color: #4285f4;
  }
`;

const OptionCard = styled(Button)`
  width: 100%;
  padding: 16px;
  margin: 8px 0;
  text-align: left;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: ${props => props.selected ? 'linear-gradient(45deg, #ff4b81 30%, #ff6b6b 90%)' : 'white'};
  color: ${props => props.selected ? 'white' : '#666'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const OptionGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const IconWrapper = styled(Box)`
  margin-right: 12px;
  display: flex;
  align-items: center;
  color: ${props => props.selected ? 'white' : '#ff4b81'};
`;

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    experienceType: "",
    weekendActivities: [],
    groupRole: "",
    cuisineTypes: [],
    pace: ""
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkUsernameAvailability = useCallback(debounce(async (username) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    // Simuler une vérification d'API
    const isAvailable = await new Promise(resolve => 
      setTimeout(() => resolve(Math.random() > 0.3), 500)
    );
    setUsernameAvailable(isAvailable);
  }, 300), []);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    handleInputChange(e);
    checkUsernameAvailability(value);
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    handleInputChange(e);
    checkPasswordStrength(value);
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleMultipleSelect = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: typeof value === "string" ? value.split(",") : value }));
  }, []);

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Structurer les préférences de manière plus complète
      const userPreferences = {
        experienceType: formData.experienceType,
        weekendActivities: Array.isArray(formData.weekendActivities) ? formData.weekendActivities : [],
        groupRole: formData.groupRole,
        cuisineTypes: Array.isArray(formData.cuisineTypes) ? formData.cuisineTypes : [],
        pace: parseInt(formData.pace) || 0,
        // Ajouter des champs vides pour les futures préférences
        travelType: "",
        budget: "",
        accommodationPreferences: [],
        activityPreferences: [],
        restaurantPreferences: [],
        dietaryRestrictions: [],
        activityIntensity: "",
        groupPreference: "",
        adventureLevel: "",
        learningInterest: [],
        eventTypes: []
      };

      // Sauvegarder dans Firestore avec une structure plus claire
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: formData.username,
        email: formData.email,
        phone: "",
        address: "",
        profilePictureUrl: "",
        preferences: userPreferences,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });

      navigate("/");
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setError(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await setDoc(doc(db, "users", result.user.uid), {
        username: result.user.displayName,
        email: result.user.email,
        profilePictureUrl: result.user.photoURL,
      });
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const renderBasicInfoStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <Box mb={3}>
        <QuestionTitle variant="h6">Choisissez votre nom d'utilisateur</QuestionTitle>
        <StyledTextField
          fullWidth
          name="username"
          value={formData.username}
          onChange={handleUsernameChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {usernameAvailable === true && <CheckCircle color="success" />}
                {usernameAvailable === false && <Cancel color="error" />}
                {usernameAvailable === null && formData.username.length > 0 && <CircularProgress size={20} />}
              </InputAdornment>
            ),
          }}
        />
        {usernameAvailable === false && (
          <Typography color="error" variant="caption">
            Ce nom d'utilisateur n'est pas disponible.
          </Typography>
        )}
      </Box>

      <Box mb={3}>
        <QuestionTitle variant="h6">Votre adresse email</QuestionTitle>
        <StyledTextField
          fullWidth
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </Box>

      <Box mb={3}>
        <QuestionTitle variant="h6">Créez un mot de passe sécurisé</QuestionTitle>
        <StyledTextField
          fullWidth
          name="password"
          type="password"
          value={formData.password}
          onChange={handlePasswordChange}
        />
        <StyledPasswordStrength 
          variant="determinate" 
          value={(passwordStrength / 4) * 100} 
        />
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'white',
            mt: 1,
            display: 'block',
            textAlign: 'right'
          }}
        >
          {passwordStrength === 0 && "Mot de passe faible"}
          {passwordStrength === 1 && "Mot de passe moyen"}
          {passwordStrength === 2 && "Mot de passe correct"}
          {passwordStrength === 3 && "Mot de passe fort"}
          {passwordStrength === 4 && "Mot de passe très fort"}
        </Typography>
      </Box>
    </motion.div>
  );

  const steps = [
    {
      title: "Créez votre compte",
      render: renderBasicInfoStep
    },
    {
      title: "Vos préférences (1/2)",
      questions: [
        {
          title: "Quel type d'expériences vous attire le plus ?",
          field: "experienceType",
          type: "cards",
          options: [
            { value: "authentic", label: "Découvrir des lieux authentiques et locaux", icon: <LocationOn /> },
            { value: "luxury", label: "Me détendre dans un cadre confortable et luxueux", icon: <Spa /> },
            { value: "original", label: "Explorer des activités originales et insolites", icon: <Whatshot /> },
            { value: "cultural", label: "Participer à des expériences culturelles enrichissantes", icon: <Museum /> },
            { value: "festive", label: "Partager des moments festifs et animés avec des amis", icon: <Celebration /> }
          ]
        },
        {
          title: "Comment aimez-vous occuper vos week-ends ?",
          field: "weekendActivities",
          type: "chips",
          options: [
            { value: "restaurants", label: "Restaurants & Bars", icon: <Restaurant /> },
            { value: "outdoor", label: "Activités plein air", icon: <Hiking /> },
            { value: "cultural", label: "Événements culturels", icon: <Museum /> },
            { value: "relaxation", label: "Détente & Spa", icon: <Spa /> }
          ]
        },
        {
          title: "Dans un groupe, vous êtes plutôt :",
          field: "groupRole",
          type: "cards",
          options: [
            { value: "organizer", label: "Celui/celle qui organise les plans", icon: <Event /> },
            { value: "follower", label: "Celui/celle qui suit et se laisse porter", icon: <Group /> },
            { value: "motivator", label: "Celui/celle qui motive tout le monde à sortir", icon: <Celebration /> }
          ]
        }
      ]
    },
    {
      title: "Vos préférences (2/2)",
      questions: [
        {
          title: "Quel est votre type de cuisine préféré ?",
          field: "cuisineTypes",
          type: "grid",
          options: [
            { value: "traditional", label: "Cuisine française", icon: <Restaurant /> },
            { value: "exotic", label: "Saveurs exotiques", icon: <SetMeal /> },
            { value: "gastronomic", label: "Gastronomique", icon: <StarRate /> },
            { value: "vegetarian", label: "Végétarien/Vegan", icon: <Nature /> },
            { value: "brasserie", label: "Brasserie/Bistrot", icon: <LocalBar /> }
          ]
        },
        {
          title: "Quel est votre rythme idéal lors d'une sortie ?",
          field: "pace",
          type: "slider",
          min: 0,
          max: 2,
          marks: [
            { value: 0, label: "Tranquille" },
            { value: 1, label: "Modéré" },
            { value: 2, label: "Dynamique" }
          ]
        }
      ]
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSignup();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case "cards":
        return (
          <Box>
            {question.options.map((option) => (
              <OptionCard
                key={option.value}
                selected={formData[question.field] === option.value}
                onClick={() => handleInputChange({
                  target: { name: question.field, value: option.value }
                })}
              >
                <IconWrapper selected={formData[question.field] === option.value}>
                  {option.icon}
                </IconWrapper>
                {option.label}
              </OptionCard>
            ))}
          </Box>
        );

      case "chips":
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {question.options.map((option) => (
              <Chip
                key={option.value}
                icon={option.icon}
                label={option.label}
                onClick={() => {
                  const newValue = formData[question.field].includes(option.value)
                    ? formData[question.field].filter(v => v !== option.value)
                    : [...formData[question.field], option.value];
                  handleInputChange({
                    target: { name: question.field, value: newValue }
                  });
                }}
                color={formData[question.field].includes(option.value) ? "primary" : "default"}
                sx={{ p: 2 }}
              />
            ))}
          </Box>
        );

      case "grid":
        return (
          <OptionGrid>
            {question.options.map((option) => (
              <OptionCard
                key={option.value}
                selected={formData[question.field].includes(option.value)}
                onClick={() => {
                  const newValue = formData[question.field].includes(option.value)
                    ? formData[question.field].filter(v => v !== option.value)
                    : [...formData[question.field], option.value];
                  handleInputChange({
                    target: { name: question.field, value: newValue }
                  });
                }}
              >
                <IconWrapper selected={formData[question.field].includes(option.value)}>
                  {option.icon}
                </IconWrapper>
                {option.label}
              </OptionCard>
            ))}
          </OptionGrid>
        );

      case "slider":
        return (
          <Box sx={{ px: 3, py: 2 }}>
            <Slider
              value={formData[question.field] || 0}
              min={question.min}
              max={question.max}
              step={1}
              marks={question.marks}
              onChange={(_, value) => handleInputChange({
                target: { name: question.field, value }
              })}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  const renderQuestions = (questions) => {
    return questions.map((question, index) => (
      <Box key={index} mb={3}>
        <QuestionTitle variant="h6">{question.title}</QuestionTitle>
        {renderQuestion(question)}
      </Box>
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <StyledContainer>
          <ProgressBar
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            {steps[currentStep].title}
          </Typography>
          <AnimatePresence mode="wait">
            <QuestionCard
              key={currentStep}
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={pageTransition}
            >
              {typeof steps[currentStep].render === "function" 
                ? steps[currentStep].render() 
                : renderQuestions(steps[currentStep].questions)}
            </QuestionCard>
          </AnimatePresence>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <StyledButton onClick={handleBack} disabled={currentStep === 0}>
              <ArrowBack /> Précédent
            </StyledButton>
            <StyledButton onClick={handleNext}>
              {currentStep === steps.length - 1 ? "Terminer" : "Suivant"} <ArrowForward />
            </StyledButton>
          </Box>
          {currentStep === 0 && (
            <StyledGoogleButton
              fullWidth
              onClick={handleGoogleSignup}
              startIcon={<Google />}
              sx={{ mt: 3, mb: 2 }}
            >
              S'inscrire avec Google
            </StyledGoogleButton>
          )}
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Déjà un compte ?{" "}
            <Button color="secondary" onClick={() => navigate("/login")}>
              Connectez-vous
            </Button>
          </Typography>
        </StyledContainer>
      </Container>
    </ThemeProvider>
  );
};

export default Signup;