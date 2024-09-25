import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { getFunctions, httpsCallable } from "firebase/functions";
import ComposeTripType from "../components/SearchSteps/ComposeTripType";
import ComposeTrip from "../components/SearchSteps/ComposeTrip";
import PersonalizeAdvanced from "../components/SearchSteps/PersonalizeAdvanced";
import RestaurantPreferences from "../components/SearchSteps/RestaurantPreferences";
import AccommodationPreferences from "../components/SearchSteps/AccommodationPreferences";
import ActivityPreferences from "../components/SearchSteps/ActivityPreferences";
import SearchResults from "../components/SearchResults";
import styles from "./Search.module.css";

const Search = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [searchId, setSearchId] = useState(null);
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
  const [isGroupSearch, setIsGroupSearch] = useState(() => {
    return !!(location.state && location.state.groupId);
  });
  const [userRole, setUserRole] = useState("member");
  const [allMembersSubmitted, setAllMembersSubmitted] = useState(false);
  const [groupId, setGroupId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.groupId) {
      setIsGroupSearch(true);
      setGroupId(location.state.groupId);
      checkGroupStatus(location.state.groupId);
    } else {
      setIsGroupSearch(false);
      setGroupId(null);
    }
  }, [location.state]);

  useEffect(() => {
    console.log("isGroupSearch:", isGroupSearch);
  }, [isGroupSearch]);

  const checkGroupStatus = useCallback(async (groupId) => {
    try {
      const functions = getFunctions();
      const checkGroupStatusFunction = httpsCallable(
        functions,
        "checkGroupStatus"
      );
      const result = await checkGroupStatusFunction({ groupId });
      const { isCreator, allMembersSubmitted, groupData } = result.data;
      setUserRole(isCreator ? "creator" : "member");
      setAllMembersSubmitted(allMembersSubmitted);
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...groupData,
      }));
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du statut du groupe:",
        error
      );
      setError(
        "Une erreur est survenue lors de la vérification du statut du groupe."
      );
    }
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handlePreferencesChange = useCallback((category, name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [category]: {
        ...prevFormData[category],
        [name]: value,
      },
    }));
  }, []);

  const handleDateChange = useCallback((type, date) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      dates: {
        ...prevFormData.dates,
        [type]: date,
      },
    }));
  }, []);

  const nextStep = useCallback(() => setStep((prevStep) => prevStep + 1), []);
  const prevStep = useCallback(() => setStep((prevStep) => prevStep - 1), []);

  const performSearch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const functions = getFunctions();
      const searchFunction = httpsCallable(functions, "performSearch");
      console.log("Données envoyées à performSearch:", { formData, groupId });
      const result = await searchFunction({
        formData,
        groupId,
      });
      console.log("Résultats reçus de performSearch:", result.data);
      if (result.data && Object.keys(result.data).length > 0) {
        setSearchResults(result.data);
        setStep(6); // Passer à l'étape des résultats
      } else {
        throw new Error(
          "Les données reçues ne sont pas dans le format attendu"
        );
      }
    } catch (error) {
      console.error("Erreur détaillée lors de la recherche:", error);
      setError(
        `Une erreur est survenue lors de la recherche: ${error.message}`
      );
      if (error.details) {
        console.error("Détails de l'erreur:", error.details);
      }
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  }, [formData, groupId]);

  const handleSaveSearch = useCallback(async () => {
    try {
      console.log("Sauvegarde de la recherche pour le groupe:", groupId);
      const functions = getFunctions();
      const saveSearchFunction = httpsCallable(functions, "saveGroupSearch");
      await saveSearchFunction({ groupId, searchResults });
      alert("La recherche a été enregistrée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la recherche:", error);
      setError("Une erreur est survenue lors de la sauvegarde de la recherche.");
    }
  }, [groupId, searchResults]);

  const commonProps = useMemo(
    () => ({
      formData,
      handleInputChange,
      handlePreferencesChange,
      handleDateChange,
      currentStep: step + 1,
      totalSteps: 7,
    }),
    [formData, handleInputChange, handlePreferencesChange, handleDateChange, step]
  );

  const searchResultsProps = useMemo(() => ({
    results: searchResults,
    isGroupSearch,
    userRole,
    groupId,
    onSaveSearch: handleSaveSearch
  }), [searchResults, isGroupSearch, userRole, groupId, handleSaveSearch]);

  const renderStep = useMemo(() => {
    switch (step) {
      case 0:
        return <ComposeTripType {...commonProps} nextStep={nextStep} />;
      case 1:
        return (
          <ComposeTrip
            {...commonProps}
            nextStep={nextStep}
            prevStep={prevStep}
            isGroupSearch={isGroupSearch}
          />
        );
      case 2:
        return (
          <RestaurantPreferences
            {...commonProps}
            nextStep={nextStep}
            prevStep={prevStep}
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
            nextStep={userRole === "creator" ? nextStep : performSearch}
            prevStep={prevStep}
          />
        );
      case 5:
        return userRole === "creator" ? (
          <PersonalizeAdvanced
            {...commonProps}
            nextStep={performSearch}
            prevStep={prevStep}
          />
        ) : (
          <div className={styles.waitingForCreator}>
            En attente que le créateur lance la recherche...
          </div>
        );
      case 6:
        return searchResults ? <SearchResults {...searchResultsProps} /> : null;
      default:
        return null;
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
  ]);

  if (loading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  return (
    <div className={styles.searchPage}>
      {isLoading && (
        <div className={styles.loadingOverlay}>Recherche en cours...</div>
      )}
      {isGroupSearch && userRole === "creator" && (
        <div className={styles.groupProgressIndicator}>
          {allMembersSubmitted
            ? "Tous les membres ont rempli leurs préférences. Vous pouvez lancer la recherche."
            : "En attente que tous les membres remplissent leurs préférences..."}
        </div>
      )}
      {error && <div className={styles.error}>{error}</div>}
      {renderStep}
    </div>
  );
};

export default Search;