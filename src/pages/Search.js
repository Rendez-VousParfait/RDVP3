import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import ComposeTripType from "../components/SearchSteps/ComposeTripType";
import ComposeTrip from "../components/SearchSteps/ComposeTrip";
import RestaurantPreferences from "../components/SearchSteps/RestaurantPreferences";
import AccommodationPreferences from "../components/SearchSteps/AccommodationPreferences";
import ActivityPreferences from "../components/SearchSteps/ActivityPreferences";
import SearchResults from "../components/SearchResults";
import GroupSearchResults from "../components/GroupSearchResults";
import styles from "./Search.module.css";

const Search = () => {
  const app = getApp();
  const functions = getFunctions(app);
  const { loading } = useContext(AuthContext);
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    tripType: "",
    dates: { start: null, end: null },
    budget: "",
    personCount: 1,
    invitedUsers: [],
    AccommodationPreferences: {
      accomodation_type: [],
      standing: [],
      environment: [],
      equipments: [],
      style: [],
      price: null,
    },
    ActivityPreferences: {
      cadre: [],
      accessibility: false,
      environment: [],
      ambiance: [],
      duration: "",
      budget: null,
    },
    RestaurantPreferences: {
      cuisinetype: [],
      environment: [],
      ambiances: [],
      services: [],
      accessibility: false,
      price: null,
    },
  });
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGroupSearch, setIsGroupSearch] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [groupPreferences] = useState({});
  const [isBroadenedSearch, setIsBroadenedSearch] = useState(false);

  const checkGroupStatus = useCallback(async (groupId) => {
    console.log("Checking group status for groupId:", groupId);
    try {
      const checkGroupStatusFunction = httpsCallable(functions, "checkGroupStatus");
      const result = await checkGroupStatusFunction({ groupId });
      console.log("Group status result:", result.data);
      const { userRole, isCreator, /* allMembersSubmitted, */ hasSubmittedPreferences, savedSearch } = result.data;
      console.log("Setting userRole to:", userRole);
      setUserRole(userRole);

      if (savedSearch) {
        setSearchResults(savedSearch);
      }

      if (isCreator) {
        setStep(0);
      } else if (hasSubmittedPreferences) {
        setStep(5);
      }
    } catch (error) {
      console.error("Erreur détaillée lors de la vérification du statut du groupe:", error);
      setError(`Une erreur est survenue lors de la vérification du statut du groupe: ${error.message}`);
      setUserRole("member");
    }
  }, [functions]);

  useEffect(() => {
    console.log("Search component mounted");
    if (location.state && location.state.groupId) {
      console.log("Group search detected:", location.state);
      setIsGroupSearch(true);
      setGroupId(location.state.groupId);
      checkGroupStatus(location.state.groupId);
    } else {
      console.log("Individual search detected");
      setIsGroupSearch(false);
      setGroupId(null);
      setUserRole(null);
    }
  }, [location.state, checkGroupStatus]);

  useEffect(() => {
    console.log("Firebase app initialized:", !!app);
    console.log("Functions initialized:", !!functions);
    console.log("httpsCallable available:", typeof httpsCallable === "function");
  }, [app, functions]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handlePreferencesChange = useCallback((category, name, value) => {
    console.log(`Preferences changed: ${category}.${name} = ${value}`);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [category]: {
        ...prevFormData[category],
        [name]: value,
      },
    }));
  }, []);

  const nextStep = useCallback(() => {
    console.log("Moving to next step");
    setStep((prevStep) => prevStep + 1);
  }, []);

  const prevStep = useCallback(() => {
    console.log("Moving to previous step");
    setStep((prevStep) => prevStep - 1);
  }, []);

  const performSearch = useCallback(async (broaden = false) => {
    setIsLoading(true);
    setError(null);
    setIsBroadenedSearch(broaden);

    // Nettoyage et préparation des données
    const cleanedFormData = {
      ...formData,
      AccommodationPreferences: {
        ...formData.AccommodationPreferences,
        price: parseFloat(formData.AccommodationPreferences?.price) || null,
      },
      ActivityPreferences: {
        ...formData.ActivityPreferences,
        budget: parseFloat(formData.ActivityPreferences?.budget) || null,
      },
      RestaurantPreferences: {
        ...formData.RestaurantPreferences,
        budget: parseFloat(formData.RestaurantPreferences?.budget) || null,
      },
      budget: parseFloat(formData.budget) || null,
    };

    // Assurez-vous que les tableaux ne sont pas vides et que les objets existent
    Object.keys(cleanedFormData).forEach(key => {
      if (typeof cleanedFormData[key] === "object" && cleanedFormData[key] !== null) {
        Object.keys(cleanedFormData[key]).forEach(subKey => {
          if (Array.isArray(cleanedFormData[key][subKey]) && cleanedFormData[key][subKey].length === 0) {
            delete cleanedFormData[key][subKey];
          }
        });
      }
      if (Array.isArray(cleanedFormData[key]) && cleanedFormData[key].length === 0) {
        delete cleanedFormData[key];
      }
    });

    console.log("Données de formulaire nettoyées envoyées pour la recherche:", cleanedFormData);

    try {
      const searchFunction = httpsCallable(functions, "performSearch");
      const result = await searchFunction({ formData: cleanedFormData, broaden });
      console.log("Résultats bruts reçus de performSearch:", result);
      
      if (result.data && Object.values(result.data).some(arr => arr && arr.length > 0)) {
        const formattedResults = {
          hotels: result.data.hotels?.map(hotel => ({...hotel, type: "hotel", price: parseFloat(hotel.price) || null})) || [],
          activities: result.data.activities?.map(activity => ({...activity, type: "activity", budget: parseFloat(activity.budget) || null})) || [],
          restaurants: result.data.restaurants?.map(restaurant => ({...restaurant, type: "restaurant", budget: parseFloat(restaurant.budget) || null})) || [],
        };
        setSearchResults(formattedResults);
        setStep(5);
      } else {
        console.warn("Aucun résultat trouvé");
        setError("Aucun résultat trouvé. Veuillez modifier vos préférences.");
      }
    } catch (error) {
      console.error("Erreur détaillée lors de la recherche individuelle:", error);
      setError(`Une erreur est survenue lors de la recherche: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [formData, functions, setStep]);

  const performGroupSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Lancement de la recherche de groupe pour:", groupId);
      const performGroupSearchFunction = httpsCallable(functions, "performGroupSearch");
      const result = await performGroupSearchFunction({ groupId });
      console.log("Résultats bruts de la recherche de groupe:", result);
      
      if (result.data && (result.data.activities.length > 0 || result.data.restaurants.length > 0 || result.data.hotels.length > 0)) {
        console.log("Résultats valides trouvés, mise à jour de searchResults");
        setSearchResults(result.data);
        setStep(5);
      } else {
        console.log("Aucun résultat trouvé ou résultats invalides");
        setError("Aucun résultat trouvé. Veuillez élargir vos critères de recherche.");
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de groupe:", error);
      setError("Une erreur est survenue lors de la recherche de groupe.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSearch = useCallback(async () => {
    console.log("Saving search for group:", groupId);
    try {
      const saveSearchFunction = httpsCallable(functions, "saveGroupSearch");
      await saveSearchFunction({ groupId, searchResults });
      console.log("Search saved successfully");
      alert("La recherche a été enregistrée avec succès !");
    } catch (error) {
      console.error("Erreur détaillée lors de la sauvegarde de la recherche:", error);
      console.error("Stack trace:", error.stack);
      console.error("Error code:", error.code);
      setError(`Une erreur est survenue lors de la sauvegarde de la recherche: ${error.message}`);
    }
  }, [groupId, searchResults, functions]);

  const handleSaveParticipation = useCallback(async () => {
    console.log("Saving participation for group:", groupId);
    try {
      const saveParticipationFunction = httpsCallable(functions, "saveGroupParticipation");
      await saveParticipationFunction({ groupId, searchResults });
      console.log("Participation saved successfully");
      alert("Votre participation a été enregistrée avec succès !");
    } catch (error) {
      console.error("Erreur détaillée lors de la sauvegarde de la participation:", error);
      console.error("Stack trace:", error.stack);
      console.error("Error code:", error.code);
      setError(`Une erreur est survenue lors de la sauvegarde de votre participation: ${error.message}`);
    }
  }, [groupId, searchResults, functions]);

  const commonProps = useMemo(
    () => ({
      formData,
      handleInputChange,
      handlePreferencesChange,
      currentStep: step,
      totalSteps: isGroupSearch ? 2 : 6,
      isGroupSearch,
      groupId,
      userRole,
    }),
    [formData, handleInputChange, handlePreferencesChange, step, isGroupSearch, groupId, userRole]
  );

  const searchResultsProps = useMemo(
    () => ({
      results: searchResults,
      isGroupSearch,
      userRole,
      groupId,
      onSaveSearch: handleSaveSearch,
      onSaveParticipation: handleSaveParticipation,
    }),
    [searchResults, isGroupSearch, userRole, groupId, handleSaveSearch, handleSaveParticipation]
  );

  const renderStep = useMemo(() => {
    console.log("Rendering step:", step, "userRole:", userRole, "searchResults:", searchResults);
    if (isGroupSearch) {
      // Logique pour la recherche de groupe
      switch (step) {
        case 0:
          return (
            <ComposeTrip
              formData={formData}
              handleInputChange={handleInputChange}
              nextStep={performGroupSearch}
              isGroupSearch={isGroupSearch}
              groupId={groupId}
              userRole={userRole}
            />
          );
        case 5:
          if (searchResults) {
            console.log("Rendering GroupSearchResults with:", searchResults);
            return (
              <GroupSearchResults 
                results={searchResults}
                groupId={groupId}
                onSaveSearch={handleSaveSearch}
                onSaveParticipation={handleSaveParticipation}
                isMember={userRole === "member"}
                userRole={userRole}
              />
            );
          } else {
            console.log("searchResults is null, rendering waiting message");
            return (
              <div className={styles.waitingForResults}>
                En attente des résultats de la recherche de groupe...
              </div>
            );
          }
        default:
          return null;
      }
    } else {
      // Logique pour la recherche individuelle
      switch (step) {
        case 0:
          return <ComposeTripType {...commonProps} nextStep={nextStep} />;
        case 1:
          return (
            <ComposeTrip
              {...commonProps}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          );
        case 2:
          return (
            <RestaurantPreferences
              {...commonProps}
              nextStep={nextStep}
              prevStep={prevStep}
              isGroupSearch={isGroupSearch}
              userRole={userRole}
              currentStep={step + 1}
              totalSteps={isGroupSearch ? 2 : 6}
            />
          );
        case 3:
          return (
            <AccommodationPreferences
              {...commonProps}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          );
        case 4:
          return (
            <ActivityPreferences
              {...commonProps}
              nextStep={performSearch}
              prevStep={prevStep}
            />
          );
        case 5:
          return (
            <SearchResults
              results={searchResults}
              isGroupSearch={isGroupSearch}
              userRole={userRole}
              onSaveSearch={handleSaveSearch}
              onSaveParticipation={handleSaveParticipation}
              isBroadenedSearch={isBroadenedSearch}
            />
          );
        default:
          return null;
      }
    }
  }, [
    step,
    commonProps,
    nextStep,
    prevStep,
    performSearch,
    userRole,
    searchResultsProps,
    isGroupSearch,
    searchResults,
    groupPreferences,
    isBroadenedSearch,
    performGroupSearch,
    groupId,
    handleSaveSearch,
    handleSaveParticipation
  ]);

  if (loading) {
    console.log("Loading user data");
    return <div className={styles.loading}>Chargement...</div>;
  }

  console.log("Rendering Search component, userRole:", userRole);
  return (
    <div className={styles.searchPage}>
      {isLoading && (
        <div className={styles.loadingOverlay}>Recherche en cours...</div>
      )}
      {error && <div className={styles.error}>{error}</div>}
      {renderStep}
    </div>
  );
};

export default Search;
