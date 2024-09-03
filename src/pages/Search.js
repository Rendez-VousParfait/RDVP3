import React, { useState, useContext, useEffect } from "react";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swiper from "../components/Swiper";
import ComposeTripType from "../components/SearchSteps/ComposeTripType";
import ComposeTrip from "../components/SearchSteps/ComposeTrip";
import PersonalizeAdvanced from "../components/SearchSteps/PersonalizeAdvanced";
import RestaurantPreferences from "../components/SearchSteps/RestaurantPreferences";
import AccommodationPreferences from "../components/SearchSteps/AccommodationPreferences";
import ActivityPreferences from "../components/SearchSteps/ActivityPreferences";
import SearchResults from "../components/SearchResults";
import GroupCreationStep from "../components/GroupCreationStep";
import { bordeauxData } from "../data/bordeauxData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./Search.module.css";

const Search = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    swiperPreferences: { liked: {}, disliked: {} },
    tripType: "",
    dates: [],
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
  });
  const [searchResults, setSearchResults] = useState(null);
  const [searchId, setSearchId] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { state: { from: "/search" } });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    console.log("Current formData:", JSON.stringify(formData, null, 2));
  }, [formData]);

  const handleInputChange = (name, value) => {
    console.log(`Updating ${name} with value:`, value);
    setFormData((prevData) => {
      let processedValue = value;

      if (name === 'personCount') {
        processedValue = parseInt(value, 10) || 1;
      } else if (name === 'budget') {
        processedValue = value.toString() || "0";
      } else if (name === 'dates' || name === 'activities' || name === 'invitedUsers') {
        processedValue = Array.isArray(value) ? value : [];
      } else if (typeof value === 'object' && value !== null) {
        processedValue = { ...prevData[name], ...value };
      }

      if (name === 'swiperPreferences') {
        if (processedValue.liked && processedValue.liked.undefined) {
          delete processedValue.liked.undefined;
        }
      }

      const newData = {
        ...prevData,
        [name]: processedValue,
      };
      console.log("New formData:", newData);
      return newData;
    });
  };

  const saveSearchData = async (includeGroup = false) => {
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

      if (includeGroup && formData.needsGroupCreation) {
        const groupData = {
          name: formData.groupName,
          createdAt: serverTimestamp(),
          createdBy: user.uid,
          members: [user.email],
          searchId: searchId,
          tripDetails: formData,
        };
        const groupRef = await addDoc(collection(db, "groups"), groupData);
        handleInputChange("groupId", groupRef.id);
        console.log("Group created with ID: ", groupRef.id);
      }
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  const nextStep = () => {
    console.log(`Moving to next step. Current step: ${step}`);
    setStep(step + 1);
    saveSearchData(step === 2); // Créer le groupe à l'étape 2 si nécessaire
  };

  const prevStep = () => {
    console.log(`Moving to previous step. Current step: ${step}`);
    setStep(step - 1);
  };

  const handleGroupCreated = (newGroup) => {
    handleInputChange("groupName", newGroup.name);
    saveSearchData(true);
  };

  const handleInviteSent = async ({ email }) => {
    const updatedInvitedUsers = [...formData.invitedUsers, email];
    handleInputChange("invitedUsers", updatedInvitedUsers);
    await saveSearchData();

    // Mise à jour du document du groupe
    if (formData.groupId) {
      try {
        await updateDoc(doc(db, "groups", formData.groupId), {
          members: updatedInvitedUsers,
          lastUpdated: serverTimestamp(),
        });
        console.log("Group updated with new member");
      } catch (error) {
        console.error("Error updating group: ", error);
      }
    }
  };

  const performSearch = () => {
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
  };

  const renderStep = () => {
    console.log(`Rendering step ${step}`);
    switch (step) {
      case 0:
        return (
          <Swiper
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
          />
        );
      case 1:
        return (
          <ComposeTripType
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
          />
        );
      case 2:
        return formData.needsGroupCreation ? (
          <GroupCreationStep
            formData={formData}
            handleInputChange={handleInputChange}
            handleGroupCreated={handleGroupCreated}
            handleInviteSent={handleInviteSent}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        ) : (
          <ComposeTrip
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <ComposeTrip
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <PersonalizeAdvanced
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 5:
        return (
          <RestaurantPreferences
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 6:
        return (
          <AccommodationPreferences
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 7:
        return (
          <ActivityPreferences
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={performSearch}
            prevStep={prevStep}
          />
        );
      case 8:
        return <SearchResults results={searchResults} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.searchPage}>
      <h1 className={styles.pageTitle}>Planifiez votre séjour à Bordeaux</h1>
      <div className={styles.stepIndicator}>Étape {step + 1} sur 8</div>
      {renderStep()}
      <div className={styles.navigationButtons}>
        {step > 0 && (
          <button onClick={prevStep} className={styles.navButton}>
            <FontAwesomeIcon icon={faArrowLeft} /> Précédent
          </button>
        )}
        {step < 7 && (
          <button onClick={nextStep} className={styles.navButton}>
            Suivant <FontAwesomeIcon icon={faArrowRight} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;