const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const hotels = require('./hotels.json');
const restaurants = require('./restaurants.json');
const activities = require('./activites.json');

async function uploadCollection(collectionName, data) {
  const collectionRef = db.collection(collectionName);

  for (const item of data) {
    await collectionRef.add(item);
    console.log(`Added document to ${collectionName}`);
  }
}

async function uploadAllData() {
  try {
    await uploadCollection('hotels', hotels);
    await uploadCollection('restaurants', restaurants);
    await uploadCollection('activities', activities);
    console.log('All data uploaded successfully');
  } catch (error) {
    console.error('Error uploading data:', error);
  }
}

uploadAllData();