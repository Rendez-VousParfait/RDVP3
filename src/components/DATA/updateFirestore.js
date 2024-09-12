const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const activites = require("./activities.json");
const hotels = require("./hotels.json");
const restaurants = require("./restaurants.json");

async function updateCollection(collectionName, data) {
  const collectionRef = db.collection(collectionName);

  // Supprime tous les documents existants dans la collection
  const existingDocs = await collectionRef.get();
  const batch = db.batch();
  existingDocs.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  console.log(`Deleted existing documents in ${collectionName}`);

  // Ajoute les nouveaux documents
  for (const item of data) {
    await collectionRef.add(item);
    console.log(`Added document to ${collectionName}`);
  }
}

async function updateAllData() {
  try {
    await updateCollection("activities", activites);
    await updateCollection("hotels", hotels);
    await updateCollection("restaurants", restaurants);
    console.log("All data updated successfully");
  } catch (error) {
    console.error("Error updating data:", error);
  }
}

updateAllData();
