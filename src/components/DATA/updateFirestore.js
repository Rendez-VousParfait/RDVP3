const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const activites = require("./activities.json");
const hotels = require("./hotels.json");
const restaurants = require("./restaurants.json");

const restaurantMetadata = {
  accessibilite: [
    { id: "pmr", icon: "faWheelchair", label: "Accessible PMR" },
    { id: "malentendants", icon: "faEar", label: "Adapté aux malentendants" },
  ],
  cadre: [
    { id: "romantique", icon: "faHeart", label: "Romantique" },
    { id: "familial", icon: "faUsers", label: "Familial" },
    { id: "business", icon: "faBriefcase", label: "Business" },
  ],
  prix: [
    { id: "economique", icon: "faDollarSign", label: "Économique" },
    { id: "moyen", icon: "faDollarSign", label: "Moyen" },
    { id: "gastronomique", icon: "faDollarSign", label: "Gastronomique" },
  ],
  typesDeCuisine: [
    { id: "francaise", icon: "faFlag", label: "Française" },
    { id: "italienne", icon: "faPizzaSlice", label: "Italienne" },
    { id: "japonaise", icon: "faUtensils", label: "Japonaise" },
  ],
  services: [
    { id: "reservation", icon: "faCalendar", label: "Réservation" },
    { id: "livraison", icon: "faTruck", label: "Livraison" },
    { id: "emporter", icon: "faShoppingBag", label: "À emporter" },
  ],
  equipements: [
    { id: "wifi", icon: "faWifi", label: "Wi-Fi" },
    { id: "terrasse", icon: "faUmbrellaBeach", label: "Terrasse" },
    { id: "parking", icon: "faCar", label: "Parking" },
  ],
  typeDePublic: [
    { id: "famille", icon: "faChild", label: "Famille" },
    { id: "groupe", icon: "faUsers", label: "Groupe" },
    { id: "couple", icon: "faHeart", label: "Couple" },
  ],
};

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

async function updateRestaurantMetadata() {
  const metadataRef = db.collection("metadata").doc("restaurants");
  await metadataRef.set(restaurantMetadata);
  console.log("Restaurant metadata updated successfully");
}

async function updateAllData() {
  try {
    await updateCollection("activities", activites);
    await updateCollection("hotels", hotels);
    await updateCollection("restaurants", restaurants);
    await updateRestaurantMetadata();
    console.log("All data updated successfully");
  } catch (error) {
    console.error("Error updating data:", error);
  }
}

updateAllData();
