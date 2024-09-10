import React, { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { collection, addDoc, updateDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
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
import { bordeauxData } from "../data/bordeauxData";
import styles from "./Search.module.css";

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
    needsGroupCreation: false,
    groupName: "",
    invitedUsers: [],
    personCount: 1,
    mainServices: [],
    ambiance: "",
  });
  const [searchResults, setSearchResults] = useState(null);
  const [searchId, setSearchId] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [isGroupSearch, setIsGroupSearch] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [allMembersSubmitted, setAllMembersSubmitted] = useState(false);

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
        const groupDoc = await getDoc(doc(db, "groups", groupId));
        if (groupDoc.exists()) {
          const groupData = groupDoc.data();
          const allSubmitted = groupData.members.every(member => 
            groupData.memberPreferences && groupData.memberPreferences[member]
          );
          setAllMembersSubmitted(allSubmitted);
        }
      };
      checkAllMembersSubmitted();
    }
  }, [isGroupSearch, groupId]);

  const checkGroupRole = useCallback(async (groupId) => {
    const groupDoc = await getDoc(doc(db, "groups", groupId));
    if (groupDoc.exists()) {
      const groupData = groupDoc.data();
      const isCreator = groupData.createdBy === user.uid;
      if (isCreator) {
        setUserRole('creator');
        setStep(0);  // Le créateur commence à l'étape ComposeTripType
        setFormData(prevData => ({
          ...prevData,
          tripType: groupData.tripType || "",
          dates: groupData.dates || { start: null, end: null },
          budget: groupData.budget || "",
          groupName: groupData.name || "",
          personCount: groupData.members ? groupData.members.length : 1,
        }));
      } else {
        setUserRole('member');
        setStep(1);  // Les membres commencent à PersonalizeAdvanced
      }
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
              await updateDoc(doc(db, "searches", searchId), {
                [field]: value,
                lastUpdated: serverTimestamp(),
              });
              console.log(`Firebase updated for ${field}`);
            } catch (error) {
              console.error("Error updating Firebase:", error);
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

  const saveSearchData = useCallback(async (includeGroup = false) => {
    try {
      const searchData = {
        userId: user.uid,
        lastUpdated: serverTimestamp(),
        ...formData
      };

      if (searchId) {
        await updateDoc(doc(db, "searches", searchId), searchData);
        console.log("Search data updated");
      } else {
        searchData.createdAt = serverTimestamp();
        const docRef = await addDoc(collection(db, "searches"), searchData);
        setSearchId(docRef.id);
        console.log("Search data saved with ID: ", docRef.id);
      }
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  }, [formData, searchId, user.uid]);

  const saveGroupMemberPreferences = async () => {
    if (!isGroupSearch || !groupId) return;

    try {
      const groupRef = doc(db, "groups", groupId);
      const groupDoc = await getDoc(groupRef);

      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        const memberPreferences = groupData.memberPreferences || {};

        memberPreferences[user.uid] = {
          activityPreferences: formData.activityPreferences,
          accommodationPreferences: formData.accommodationPreferences,
          restaurantPreferences: formData.restaurantPreferences,
          personalization: {
            personalizationType: formData.personalizationType,
            ambiance: formData.ambiance,
            activities: formData.activities,
            accessibility: formData.accessibility,
          },
        };

        await updateDoc(groupRef, { memberPreferences });
        console.log("Member preferences saved successfully");
      }
    } catch (error) {
      console.error("Error saving member preferences:", error);
    }
  };

  const nextStep = useCallback(() => {
    console.log("Next step called");
    setStep((prevStep) => {
      const newStep = prevStep + 1;
      console.log(`Moving to next step. New step: ${newStep}`);
      saveSearchData(newStep === 1);
      if (isGroupSearch) {
        saveGroupMemberPreferences();
      }
      return newStep;
    });
  }, [saveSearchData, isGroupSearch]);

  const prevStep = useCallback(() => {
    console.log("Previous step called");
    setStep((prevStep) => {
      const newStep = prevStep - 1;
      console.log(`Moving to previous step. New step: ${newStep}`);
      return newStep;
    });
  }, []);

  const performSearch = useCallback(async () => {
    console.log("Performing search with formData:", formData);

    if (isGroupSearch && !allMembersSubmitted) {
      alert("Tous les membres du groupe n'ont pas encore rempli leurs préférences.");
      return;
    }

    let groupPreferences = [];
    if (groupId) {
      const groupDoc = await getDoc(doc(db, "groups", groupId));
      if (groupDoc.exists()) {
        groupPreferences = Object.values(groupDoc.data().memberPreferences || {});
      }
    }

    const weightResults = (results, preferences) => {
      return results.map(item => {
        let score = 0;
        preferences.forEach(pref => {
          if (item.type && pref.accommodationPreferences?.types?.includes(item.type)) {
            score += 1;
          }
          if (item.category && pref.activityPreferences?.types?.includes(item.category)) {
            score += 1;
          }
          if (item.cuisine && pref.restaurantPreferences?.cuisineTypes?.includes(item.cuisine)) {
            score += 1;
          }
          // Ajoutez d'autres critères de pondération ici
        });
        return { ...item, score: score / preferences.length };
      });
    };

    let hotels = bordeauxData.hotels.filter(
      (hotel) =>
        hotel.price <= formData.budget &&
        formData.accommodationPreferences.types?.includes(hotel.type)
    );
    let activities = bordeauxData.activities.filter(
      (activity) =>
        activity.price <= formData.budget &&
        formData.activityPreferences.types?.some((type) =>
          activity.category.includes(type)
        )
    );
    let restaurants = bordeauxData.restaurants.filter(
      (restaurant) =>
        restaurant.price <= formData.budget &&
        formData.restaurantPreferences.cuisineTypes?.some((type) =>
          restaurant.cuisine.includes(type)
        )
    );

    if (isGroupSearch && groupPreferences.length > 0) {
      hotels = weightResults(hotels, [...groupPreferences, formData]);
      activities = weightResults(activities, [...groupPreferences, formData]);
      restaurants = weightResults(restaurants, [...groupPreferences, formData]);

      hotels.sort((a, b) => b.score - a.score);
      activities.sort((a, b) => b.score - a.score);
      restaurants.sort((a, b) => b.score - a.score);
    }

    const results = { hotels, activities, restaurants };
    console.log("Search results:", results);
    setSearchResults(results);
    saveSearchData();
    nextStep();
  }, [formData, groupId, isGroupSearch, allMembersSubmitted, saveSearchData, nextStep]);

  const renderStep = useCallback(() => {
    console.log(`Rendering step ${step}`);
    const totalSteps = isGroupSearch ? (userRole === 'creator' ? 7 : 5) : 7;

    switch (step) {
      case 0:
        return (userRole === 'creator' || !isGroupSearch) ? (
          <ComposeTripType
            formData={memoizedFormData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            isGroupSearch={isGroupSearch}
            userRole={userRole}
          />
        ) : null;
      case 1:
        return (userRole === 'creator' || !isGroupSearch) ? (
          <ComposeTrip
            formData={memoizedFormData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
            currentStep={step + 1}
            totalSteps={totalSteps}
            isGroupSearch={isGroupSearch}
            userRole={userRole}
          />
        ) : (
          <PersonalizeAdvanced
            formData={memoizedFormData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={null}
            isGroupSearch={isGroupSearch}
            userRole={userRole}
          />
        );
      case 2:
        return (
          <RestaurantPreferences
            formData={memoizedFormData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
            isGroupSearch={isGroupSearch}
            userRole={userRole}
          />
        );
      case 3:
        return (
          <AccommodationPreferences
            formData={memoizedFormData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
            isGroupSearch={isGroupSearch}
            userRole={userRole}
          />
        );
      case 4:
        return (
          <ActivityPreferences
            formData={memoizedFormData}
            handleInputChange={handleInputChange}
            nextStep={userRole === 'creator' ? nextStep : performSearch}
            prevStep={prevStep}
            isGroupSearch={isGroupSearch}
            userRole={userRole}
          />
        );
      case 5:
        return userRole === 'creator' ? (
          <PersonalizeAdvanced
            formData={memoizedFormData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
            isGroupSearch={isGroupSearch}
            userRole={userRole}
          />
        ) : (
          <SearchResults results={searchResults} isGroupSearch={isGroupSearch} userRole={userRole} />
        );
      case 6:
        return userRole === 'creator' ? performSearch() : null;
      case 7:
        return <SearchResults results={searchResults} isGroupSearch={isGroupSearch} userRole={userRole} />;
      default:
        return null;
    }
  }, [step, memoizedFormData, handleInputChange, nextStep, prevStep, performSearch, searchResults, isGroupSearch, userRole]);

  return (
    <div className={styles.searchPage}>
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

export default Search;