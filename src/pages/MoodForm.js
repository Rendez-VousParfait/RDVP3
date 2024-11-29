import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  Container, 
  Typography, 
  Box,
  TextField,
  Button,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  useMediaQuery,
  Grid
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import { 
  Restaurant,
  Hotel,
  LocalActivity,
  Nature,
  LocationCity,
  Spa,
  DirectionsRun,
  Celebration,
  Check,
  ArrowBack,
  ArrowForward,
  Science,
  Diamond,
  Palette,
  BeachAccess,
  SportsScore,
  Fireplace,
  Apartment,
  NightlightRound,
  Info
} from '@mui/icons-material';
import styles from './MoodForm.module.css';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useNavbar } from '../contexts/NavbarContext';
import { createRoot } from 'react-dom/client';

// Définition du thème
const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50',      // Bleu foncé plus professionnel
      light: '#34495E',
      dark: '#1A252F',
    },
    secondary: {
      main: '#E74C3C',      // Rouge corail pour les accents
      light: '#FF6B6B',
      dark: '#C0392B',
    },
    background: {
      default: '#F5F6FA',   // Fond clair légèrement bleuté
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50',   // Texte principal en bleu foncé
      secondary: '#7F8C8D', // Texte secondaire en gris
    }
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h4: {
      fontWeight: 600,
      color: '#2C3E50',
    },
    subtitle1: {
      fontSize: '1.1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          '@media (max-width: 600px)': {
            padding: '8px 16px',
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            padding: '0 12px',
          },
        },
      },
    },
  },
});

// Reprendre les styles du composant Signup
const StyledContainer = styled(motion.div)`
  background: linear-gradient(135deg, #ECE9E6 0%, #FFFFFF 100%);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;

  @media (max-width: 600px) {
    padding: 1.5rem;
    margin-top: 1rem;
    border-radius: 15px;
  }
`;

const QuestionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);

  @media (max-width: 600px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

const MoodForm = () => {
  const navigate = useNavigate();
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({
    date: null,
    services: [],
    groupSize: 1,
    clientType: '',
    budget: 50,
    cuisineTypes: [],
    activityTime: '',
    restaurantTime: '',
    restaurantVersus: {
      ambiance: '',
      experience: '',
      decoration: ''
    },
    activityVersus: {
      mood: '',
      location: '',
      intensity: ''
    },
    accommodationVersus: {
      setting: '',
      ambiance: '',
      services: ''
    }
  });

  // Déplacer l'état pressedCard au niveau du composant
  const [pressedCard, setPressedCard] = useState(null);

  const { setIsNavbarExpanded } = useNavbar();

  // Rétracter automatiquement la Navbar lors de l'entrée dans le MoodForm
  useEffect(() => {
    setIsNavbarExpanded(false);
    return () => setIsNavbarExpanded(true); // Restaurer l'état initial à la sortie
  }, [setIsNavbarExpanded]);

  // Définition des étapes du formulaire
  const getFilteredSteps = () => {
    const baseSteps = [
      {
        title: "Informations de base",
        type: "basic"
      }
    ];

    // Vérifier les services sélectionnés et ajouter les étapes correspondantes
    if (formData.services.includes('restaurants')) {
      baseSteps.push(
        {
          title: "Préférences culinaires",
          type: "culinary"
        },
        {
          title: "Restaurant - Style et Ambiance",
          type: "versus",
          category: "restaurant"
        }
      );
    }

    if (formData.services.includes('activities')) {
      baseSteps.push({
        title: "Activité - Style et Ambiance",
        type: "versus",
        category: "activity"
      });
    }

    if (formData.services.includes('hotels')) {
      baseSteps.push({
        title: "Hébergement - Style et Ambiance",
        type: "versus",
        category: "accommodation"
      });
    }

    // Ajouter l'étape de résumé à la fin
    baseSteps.push({
      title: "Résumé de vos préférences",
      type: "summary"
    });

    return baseSteps;
  };

  // Options pour les différents choix
  const versusOptions = {
    restaurant: {
      ambiance: {
        title: "Quelle ambiance vous attire le plus pour votre repas ?",
        options: [
          {
            title: "Festive et conviviale",
            description: "Animée, idéale pour les discussions et les rires",
            icon: <Celebration />,
            image: "https://images.unsplash.com/photo-1485686531765-ba63b07845a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          },
          {
            title: "Calme et intimiste",
            description: "Tranquille, parfaite pour un moment en tête-à-tête",
            icon: <NightlightRound />,
            image: "https://images.unsplash.com/photo-1592861956120-e524fc739696?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          }
        ]
      },
      experience: {
        title: "Quel type d'expérience culinaire préférez-vous aujourd'hui ?",
        options: [
          {
            title: "Traditionnelle",
            description: "Plats classiques, ambiance chaleureuse et locale",
            icon: <Restaurant />,
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          },
          {
            title: "Innovante",
            description: "Cuisine créative avec des saveurs originales et surprenantes",
            icon: <Science />,
            image: "https://images.unsplash.com/photo-1538329972958-465d6d2144ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          }
        ]
      },
      decoration: {
        title: "Quel style de décoration préférez-vous pour le restaurant ?",
        options: [
          {
            title: "Élégant et chic",
            description: "Décor raffiné, ambiance sophistiquée",
            icon: <Diamond />,
            image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          },
          {
            title: "Original et atypique",
            description: "Décoration unique, parfois surprenante",
            icon: <Palette />,
            image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          }
        ]
      }
    },
    activity: {
      mood: {
        title: "Quel type d'activité correspond à votre envie du moment ?",
        options: [
          {
            title: "Relaxante",
            description: "Spa, méditation, promenade tranquille",
            icon: <Spa />,
            image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          },
          {
            title: "Énergique",
            description: "Randonnée, sport ou aventure",
            icon: <DirectionsRun />,
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          }
        ]
      },
      location: {
        title: "Où souhaitez-vous faire votre activité ?",
        options: [
          {
            title: "Nature",
            description: "En plein air, entouré(e) de paysages naturels",
            icon: <Nature />,
            image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          },
          {
            title: "Ville",
            description: "Dans un lieu culturel ou divertissant en zone urbaine",
            icon: <LocationCity />,
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          }
        ]
      },
      intensity: {
        title: "Quelle intensité recherchez-vous pour cette activité ?",
        options: [
          {
            title: "Décontracté",
            description: "Activité légère et reposante",
            icon: <BeachAccess />,
            image: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          },
          {
            title: "Immersive",
            description: "Qui capte toute votre attention et vous plonge dans une expérience dynamique",
            icon: <SportsScore />,
            image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          }
        ]
      }
    },
    accommodation: {
      setting: {
        title: "Où souhaitez-vous séjourner ?",
        options: [
          {
            title: "En ville",
            description: "Proche des restaurants, activités et commodités",
            icon: <LocationCity />,
            image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          },
          {
            title: "Dans la nature",
            description: "Loin de l'agitation, pour un repos total",
            icon: <Nature />,
            image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          }
        ]
      },
      ambiance: {
        title: "Quelle ambiance préférez-vous pour votre hébergement ?",
        options: [
          {
            title: "Chaleureuse",
            description: "Authentique, cosy, avec une touche locale",
            icon: <Fireplace />,
            image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          },
          {
            title: "Moderne",
            description: "Élégante, épurée, avec des équipements high-tech",
            icon: <Apartment />,
            image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          }
        ]
      },
      services: {
        title: "Quels services sont essentiels pour vous ?",
        options: [
          {
            title: "Classiques",
            description: "Chambre, petit-déjeuner, Wi-Fi",
            icon: <Hotel />,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          },
          {
            title: "Premium",
            description: "Spa, piscine, salle de sport et room service",
            icon: <Spa />,
            image: "https://images.unsplash.com/photo-1561501878-aabd62634533?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          }
        ]
      }
    }
  };

  // Ajouter la définition de matches au début du composant
  const matches = useMediaQuery('(max-width:600px)');

  // Rendu des champs de base
  const renderBasicFields = () => {
    return (
      <Box sx={{ 
        '& .MuiTextField-root': { 
          mb: 2,
          width: { xs: '100%', sm: 'auto' } 
        },
        '& .MuiFormGroup-root': {
          mb: { xs: 2, sm: 3 }
        }
      }}>
        <DatePicker
          label="Date de la sortie"
          value={formData.date}
          onChange={(newDate) => setFormData(prev => ({ ...prev, date: newDate }))}
          renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
        />
        
        <FormGroup sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Types de prestations souhaitées
          </Typography>
          {[
            { value: 'hotels', label: 'Hôtels', icon: <Hotel /> },
            { value: 'activities', label: 'Activités', icon: <LocalActivity /> },
            { value: 'restaurants', label: 'Restaurants', icon: <Restaurant /> }
          ].map((service) => (
            <FormControlLabel
              key={service.value}
              control={
                <Checkbox
                  checked={formData.services.includes(service.value)}
                  onChange={(e) => {
                    const newServices = e.target.checked
                      ? [...formData.services, service.value]
                      : formData.services.filter(s => s !== service.value);
                    setFormData(prev => ({ ...prev, services: newServices }));
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {service.icon}
                  {service.label}
                </Box>
              }
            />
          ))}
        </FormGroup>

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 2,
          flexDirection: { xs: 'column', sm: 'row' } 
        }}>
          <TextField
            type="number"
            label="Nombre de personnes"
            value={formData.groupSize}
            onChange={(e) => setFormData(prev => ({ ...prev, groupSize: parseInt(e.target.value) }))}
            InputProps={{ inputProps: { min: 1, max: 20 } }}
            sx={{ flex: { xs: '1 1 100%', sm: 1 } }}
          />
          <Select
            value={formData.clientType || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, clientType: e.target.value }))}
            label="Type de groupe"
            sx={{ flex: { xs: '1 1 100%', sm: 1 } }}
            displayEmpty
          >
            <MenuItem value="" disabled>Type de groupe</MenuItem>
            <MenuItem value="family">Famille</MenuItem>
            <MenuItem value="couple">Couple</MenuItem>
            <MenuItem value="friends">Amis</MenuItem>
            <MenuItem value="solo">Solo</MenuItem>
          </Select>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle1">Budget par personne</Typography>
            <Typography variant="h6" color="primary">
              {formData.budget}€
            </Typography>
          </Box>
          <Slider
            value={formData.budget}
            onChange={(e, newValue) => setFormData(prev => ({ ...prev, budget: newValue }))}
            min={20}
            max={200}
            step={10}
            marks
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}€`}
          />
        </Box>

        {formData.services.includes('activities') && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Moment de la journée pour l'activité
            </Typography>
            <Select
              value={formData.activityTime}
              onChange={(e) => setFormData(prev => ({ ...prev, activityTime: e.target.value }))}
              fullWidth
            >
              <MenuItem value="morning">Entre 9h00 et 13h00</MenuItem>
              <MenuItem value="afternoon">Entre 13h00 et 18h00</MenuItem>
              <MenuItem value="evening">Entre 18h00 et 21h00</MenuItem>
              <MenuItem value="night">Entre 21h00 et Minuit</MenuItem>
            </Select>
          </Box>
        )}
      </Box>
    );
  };

  // Rendu des préférences culinaires
  const renderCulinaryPreferences = () => {
    return (
      <Box>
        <FormGroup>
          <Typography variant="subtitle1" gutterBottom>
            Types de cuisine préférés
          </Typography>
          {[
            'Cuisine traditionnelle française',
            'Cuisine exotique',
            'Cuisine végétarienne/vegan',
            'Cuisine de brasserie/bistrot',
            'Cuisine gastronomique/étoilée'
          ].map((cuisine) => (
            <FormControlLabel
              key={cuisine}
              control={
                <Checkbox
                  checked={formData.cuisineTypes.includes(cuisine)}
                  onChange={(e) => {
                    const newCuisineTypes = e.target.checked
                      ? [...formData.cuisineTypes, cuisine]
                      : formData.cuisineTypes.filter(c => c !== cuisine);
                    setFormData(prev => ({ ...prev, cuisineTypes: newCuisineTypes }));
                  }}
                />
              }
              label={cuisine}
            />
          ))}
        </FormGroup>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Moment du repas
          </Typography>
          <RadioGroup
            value={formData.restaurantTime}
            onChange={(e) => setFormData(prev => ({ ...prev, restaurantTime: e.target.value }))}
          >
            <FormControlLabel value="lunch" control={<Radio />} label="Le midi (Entre 12h00 et 14h00)" />
            <FormControlLabel value="dinner" control={<Radio />} label="Le soir (Entre 19h00 et 22h00)" />
          </RadioGroup>
        </Box>
      </Box>
    );
  };

  // Fonction de rendu des versus modifiée
  const renderVersusQuestion = (category, question) => {
    const options = versusOptions[category][question].options;

    const handleTouchStart = (index) => {
      setPressedCard(index);
    };

    const handleTouchEnd = () => {
      setPressedCard(null);
    };

    return (
      <Box key={question} className={styles["versus-container"]}>
        <Typography 
          variant="h6" 
          gutterBottom 
          align="center" 
          sx={{
            fontSize: { xs: '1rem', sm: '1.25rem' },
            mb: { xs: 1, sm: 2 }
          }}
        >
          {versusOptions[category][question].title}
        </Typography>
        <div className={styles["versus-cards"]}>
          {options.map((option, index) => (
            <motion.div
              key={index}
              className={`${styles["versus-card"]} ${
                formData[`${category}Versus`][question] === option.title ? styles.winner : ""
              } ${pressedCard === index ? styles.pressed : ""}`}
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  [`${category}Versus`]: {
                    ...prev[`${category}Versus`],
                    [question]: option.title
                  }
                }));
              }}
              onTouchStart={() => handleTouchStart(index)}
              onTouchEnd={handleTouchEnd}
              whileHover={{ scale: matches ? 1.02 : 1.05 }}
              whileTap={{ scale: matches ? 0.98 : 0.95 }}
            >
              <div className={styles["versus-card-image"]}>
                <img 
                  src={option.image} 
                  alt={option.title}
                  loading="lazy"
                />
              </div>
              <div className={styles["versus-card-content"]}>
                <div className={styles["versus-card-icon"]}>
                  {option.icon}
                </div>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '0.9rem', sm: '1.1rem' }
                  }}
                >
                  {option.title}
                </Typography>
                <div className={styles["versus-card-description"]}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      fontSize: '0.8rem'
                    }}
                  >
                    {option.description}
                  </Typography>
                </div>
              </div>
            </motion.div>
          ))}
          <div className={styles["versus-divider"]}>VS</div>
        </div>
      </Box>
    );
  };

  // Fonction de rendu des versus
  const renderVersusSection = (category) => {
    const questions = Object.keys(versusOptions[category]);
    return (
      <QuestionCard>
        {questions.map((question) => renderVersusQuestion(category, question))}
      </QuestionCard>
    );
  };

  // Modifier la fonction renderSummary
  const renderSummary = () => {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            mb: 4,
            textAlign: 'center',
            color: '#2C3E50',
            fontWeight: 600
          }}
        >
          Récapitulatif de vos préférences
        </Typography>

        {/* Informations de base */}
        <Box 
          sx={{ 
            mb: 4,
            p: 3,
            backgroundColor: 'rgba(245, 230, 211, 0.3)',
            borderRadius: '15px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box 
              sx={{ 
                backgroundColor: '#F5E6D3',
                p: 1,
                borderRadius: '50%',
                mr: 2,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Info sx={{ color: '#2C3E50' }} />
            </Box>
            <Typography variant="h6" color="primary">
              Informations générales
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ pl: 2 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                <Typography>{formData.date ? new Date(formData.date).toLocaleDateString('fr-FR') : 'Non spécifiée'}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Nombre de personnes</Typography>
                <Typography>{formData.groupSize}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Type de groupe</Typography>
                <Typography>
                  {formData.clientType === 'family' ? 'Famille' : 
                   formData.clientType === 'couple' ? 'Couple' :
                   formData.clientType === 'friends' ? 'Amis' :
                   formData.clientType === 'solo' ? 'Solo' : 'Non spécifié'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Budget par personne</Typography>
                <Typography>{formData.budget}€</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Préférences Restaurant */}
        {formData.services.includes('restaurants') && (
          <Box 
            sx={{ 
              mb: 4,
              p: 3,
              backgroundColor: 'rgba(255, 107, 107, 0.05)',
              borderRadius: '15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  backgroundColor: '#FFE8E8',
                  p: 1,
                  borderRadius: '50%',
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Restaurant sx={{ color: '#FF6B6B' }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#FF6B6B' }}>
                Préférences Restaurant
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ pl: 2 }}>
              <Grid item xs={12}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Types de cuisine</Typography>
                  <Typography>{formData.cuisineTypes.join(', ') || 'Non spécifié'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Moment du repas</Typography>
                  <Typography>{formData.restaurantTime === 'lunch' ? 'Déjeuner' : 'Dîner'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Ambiance</Typography>
                  <Typography>{formData.restaurantVersus.ambiance || 'Non spécifié'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Expérience</Typography>
                  <Typography>{formData.restaurantVersus.experience || 'Non spécifié'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Décoration</Typography>
                  <Typography>{formData.restaurantVersus.decoration || 'Non spécifié'}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Préférences Activité */}
        {formData.services.includes('activities') && (
          <Box 
            sx={{ 
              mb: 4,
              p: 3,
              backgroundColor: 'rgba(102, 126, 234, 0.05)',
              borderRadius: '15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  backgroundColor: '#E8EFFF',
                  p: 1,
                  borderRadius: '50%',
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LocalActivity sx={{ color: '#667EEA' }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#667EEA' }}>
                Préférences Activité
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ pl: 2 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Moment de la journée</Typography>
                  <Typography>
                    {formData.activityTime === 'morning' ? 'Matinée' :
                     formData.activityTime === 'afternoon' ? 'Après-midi' :
                     formData.activityTime === 'evening' ? 'Soirée' :
                     formData.activityTime === 'night' ? 'Nuit' : 'Non spécifié'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Type d'activité</Typography>
                  <Typography>{formData.activityVersus.mood || 'Non spécifié'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Localisation</Typography>
                  <Typography>{formData.activityVersus.location || 'Non spécifié'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Intensité</Typography>
                  <Typography>{formData.activityVersus.intensity || 'Non spécifié'}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Préférences Hébergement */}
        {formData.services.includes('hotels') && (
          <Box 
            sx={{ 
              mb: 4,
              p: 3,
              backgroundColor: 'rgba(72, 187, 120, 0.05)',
              borderRadius: '15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  backgroundColor: '#E6F6EF',
                  p: 1,
                  borderRadius: '50%',
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Hotel sx={{ color: '#48BB78' }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#48BB78' }}>
                Préférences Hébergement
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ pl: 2 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Cadre</Typography>
                  <Typography>{formData.accommodationVersus.setting || 'Non spécifié'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Ambiance</Typography>
                  <Typography>{formData.accommodationVersus.ambiance || 'Non spécifié'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Services</Typography>
                  <Typography>{formData.accommodationVersus.services || 'Non spécifié'}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    );
  };

  // Modifier renderCurrentStep pour inclure le résumé
  const renderCurrentStep = () => {
    const currentStep = getFilteredSteps()[formStep];
    
    switch (currentStep.type) {
      case 'versus':
        return renderVersusSection(currentStep.category);
      case 'summary':
        return renderSummary();
      default:
        if (formStep === 0) return renderBasicFields();
        if (formStep === 1) return renderCulinaryPreferences();
        return null;
    }
  };

  // Navigation entre les étapes
  const handleNext = () => {
    const filteredSteps = getFilteredSteps();
    if (formStep < filteredSteps.length - 1) {
      setFormStep(formStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (formStep > 0) {
      setFormStep(formStep - 1);
    }
  };

  // Modifier la fonction isStepValid pour éviter la déclaration dans le case
  const isStepValid = () => {
    const currentStep = getFilteredSteps()[formStep];
    
    // Déplacer la déclaration en dehors du switch
    const basicFieldsValid = 
      formData.date && 
      formData.groupSize > 0 && 
      formData.clientType && 
      formData.budget > 0;
    
    switch (currentStep.type) {
      case 'basic':
        // Vérifier que au moins un service est sélectionné
        if (formData.services.length === 0) {
          return false;
        }
        
        // Si activités est sélectionné, vérifier le moment de la journée
        if (formData.services.includes('activities')) {
          return basicFieldsValid && formData.activityTime;
        }

        return basicFieldsValid;
      
      case 'culinary':
        return (
          formData.cuisineTypes.length > 0 && 
          formData.restaurantTime
        );
      
      case 'versus':
        switch (currentStep.category) {
          case 'restaurant':
            return (
              formData.restaurantVersus.ambiance &&
              formData.restaurantVersus.experience &&
              formData.restaurantVersus.decoration
            );
          case 'activity':
            return (
              formData.activityVersus.mood &&
              formData.activityVersus.location &&
              formData.activityVersus.intensity
            );
          case 'accommodation':
            return (
              formData.accommodationVersus.setting &&
              formData.accommodationVersus.ambiance &&
              formData.accommodationVersus.services
            );
          default:
            return false;
        }
      
      case 'summary':
        return true;
      
      default:
        return false;
    }
  };

  // Modifier le message de succès avec un design plus élaboré
  const showSuccessMessage = () => {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '500px',
          bgcolor: 'background.paper',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          p: { xs: 3, sm: 4 },
          textAlign: 'center',
          zIndex: 1000,
          overflow: 'hidden'
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Cercle décoratif en arrière-plan */}
          <Box
            sx={{
              position: 'absolute',
              top: '-50px',
              left: '-50px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)',
              opacity: 0.1
            }}
          />
          
          {/* Icône animée */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
          >
            <Box
              sx={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)'
              }}
            >
              <Check sx={{ fontSize: 40, color: 'white' }} />
            </Box>
          </motion.div>

          {/* Texte animé */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: '#2C3E50',
                mb: 2
              }}
            >
              Félicitations !
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3,
                color: '#4A5568',
                lineHeight: 1.6
              }}
            >
              Nous avons bien reçu vos préférences. Notre équipe va étudier votre demande avec attention pour vous proposer un itinéraire personnalisé.
            </Typography>
            
            <Box
              sx={{
                p: 2,
                mb: 3,
                bgcolor: 'rgba(72, 187, 120, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(72, 187, 120, 0.2)'
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#38A169',
                  fontWeight: 500
                }}
              >
                Vous recevrez très prochainement un email avec notre proposition d'itinéraire sur-mesure.
              </Typography>
            </Box>
          </motion.div>

          {/* Bouton animé */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              variant="contained" 
              onClick={() => {
                document.querySelector('[style*="background-color: rgba(0, 0, 0, 0.5)"]')?.remove();
                navigate('/');
              }}
              sx={{
                background: 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)',
                boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)',
                px: 4,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #38A169 0%, #2F855A 100%)',
                  boxShadow: '0 6px 16px rgba(72, 187, 120, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Retour à l'accueil
            </Button>
          </motion.div>
        </motion.div>
      </Box>
    );
  };

  // Modifier la fonction handleSubmit
  const handleSubmit = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const moodFormData = {
        userId: user.uid,
        userEmail: user.email,
        formData: {
          ...formData,
          date: formData.date ? formData.date.toISOString() : null,
        },
        createdAt: serverTimestamp(),
        status: 'pending',
      };

      await addDoc(collection(db, 'moodforms'), moodFormData);
      
      // Afficher le message de succès
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      container.style.zIndex = '999';
      document.body.appendChild(container);

      const root = createRoot(container);
      root.render(showSuccessMessage());

    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert('Une erreur est survenue lors de l\'enregistrement de vos préférences.');
    }
  };

  // Modifier le rendu des boutons de navigation pour ajouter un message d'erreur
  const renderNavigationButtons = () => {
    const filteredSteps = getFilteredSteps();
    const isLastStep = formStep === filteredSteps.length - 1;
    const isFirstStep = formStep === 0;
    const isCurrentStepValid = isStepValid();

    return (
      <>
        {!isCurrentStepValid && (
          <Typography 
            color="error" 
            sx={{ 
              mt: 2, 
              textAlign: 'center',
              fontSize: '0.9rem'
            }}
          >
            Veuillez remplir tous les champs obligatoires pour continuer
          </Typography>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={isFirstStep}
            startIcon={<ArrowBack />}
            fullWidth={matches}
          >
            Précédent
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={isLastStep ? <Check /> : <ArrowForward />}
            fullWidth={matches}
            disabled={!isCurrentStepValid}
            sx={{
              opacity: isCurrentStepValid ? 1 : 0.7,
              '&:disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)'
              }
            }}
          >
            {isLastStep ? 'Terminer' : 'Suivant'}
          </Button>
        </Box>
      </>
    );
  };

  // Rendu principal du composant
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
          <StyledContainer className={styles.formContainer}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((formStep + 1) / getFilteredSteps().length) * 100}%` }}
              className={styles["progress-bar"]}
            />

            <Box position="relative" mb={{ xs: 2, sm: 3 }}>
              {formStep > 0 && (
                <div 
                  className={styles.backArrow}
                  onClick={handleBack}
                  aria-label="Question précédente"
                >
                  <ArrowBack sx={{ fontSize: '1.5rem', color: '#2C3E50' }} />
                </div>
              )}
              
              <Typography 
                variant="h4" 
                align="center" 
                className={styles.formTitle}
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                {getFilteredSteps()[formStep].title}
              </Typography>
            </Box>

            <AnimatePresence mode="wait">
              <motion.div
                key={formStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>

            {renderNavigationButtons()}
          </StyledContainer>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default MoodForm;