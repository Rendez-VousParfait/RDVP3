import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SearchResults from "./SearchResults";
import { fetchSavedSearch } from "./GroupUtils";
import styles from "./GroupSearchResultsDetail.module.css";

const GroupSearchResultsDetail = () => {
  const { groupId } = useParams();
  const [savedSearch, setSavedSearch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSavedSearch = async () => {
      try {
        console.log("Fetching saved search for groupId:", groupId);
        const data = await fetchSavedSearch(groupId);
        console.log("Fetched saved search data:", data);
        if (data && (data.results || data.accommodations)) {
          setSavedSearch(data);
        } else {
          console.log("No valid search results found");
          setError("Aucun résultat de recherche trouvé");
        }
      } catch (err) {
        console.error("Error loading search results:", err);
        setError("Erreur lors du chargement des résultats");
      } finally {
        setIsLoading(false);
      }
    };
    loadSavedSearch();
  }, [groupId]);

  if (isLoading) return <div className={styles.loading}>Chargement...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!savedSearch || (!savedSearch.results && !savedSearch.accommodations))
    return <div className={styles.noResults}>Aucun résultat trouvé</div>;

  const formattedDate =
    savedSearch.date && !isNaN(new Date(savedSearch.date).getTime())
      ? new Date(savedSearch.date).toLocaleDateString()
      : "Date non disponible";

  const results = savedSearch.results || savedSearch;

  return (
    <div className={styles.groupSearchResultsDetail}>
      <h1 className={styles.title}>Résultats de recherche de groupe</h1>
      <p className={styles.date}>Date de la recherche : {formattedDate}</p>
      <SearchResults results={results} isGroupSearch={true} groupId={groupId} />
    </div>
  );
};

export default GroupSearchResultsDetail;
