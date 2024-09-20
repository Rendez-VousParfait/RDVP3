const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Assurez-vous que ces fichiers JSON existent et contiennent les nouvelles données
const ActivityPreferences = require("./ActivityPreferences.json");
const AccomodationPreferences = require("./AccomodationPreferences.json");
const RestaurantPreferences = require("./RestaurantPreferences.json");
const collectionMappings = [
  { name: "ActivityPreferences", data: ActivityPreferences },
  { name: "AccomodationPreferences", data: AccomodationPreferences },
  { name: "RestaurantPreferences", data: RestaurantPreferences },
];

async function updateCollectionData(collectionName, data) {
  const collectionRef = db.collection(collectionName);

  // Supprimer tous les documents existants
  const existingDocs = await collectionRef.get();
  const batch = db.batch();
  existingDocs.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log(`Deleted all documents in ${collectionName}`);

  // Ajouter les nouvelles données
  for (const item of data) {
    await collectionRef.add(item);
  }
  console.log(`Added new data to ${collectionName}`);
}

async function updateAllCollections() {
  try {
    for (const mapping of collectionMappings) {
      await updateCollectionData(mapping.name, mapping.data);
    }
    console.log("All collections updated successfully");
  } catch (error) {
    console.error("Error updating collections:", error);
  }
}

updateAllCollections();