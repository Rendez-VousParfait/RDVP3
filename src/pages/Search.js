import React, { useState, useContext, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swiper from '../components/Swiper';
import ComposeTripType from '../components/SearchSteps/ComposeTripType';
import ComposeTrip from '../components/SearchSteps/ComposeTrip';
import PersonalizeAdvanced from '../components/SearchSteps/PersonalizeAdvanced';
import RestaurantPreferences from '../components/SearchSteps/RestaurantPreferences';
import AccommodationPreferences from '../components/SearchSteps/AccommodationPreferences';
import ActivityPreferences from '../components/SearchSteps/ActivityPreferences';
import SearchResults from '../components/SearchResults';
import GroupCreationStep from '../components/GroupCreationStep';
import { bordeauxData } from '../data/bordeauxData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from './Search.module.css';

console.log("Search.js is being executed");

const Search = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    swiperPreferences: [],
    tripType: '',
    dates: [],
    budget: '',
    activities: [],
    personalization: {},
    restaurantPreferences: {},
    accommodationPreferences: {},
    activityPreferences: {},
    needsGroupCreation: false,
    groupName: '',
    invitedUsers: [],
    personCount: 1
  });
  const [searchResults, setSearchResults] = useState(null);
  const [groupId, setGroupId] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: '/search' } });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  if (!user) {
    return <div className={styles.error}>Veuillez vous connecter pour accéder à la recherche.</div>;
  }

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const performSearch = () => {
    const results = {
      hotels: bordeauxData.hotels.filter(hotel => 
        hotel.price <= formData.budget &&
        formData.accommodationPreferences.types?.includes(hotel.type)
      ),
      activities: bordeauxData.activities.filter(activity => 
        activity.price <= formData.budget &&
        formData.activityPreferences.types?.some(type => activity.category.includes(type))
      ),
      restaurants: bordeauxData.restaurants.filter(restaurant => 
        restaurant.price <= formData.budget &&
        formData.restaurantPreferences.cuisineTypes?.some(type => restaurant.cuisine.includes(type))
      )
    };
    setSearchResults(results);
    nextStep();
  };

  const handleGroupCreated = async (newGroup) => {
    try {
      const docRef = await addDoc(collection(db, "groups"), {
        name: newGroup.name,
        createdAt: new Date(),
        members: [],
        tripDetails: formData
      });
      setGroupId(docRef.id);
      handleInputChange('groupName', newGroup.name);
      console.log("Group created with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleInviteSent = async ({ email }) => {
    if (!groupId) {
      console.error("No group ID found");
      return;
    }

    try {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        members: [...formData.invitedUsers, email]
      });
      handleInputChange('invitedUsers', [...formData.invitedUsers, email]);

      const functions = getFunctions();
      const sendInvitationEmail = httpsCallable(functions, 'sendInvitationEmail');
      const invitationLink = `https://votreapp.com/join-group/${groupId}`;
      await sendInvitationEmail({ 
        email, 
        groupName: formData.groupName, 
        invitationLink 
      });

      console.log(`Invitation sent to ${email} for group ${formData.groupName}`);
    } catch (e) {
      console.error("Error updating document or sending invitation: ", e);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 0:
        return <Swiper formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} />;
      case 1:
        return <ComposeTripType formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} />;
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
          <ComposeTrip formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />
        );
      case 3:
        return <ComposeTrip formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <PersonalizeAdvanced formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
      case 5:
        return <RestaurantPreferences formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
      case 6:
        return <AccommodationPreferences formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
      case 7:
        return <ActivityPreferences formData={formData} handleInputChange={handleInputChange} nextStep={performSearch} prevStep={prevStep} />;
      case 8:
        return <SearchResults results={searchResults} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.searchPage}>
      <h1 className={styles.pageTitle}>Planifiez votre séjour à Bordeaux</h1>
      <div className={styles.stepIndicator}>
        Étape {step + 1} sur 8
      </div>
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