import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SearchResults from "./SearchResults";
import { fetchSavedSearch, fetchGroupDetails, checkGroupStatus } from "./GroupUtils";
import { auth } from "../firebase";
import styles from "./GroupSearchResultsDetail.module.css";

const GroupSearchResultsDetail = () => {
  const { groupId } = useParams();
  const [savedSearch, setSavedSearch] = useState(null);
  const [memberParticipations, setMemberParticipations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("Utilisateur non authentifié");
          setError("Utilisateur non authentifié");
          return;
        }

        console.log("Fetching data for groupId:", groupId);
        console.log("Current user:", user.email);

        const [groupStatus, searchData, groupDetails] = await Promise.all([
          checkGroupStatus(groupId, user.email),
          fetchSavedSearch(groupId),
          fetchGroupDetails(groupId)
        ]);

        console.log("Fetched group status:", groupStatus);
        console.log("Fetched saved search data:", searchData);
        console.log("Fetched group details:", groupDetails);

        setUserRole(groupStatus.isCreator ? "creator" : "member");
        console.log("User role set to:", groupStatus.isCreator ? "creator" : "member");

        if (searchData || (groupDetails && groupDetails.savedSearch)) {
          setSavedSearch(searchData || groupDetails.savedSearch);
          console.log("Saved search set:", searchData || groupDetails.savedSearch);
        } else {
          console.log("No valid search results found");
          setError("Aucun résultat de recherche trouvé");
        }

        if (groupDetails && groupDetails.memberParticipations) {
          setMemberParticipations(groupDetails.memberParticipations);
          console.log("Member participations set:", groupDetails.memberParticipations);
        } else {
          console.log("No member participations found");
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError(`Erreur lors du chargement des données: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [groupId]);

  const combineResults = (groupResults, memberParticipations) => {
    console.log("Combining results:", { groupResults, memberParticipations });
    const combinedResults = { ...groupResults };

    for (const [, participation] of Object.entries(memberParticipations)) {
      for (const category of ["hotels", "activities", "restaurants"]) {
        if (participation[category]) {
          combinedResults[category] = [
            ...(combinedResults[category] || []),
            ...participation[category]
          ];
        }
      }
    }

    // Dédupliquer et trier les résultats par score
    for (const category of ["hotels", "activities", "restaurants"]) {
      if (combinedResults[category]) {
        combinedResults[category] = Array.from(new Set(combinedResults[category].map(JSON.stringify)))
          .map(JSON.parse)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5); // Garder les 5 meilleurs résultats
      }
    }

    console.log("Combined results:", combinedResults);
    return combinedResults;
  };

  if (isLoading) {
    console.log("Loading...");
    return <div className={styles.loading}>Chargement...</div>;
  }

  if (error) {
    console.log("Error:", error);
    return <div className={styles.error}>{error}</div>;
  }

  if (!savedSearch && !memberParticipations) {
    console.log("No results found");
    return <div className={styles.noResults}>Aucun résultat trouvé</div>;
  }

  const formattedDate =
    savedSearch && savedSearch.date && !isNaN(new Date(savedSearch.date).getTime())
      ? new Date(savedSearch.date).toLocaleDateString()
      : "Date non disponible";

  console.log("Formatted date:", formattedDate);

  const results = savedSearch || {};
  const combinedResults = memberParticipations 
    ? combineResults(results, memberParticipations)
    : results;

  console.log("Final combined results:", combinedResults);

  return (
    <div className={styles.groupSearchResultsDetail}>
      <h1 className={styles.title}>Résultats de recherche de groupe</h1>
      <p className={styles.date}>Date de la recherche : {formattedDate}</p>
      <SearchResults 
        results={combinedResults} 
        isGroupSearch={true} 
        groupId={groupId} 
        userRole={userRole}
      />
    </div>
  );
};

export default GroupSearchResultsDetail;
