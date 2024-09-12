import React, { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { collection, addDoc, updateDoc, doc, serverTimestamp, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import ComposeTripType from "../components/SearchSteps/ComposeTripType";
import ComposeTrip from "../components/SearchSteps/ComposeTrip";
import PersonalizeAdvanced from "../components/SearchSteps/PersonalizeAdvanced";
import RestaurantPreferences from "../components/SearchSteps/RestaurantPreferences";
import AccommodationPreferences from "../components/SearchSteps/AccommodationPreferences";
import ActivityPreferences from "../components/SearchSteps/ActivityPreferences";
import SearchResults from "../components/SearchResults";
import TripOrganizationChoice from "../components/TripOrganizationChoice";
import styles from "./Search.module.css";

const COLLECTIONS = {
  SEARCHES: 'searches',
  GROUPS: 'groups',
  HOTELS: 'hotels',
  ACTIVITIES: 'activities',
  RESTAURANTS: 'restaurants',
};

const Search = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    tripType: "",
    dates: { start: null, end: null },
    budget: "",
    activities: [],
    personalization: {},
    restaurantPreferences: { cuisineTypes: [] },
    accommodationPreferences: { types: [] },
    activityPreferences: { types: [] },
    personCount: 1,
    mainServices: [],
    ambiance: "",
    personalizationType: null,
    accessibility: "",
    invitedUsers: [],
  });
  const [searchResults, setSearchResults] = useState(null);
  const [searchId, setSearchId] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [isGroupSearch, setIsGroupSearch] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [allMembersSubmitted, setAllMembersSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { state: { from: "/search" } });
    }
    const params = new URLSearchParams(location.search);
    const groupIdFromUrl = params.get('groupId');
    if (groupIdFromUrl) {
      setGroupId(groupIdFromUrl);
      setIsGroupSearch(true);
      checkGroupRole(groupIdFromUrl);
    }
  }, [user, loading, navigate, location]);

  useEffect(() => {
    if (isGroupSearch && groupId) {
      const checkAllMembersSubmitted = async () => {
        try {
          const groupDoc = await getDoc(doc(db, COLLECTIONS.GROUPS, groupId));
          if (groupDoc.exists()) {
            const groupData = groupDoc.data();
            const allSubmitted = groupData.members.every(member => 
              groupData.memberPreferences && groupData.memberPreferences[member]
            );
            setAllMembersSubmitted(allSubmitted);
          }
        } catch (error) {
          console.error("Error checking member submissions:", error);
          setError("Erreur lors de la vérification des soumissions des membres.");
        }
      };
      checkAllMembersSubmitted();
    }
  }, [isGroupSearch, groupId]);

  useEffect(() => {
    if (formData.tripType === "amis" || formData.tripType === "famille") {
      const invitedCount = formData.invitedUsers?.length || 0;
      handleInputChange('personCount', invitedCount + 1); // +1 pour inclure le créateur
    } else if (formData.tripType === "couple") {
      handleInputChange('personCount', 2);
    }
  }, [formData.tripType, formData.invitedUsers]);

  const checkGroupRole = useCallback(async (groupId) => {
    try {
      const groupDoc = await getDoc(doc(db, COLLECTIONS.GROUPS, groupId));
      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        const isCreator = groupData.createdBy === user.uid;
        if (isCreator) {
          setUserRole('creator');
          setStep(0);
          setFormData(prevData => ({
            ...prevData,
            tripType: groupData.tripType || "",
            dates: groupData.dates || { start: null, end: null },
            budget: groupData.budget || "",
            personCount: groupData.members ? groupData.members.length : 1,
          }));
        } else {
          setUserRole('member');
          setStep(1);
        }
      }
    } catch (error) {
      console.error("Error checking group role:", error);
      setError("Erreur lors de la vérification du rôle dans le groupe.");
    }
  }, [user.uid]);

  const memoizedFormData = useMemo(() => formData, [formData]);

  const updateFirebaseData = useCallback(
    (() => {
      let timeoutId = null;
      return (field, value) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(async () => {
          if (searchId) {
            try {
              await updateDoc(doc(db, COLLECTIONS.SEARCHES, searchId), {
                [field]: value,
                lastUpdated: serverTimestamp(),
              });
              console.log(`Firebase updated for ${field}`);
            } catch (error) {
              console.error("Error updating Firebase:", error);
              setError("Erreur lors de la mise à jour des données.");
            }
          }
        }, 1000);
      };
    })(),
    [searchId]
  );

  const handleInputChange = useCallback((name, value) => {
    console.log(`Updating ${name} with value:`, value);
    setFormData((prevData) => {
      let processedValue = value;

      if (name === 'personCount') {
        processedValue = parseInt(value, 10) || 1;
      } else if (name === 'budget') {
        processedValue = value === null || value === undefined || value === "" ? null : value.toString();
      } else if (name === 'activities' || name === 'invitedUsers') {
        processedValue = Array.isArray(value) ? value : [];
      } else if (name === 'mainServices') {
        processedValue = typeof value === 'function' ? value(prevData.mainServices) : value;
      } else if (name === 'dates') {
        processedValue = {
          start: value.start instanceof Date ? value.start : new Date(value.start),
          end: value.end instanceof Date ? value.end : (value.end ? new Date(value.end) : null)
        };
      } else if (typeof value === 'object' && value !== null) {
        processedValue = { ...prevData[name], ...value };
      }

      const newData = {
        ...prevData,
        [name]: processedValue,
      };
      console.log("New formData:", newData);

      updateFirebaseData(name, processedValue);

      return newData;
    });
  }, [updateFirebaseData]);

  const saveSearchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const searchData = {
        userId: user.uid,
        lastUpdated: serverTimestamp(),
        ...formData
      };

      if (searchId) {
        await updateDoc(doc(db, COLLECTIONS.SEARCHES, searchId), searchData);
        console.log("Search data updated");
      } else {
        searchData.createdAt = serverTimestamp();
        const docRef = await addDoc(collection(db, COLLECTIONS.SEARCHES), searchData);
        setSearchId(docRef.id);
        console.log("Search data saved with ID: ", docRef.id);
      }
    } catch (error) {
      console.error("Error saving data: ", error);
      setError("Erreur lors de la sauvegarde des données de recherche.");
    } finally {
      setIsLoading(false);
    }
  }, [formData, searchId, user.uid]);

  const saveGroupMemberPreferences = async () => {
    if (!isGroupSearch || !groupId) return;

    try {
      setIsLoading(true);
      const groupRef = doc(db, COLLECTIONS.GROUPS, groupId);
      const groupDoc = await getDoc(groupRef);

      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        const memberPreferences = groupData.memberPreferences || {};

        memberPreferences[user.uid] = {
          activityPreferences: formData.activityPreferences || {},
          accommodationPreferences: formData.accommodationPreferences || {},
          restaurantPreferences: formData.restaurantPreferences || {},
          personalization: {
            personalizationType: formData.personalizationType || null,
            ambiance: formData.ambiance || "",
            activities: formData.activities || [],
            accessibility: formData.accessibility || "",
          },
        };

        console.log("Saving member preferences:", memberPreferences[user.uid]);

        await updateDoc(groupRef, { memberPreferences });
        console.log("Member preferences saved successfully");
      }
    } catch (error) {
      console.error("Error saving member preferences:", error);
      setError("Erreur lors de la sauvegarde des préférences du membre.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = useCallback(() => {
    console.log("Next step called");
    setStep((prevStep) => {
      const newStep = prevStep + 1;
      console.log(`Moving to next step. New step: ${newStep}`);
      saveSearchData();
      if (isGroupSearch) {
        saveGroupMemberPreferences();
      }
      return newStep;
    });
  }, [saveSearchData, isGroupSearch, saveGroupMemberPreferences]);

  const prevStep = useCallback(() => {
    console.log("Previous step called");
    setStep((prevStep) => {
      const newStep = prevStep - 1;
      console.log(`Moving to previous step. New step: ${newStep}`);
      return newStep;
    });
  }, []);

  const getSeasonalEvents = useCallback(() => {
    const currentDate = new Date();
    const month = currentDate.getMonth();
    if (month >= 5 && month <= 8) return "summer_events";
    if (month >= 9 && month <= 11) return "autumn_events";
    if (month === 11 || month <= 1) return "winter_events";
    return "spring_events";
  }, []);

  const weightResults = useCallback((results, preferences) => {
    const seasonalEvents = getSeasonalEvents();
    return results.map(item => {
      let score = 0;
      let matchCount = 0;
      preferences.forEach(pref => {
        if (item.type && pref.accommodationPreferences?.types?.includes(item.type)) {
          score += 2;
          matchCount++;
        }
        if (item.category && pref.activityPreferences?.types?.includes(item.category)) {
          score += 1.5;
          matchCount++;
        }
        if (item.cuisine && pref.restaurantPreferences?.cuisineTypes?.includes(item.cuisine)) {
          score += 1;
          matchCount++;
        }
        if (item.seasonalEvents && item.seasonalEvents.includes(seasonalEvents)) {
          score += 0.5;
        }
        if (pref.accessibility === "pmr" && item.accessibility === "pmr") {
          score += 1;
        }
      });
      const normalizedScore = matchCount > 0 ? score / (matchCount * preferences.length) : 0;
      return { ...item, score: normalizedScore };
    });
  }, [getSeasonalEvents]);

  const performSearch = useCallback(async () => {
    console.log("Performing search with formData:", formData);

    try {
      setIsLoading(true);
      setError(null);

      let groupPreferences = [];
      if (groupId) {
        const groupDoc = await getDoc(doc(db, COLLECTIONS.GROUPS, groupId));
        if (groupDoc.exists()) {
          groupPreferences = Object.values(groupDoc.data().memberPreferences || {});
        }
      }

      const fetchData = async (collectionName, filterFn) => {
        const q = query(collection(db, collectionName), where("price", "<=", formData.budget));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})).filter(filterFn);
      };

      let [hotels, activities, restaurants] = await Promise.all([
        fetchData(COLLECTIONS.HOTELS, hotel => formData.accommodationPreferences.types?.includes(hotel.type)),
        fetchData(COLLECTIONS.ACTIVITIES, activity => formData.activityPreferences.types?.some(type => activity.category.includes(type))),
        fetchData(COLLECTIONS.RESTAURANTS, restaurant => formData.restaurantPreferences.cuisineTypes?.some(type => restaurant.cuisine.includes(type)))
      ]);

      const preferencesToUse = groupPreferences.length > 0 ? [...groupPreferences, formData] : [formData];

      hotels = weightResults(hotels, preferencesToUse);
      activities = weightResults(activities, preferencesToUse);
      restaurants = weightResults(restaurants, preferencesToUse);

      const sortAndDiversify = (items) => {
        items.sort((a, b) => b.score - a.score);
        const topResults = items.slice(0, 10);
        const remainingResults = items.slice(10);
        const randomResults = remainingResults.sort(() => 0.5 - Math.random()).slice(0, 5);
        return [...topResults, ...randomResults];
      };

      hotels = sortAndDiversify(hotels);
      activities = sortAndDiversify(activities);
      restaurants = sortAndDiversify(restaurants);

      const results = { hotels, activities, restaurants };
      console.log("Search results:", results);
      setSearchResults(results);
      saveSearchData();
      nextStep();
    } catch (error) {
      console.error("Error performing search:", error);
      setError("Une erreur est survenue lors de la recherche. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }, [formData, groupId, saveSearchData, nextStep, weightResults]);

  const renderStep = useCallback(() => {
    console.log(`Rendering step ${step}`);
    const totalSteps = isGroupSearch ? (userRole === 'creator' ? 7 : 5) : 7;

    const commonProps = {
      formData: memoizedFormData,
      handleInputChange,
      isGroupSearch,
      userRole,
      currentStep: step + 1,
      totalSteps,
    };

    switch (step) {
      case 0:
        return (userRole === 'creator' || !isGroupSearch) ? (
          <ComposeTripType
            {...commonProps}
            nextStep={nextStep}
          />
        ) : null;
        case 1:
                if (["amis", "famille", "couple"].includes(formData.tripType) && !isGroupSearch) {
                  return (
                    <TripOrganizationChoice
                      nextStep={nextStep}
                      currentStep={step + 1}
                      totalSteps={totalSteps}
                    />
                  );
                } else {
                  return (
                    <ComposeTrip
                      {...commonProps}
                      nextStep={nextStep}
                      prevStep={prevStep}
                    />
                  );
                }
              case 2:
                return (userRole === 'creator' || !isGroupSearch) ? (
                  <ComposeTrip
                    {...commonProps}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                ) : (
                  <PersonalizeAdvanced
                    {...commonProps}
                    nextStep={nextStep}
                    prevStep={null}
                  />
                );
              case 3:
                return (
                  <RestaurantPreferences
                    {...commonProps}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                );
              case 4:
                return (
                  <AccommodationPreferences
                    {...commonProps}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                );
              case 5:
                return (
                  <ActivityPreferences
                    {...commonProps}
                    nextStep={userRole === 'creator' ? nextStep : performSearch}
                    prevStep={prevStep}
                  />
                );
              case 6:
                return userRole === 'creator' ? (
                  <PersonalizeAdvanced
                    {...commonProps}
                    nextStep={performSearch}
                    prevStep={prevStep}
                  />
                ) : (
                  <SearchResults results={searchResults} isGroupSearch={isGroupSearch} userRole={userRole} />
                );
              case 7:
                return <SearchResults results={searchResults} isGroupSearch={isGroupSearch} userRole={userRole} />;
              default:
                return null;
            }
          }, [step, memoizedFormData, handleInputChange, nextStep, prevStep, performSearch, searchResults, isGroupSearch, userRole]);

          useEffect(() => {
            if (isGroupSearch && searchResults) {
              const updateSearchResults = async () => {
                await performSearch();
              };
              updateSearchResults();
            }
          }, [isGroupSearch, searchResults, performSearch]);

          if (loading) {
            return <div className={styles.loading}>Chargement...</div>;
          }

          if (error) {
            return <div className={styles.error}>{error}</div>;
          }

          return (
            <div className={styles.searchPage}>
              {isLoading && <div className={styles.loadingOverlay}>Recherche en cours...</div>}
              {isGroupSearch && userRole === 'creator' && (
                <div className={styles.groupProgressIndicator}>
                  {allMembersSubmitted 
                    ? "Tous les membres ont rempli leurs préférences. Vous pouvez lancer la recherche."
                    : "En attente que tous les membres remplissent leurs préférences..."}
                </div>
              )}
              {renderStep()}
            </div>
          );
        };

        export default React.memo(Search);