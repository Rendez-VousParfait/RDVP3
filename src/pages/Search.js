import React, { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { state: { from: "/search" } });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    console.log("Search formData updated:", formData);
  }, [formData]);

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

  const nextStep = useCallback(() => {
    console.log("Next step called");
    setStep((prevStep) => {
      const newStep = prevStep + 1;
      console.log(`Moving to next step. New step: ${newStep}`);
      saveSearchData(newStep === 1);
      return newStep;
    });
  }, [saveSearchData]);

  const prevStep = useCallback(() => {
    console.log("Previous step called");
    setStep((prevStep) => {
      const newStep = prevStep - 1;
      console.log(`Moving to previous step. New step: ${newStep}`);
      return newStep;
    });
  }, []);

  const performSearch = useCallback(() => {
    console.log("Performing search with formData:", formData);
    const results = {
      hotels: bordeauxData.hotels.filter(
        (hotel) =>
          hotel.price <= formData.budget &&
          formData.accommodationPreferences.types?.includes(hotel.type),
      ),
      activities: bordeauxData.activities.filter(
        (activity) =>
          activity.price <= formData.budget &&
          formData.activityPreferences.types?.some((type) =>
            activity.category.includes(type),
          ),
      ),
      restaurants: bordeauxData.restaurants.filter(
        (restaurant) =>
          restaurant.price <= formData.budget &&
          formData.restaurantPreferences.cuisineTypes?.some((type) =>
            restaurant.cuisine.includes(type),
          ),
      ),
    };
    console.log("Search results:", results);
    setSearchResults(results);
    saveSearchData();
    nextStep();
  }, [formData, saveSearchData, nextStep]);

  const renderStep = useCallback(() => {
    console.log(`Rendering step ${step}`);
    switch (step) {
      case 0:
        return (
          <ComposeTripType
            formData={memoizedFormData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
          />
        );
      case 1:
        return (
          <TripOrganizationChoice
            nextStep={nextStep}
            currentStep={step + 1}
            totalSteps={7}
          />
        );
      case 2:
        return (
          <ComposeTrip
            formData={memoizedFormData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
            currentStep={step + 1}
            totalSteps={7}
          />
        );
      case 3:
        return (
          <PersonalizeAdvanced
            formData={memoizedFormData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <RestaurantPreferences
            formData={memoizedFormData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 5:
        return (
          <AccommodationPreferences
            formData={memoizedFormData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 6:
        return (
          <ActivityPreferences
            formData={memoizedFormData}
            handleInputChange={handleInputChange}
            nextStep={performSearch}
            prevStep={prevStep}
          />
        );
      case 7:
        return <SearchResults results={searchResults} />;
      default:
        return null;
    }
  }, [step, memoizedFormData, handleInputChange, nextStep, prevStep, performSearch, searchResults]);

  return (
    <div className={styles.searchPage}>
      {renderStep()}
    </div>
  );
};

export default Search;