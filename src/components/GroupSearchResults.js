import React from "react";
import SearchResults from "./SearchResults";
import "./GroupSearchResults.css";

const GroupSearchResults = ({ results, groupId, onSaveSearch }) => {
  const handleSaveSearch = async (updatedResults) => {
    if (results && groupId) {
      try {
        console.log(
          "Tentative d'enregistrement de la recherche pour le groupe:",
          groupId,
        );
        console.log("Données à enregistrer:", updatedResults);
        await onSaveSearch(updatedResults);
        console.log("Recherche enregistrée avec succès");
        // L'alerte est maintenant gérée dans le composant parent (GroupDetails)
      } catch (error) {
        console.error(
          "Erreur détaillée lors de l'enregistrement de la recherche:",
          error,
        );
        // L'alerte d'erreur est maintenant gérée dans le composant parent (GroupDetails)
      }
    } else {
      console.log("Impossible d'enregistrer la recherche:", {
        results,
        groupId,
      });
    }
  };

  return (
    <div className="groupSearchResults">
      <SearchResults
        results={results}
        isGroupSearch={true}
        groupId={groupId}
        onSaveSearch={handleSaveSearch}
      />
    </div>
  );
};

export default GroupSearchResults;
