import { https, firestore, config } from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import nodemailer from "nodemailer";

initializeApp();

const db = getFirestore();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config().gmail.email,
    pass: config().gmail.password,
  },
});

// Fonctions utilitaires
const buildHotelsQuery = (preferences) => {
  let query = db.collection('AccomodationPreferences');
  
  if (preferences.accomodation_type && preferences.accomodation_type.length > 0) {
    query = query.where('accomodation_type', 'array-contains-any', preferences.accomodation_type);
  }
  
  if (preferences.price) {
    query = query.where('price', '<=', preferences.price * 1.5);
  }
  
  return query;
};

const buildActivitiesQuery = (preferences) => {
  let query = db.collection('ActivityPreferences');
  
  if (preferences.activity_type && preferences.activity_type.length > 0) {
    query = query.where('activity_type', 'array-contains-any', preferences.activity_type);
  }
  
  if (preferences.budget) {
    query = query.where('price', '<=', preferences.budget * 1.2);
  }
  
  if (preferences.cadre && preferences.cadre.length > 0) {
    query = query.where('cadre', 'array-contains-any', preferences.cadre);
  }
  
  if (preferences.environment && preferences.environment.length > 0) {
    query = query.where('environment', 'array-contains-any', preferences.environment);
  }
  
  if (preferences.ambiance && preferences.ambiance.length > 0) {
    query = query.where('ambiance', 'array-contains-any', preferences.ambiance);
  }
  
  if (preferences.duration) {
    query = query.where('duration', '<=', preferences.duration);
  }
  
  if (preferences.accessibility) {
    query = query.where('accessibility', '==', true);
  }
  
  // Tri par prix croissant
  query = query.orderBy('price', 'asc');
  
  // Limite le nombre de résultats (pour la pagination)
  query = query.limit(20);
  
  console.log("Query built for activities:", query);
  
  return query;
};

const buildRestaurantsQuery = (preferences) => {
  let query = db.collection('RestaurantPreferences');
  
  if (preferences.cuisinetype && preferences.cuisinetype.length > 0) {
    query = query.where('cuisinetype', 'array-contains-any', preferences.cuisinetype);
  }
  
  if (preferences.budget) {
    query = query.where('price', '<=', preferences.budget * 1.2);
  }
  
  if (preferences.environment && preferences.environment.length > 0) {
    query = query.where('environment', 'array-contains-any', preferences.environment);
  }
  
  if (preferences.ambiances && preferences.ambiances.length > 0) {
    query = query.where('ambiance', 'array-contains-any', preferences.ambiances);
  }
  
  if (preferences.services && preferences.services.length > 0) {
    query = query.where('services', 'array-contains-any', preferences.services);
  }
  
  if (preferences.accessibility) {
    query = query.where('accessibility', '==', true);
  }
  
  // Tri par prix croissant
  query = query.orderBy('price', 'asc');
  
  // Limite le nombre de résultats (pour la pagination)
  query = query.limit(20);
  
  console.log("Query built for restaurants:", query);
  
  return query;
};

const broadenHotelsQuery = (preferences) => {
  let query = db.collection('AccomodationPreferences');
  if (preferences.price) {
    query = query.where('price', '<=', preferences.price * 1.5);
  }
  return query;
};

const broadenActivitiesQuery = (preferences) => {
  let query = db.collection('ActivityPreferences');
  if (preferences.budget) {
    query = query.where('budget', '<=', preferences.budget * 1.5);
  }
  return query;
};

const broadenRestaurantsQuery = (preferences) => {
  let query = db.collection('RestaurantPreferences');
  if (preferences.budget) {
    query = query.where('budget', '<=', preferences.budget * 1.5);
  }
  return query;
};

const executeQueries = async (hotelsQuery, activitiesQuery, restaurantsQuery) => {
  const [hotelsSnapshot, activitiesSnapshot, restaurantsSnapshot] = await Promise.all([
    hotelsQuery.get(),
    activitiesQuery.get(),
    restaurantsQuery.get(),
  ]);

  return {
    hotels: hotelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    activities: activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    restaurants: restaurantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
  };
};

// Cloud Functions
export const helloWorld = https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

export const createUser = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  const { name, email } = data;

  if (!name || !email) {
    throw new https.HttpsError("invalid-argument", "Name and email are required.");
  }

  try {
    await db.collection("users").add({
      name,
      email,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    console.log(`User created successfully: ${email}`);
    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new https.HttpsError("internal", error.message);
  }
});

export const sendInvitationEmail = https.onCall(async (data, context) => {
  console.log("Début de sendInvitationEmail avec données:", data);

  if (!context.auth) {
    console.log("Erreur: Utilisateur non authentifié");
    throw new https.HttpsError(
      "unauthenticated",
      "User must be authenticated to send invitations.",
    );
  }

  const { email, groupName, groupId } = data;

  if (!email || !groupName || !groupId) {
    console.log("Erreur: Données manquantes", { email, groupName, groupId });
    throw new https.HttpsError(
      "invalid-argument",
      "Email, group name, and group ID are required.",
    );
  }

  const joinGroupLink = `https://d8032fc8-12d3-47bd-8c4f-3fe962190169-00-qj1zh7zpatza.spock.replit.dev/join-group/${encodeURIComponent(groupId)}`;

  const mailOptions = {
    from: "Rendez-Vous Parfait <noreply@rendez-vous-parfait.com>",
    to: email,
    subject: `Invitation à rejoindre le groupe "${groupName}"`,
    html: `
      <h1>Vous avez été invité à rejoindre un groupe de voyage !</h1>
      <p>Vous avez été invité à rejoindre le groupe "${groupName}" sur Rendez-Vous Parfait, notre application de planification de voyage.</p>
      <p>Pour accepter l'invitation et rejoindre le groupe, cliquez sur le lien suivant :</p>
      <a href="${joinGroupLink}">Rejoindre le groupe</a>
    `,
  };

  try {
    console.log("Configuration de l'email:", mailOptions);
    console.log("Tentative d'envoi d'e-mail à:", email);
    await transporter.sendMail(mailOptions);
    console.log("E-mail envoyé avec succès à:", email);
    return { success: true, message: "Invitation email sent successfully" };
  } catch (error) {
    console.error("Erreur détaillée lors de l'envoi de l'e-mail:", error);
    console.error("Stack trace:", error.stack);
    throw new https.HttpsError(
      "internal",
      `Impossible d'envoyer l'e-mail d'invitation: ${error.message}`,
    );
  }
});

export const notifyGroupMembers = firestore
  .document("groups/{groupId}")
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();
    const groupId = context.params.groupId;

    if (newValue.members.length > previousValue.members.length) {
      const newMembers = newValue.members.filter(
        (m) => !previousValue.members.includes(m),
      );

      for (const memberEmail of newMembers) {
        const mailOptions = {
          from: "Rendez-Vous Parfait <noreply@rendez-vous-parfait.com>",
          to: memberEmail,
          subject: `Remplissez vos préférences pour le groupe "${newValue.name}"`,
          html: `
            <h1>Vous avez rejoint un nouveau groupe de voyage !</h1>
            <p>Vous avez été ajouté au groupe "${newValue.name}" sur Rendez-Vous Parfait.</p>
            <p>Veuillez remplir vos préférences pour le voyage en vous connectant à l'application.</p>
            <a href="https://d8032fc8-12d3-47bd-8c4f-3fe962190169-00-qj1zh7zpatza.spock.replit.dev/search?groupId=${groupId}">Remplir mes préférences</a>
          `,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`E-mail de notification envoyé à ${memberEmail}`);
        } catch (error) {
          console.error(
            `Erreur lors de l'envoi de l'e-mail à ${memberEmail}:`,
            error,
          );
        }
      }
    }

    const memberPreferences = newValue.memberPreferences || {};
    if (Object.keys(memberPreferences).length === newValue.members.length) {
      const creatorEmail = newValue.members[0];
      const mailOptions = {
        from: "Rendez-Vous Parfait <noreply@rendez-vous-parfait.com>",
        to: creatorEmail,
        subject: `Toutes les préférences sont remplies pour le groupe "${newValue.name}"`,
        html: `
          <h1>Toutes les préférences ont été remplies !</h1>
          <p>Tous les membres du groupe "${newValue.name}" ont rempli leurs préférences.</p>
          <p>Vous pouvez maintenant lancer la recherche pour le groupe.</p>
          <a href="https://d8032fc8-12d3-47bd-8c4f-3fe962190169-00-qj1zh7zpatza.spock.replit.dev/search?groupId=${groupId}">Lancer la recherche</a>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(
          `E-mail de notification envoyé au créateur ${creatorEmail}`,
        );
      } catch (error) {
        console.error(
          `Erreur lors de l'envoi de l'e-mail au créateur ${creatorEmail}:`,
          error,
        );
      }
    }
  });

export const performSearch = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError("unauthenticated", "L'utilisateur doit être authentifié pour effectuer une recherche.");
  }

  const { formData, broaden } = data;
  console.log("Données reçues dans performSearch:", { formData, broaden });

  try {
    let hotelsQuery = db.collection('AccomodationPreferences');
    let activitiesQuery = db.collection('ActivityPreferences');
    let restaurantsQuery = db.collection('RestaurantPreferences');

    // Appliquer les filtres pour les hôtels
    if (formData.AccommodationPreferences) {
      if (formData.AccommodationPreferences.accomodation_type && formData.AccommodationPreferences.accomodation_type.length > 0) {
        hotelsQuery = hotelsQuery.where('accomodation_type', '==', formData.AccommodationPreferences.accomodation_type[0]);
      }
      if (formData.AccommodationPreferences.price) {
        hotelsQuery = hotelsQuery.where('price', '<=', formData.AccommodationPreferences.price * (broaden ? 1.5 : 1));
      }
    }

    // Appliquer les filtres pour les activités
    if (formData.ActivityPreferences) {
      if (formData.ActivityPreferences.activity_type && formData.ActivityPreferences.activity_type.length > 0) {
        activitiesQuery = activitiesQuery.where('activity_type', '==', formData.ActivityPreferences.activity_type[0]);
      }
      if (formData.ActivityPreferences.budget) {
        activitiesQuery = activitiesQuery.where('budget', '<=', formData.ActivityPreferences.budget * (broaden ? 1.5 : 1));
      }
    }

    // Appliquer les filtres pour les restaurants
    if (formData.RestaurantPreferences) {
      if (formData.RestaurantPreferences.cuisinetype && formData.RestaurantPreferences.cuisinetype.length > 0) {
        restaurantsQuery = restaurantsQuery.where('cuisinetype', '==', formData.RestaurantPreferences.cuisinetype[0]);
      }
      if (formData.RestaurantPreferences.budget) {
        restaurantsQuery = restaurantsQuery.where('budget', '<=', formData.RestaurantPreferences.budget * (broaden ? 1.5 : 1));
      }
    }

    console.log("Requêtes construites:", { hotelsQuery, activitiesQuery, restaurantsQuery });

    // Exécuter les requêtes
    const [hotelsSnapshot, activitiesSnapshot, restaurantsSnapshot] = await Promise.all([
      hotelsQuery.get(),
      activitiesQuery.get(),
      restaurantsQuery.get()
    ]);

    const results = {
      hotels: hotelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      activities: activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      restaurants: restaurantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    };

    console.log("Résultats de la recherche:", results);

    if (Object.values(results).every(arr => arr.length === 0) && !broaden) {
      console.log("Aucun résultat trouvé, élargissement de la recherche");
      return performSearch({ formData, broaden: true });
    }

    return results;
  } catch (error) {
    console.error("Erreur lors de la recherche individuelle:", error);
    throw new https.HttpsError("internal", `Une erreur est survenue lors de la recherche: ${error.message}`);
  }
});

// Fonction pour élargir la recherche
const broadenSearch = async (formData) => {
  try {
    let hotelsQuery = db.collection('AccomodationPreferences');
    let activitiesQuery = db.collection('ActivityPreferences');
    let restaurantsQuery = db.collection('RestaurantPreferences');

    // Appliquer des filtres moins stricts
    if (formData.AccommodationPreferences && formData.AccommodationPreferences.price) {
      hotelsQuery = hotelsQuery.where('price', '<=', formData.AccommodationPreferences.price * 1.5);
    }
    if (formData.ActivityPreferences && formData.ActivityPreferences.budget) {
      activitiesQuery = activitiesQuery.where('budget', '<=', formData.ActivityPreferences.budget * 1.5);
    }
    if (formData.RestaurantPreferences && formData.RestaurantPreferences.budget) {
      restaurantsQuery = restaurantsQuery.where('budget', '<=', formData.RestaurantPreferences.budget * 1.5);
    }

    const [hotelsSnapshot, activitiesSnapshot, restaurantsSnapshot] = await Promise.all([
      hotelsQuery.get(),
      activitiesQuery.get(),
      restaurantsQuery.get()
    ]);

    return {
      hotels: hotelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      activities: activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      restaurants: restaurantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    };
  } catch (error) {
    console.error("Erreur lors de l'élargissement de la recherche:", error);
    throw new https.HttpsError("internal", `Une erreur est survenue lors de l'élargissement de la recherche: ${error.message}`);
  }
};

export const performGroupSearch = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError("unauthenticated", "L'utilisateur doit être authentifié pour effectuer une recherche de groupe.");
  }

  const { groupId } = data;

  try {
    console.log("Début de la recherche de groupe pour:", groupId);
    const groupDoc = await db.collection("groups").doc(groupId).get();
    if (!groupDoc.exists) {
      throw new https.HttpsError("not-found", "Le groupe spécifié n'existe pas.");
    }

    const groupData = groupDoc.data();
    const memberIds = groupData.members;

    const memberPreferences = await Promise.all(memberIds.map(async (memberId) => {
      const userDoc = await db.collection("users").doc(memberId).get();
      const userData = userDoc.data();
      console.log(`Préférences récupérées pour l'utilisateur ${memberId}:`, userData?.preferences);
      return userData?.preferences || {};
    }));

    console.log("Préférences des membres récupérées:", memberPreferences);

    const combinedPreferences = combineGroupPreferences(memberPreferences);
    console.log("Préférences combinées:", combinedPreferences);

    const hotelsQuery = buildHotelsQuery(combinedPreferences.AccommodationPreferences || {});
    const activitiesQuery = buildActivitiesQuery(combinedPreferences.ActivityPreferences || {});
    const restaurantsQuery = buildRestaurantsQuery(combinedPreferences.RestaurantPreferences || {});

    const results = await executeQueries(hotelsQuery, activitiesQuery, restaurantsQuery);
    
    // Ajoutez cette fonction pour récupérer les URL des images
    const addImageUrls = async (items, collectionName) => {
      const snapshot = await db.collection(collectionName).get();
      const imageMap = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        imageMap[data.id] = data.image1 || "/placeholder.jpg";
      });
      return items.map(item => ({
        ...item,
        imageUrl: imageMap[item.id] || "/placeholder.jpg"
      }));
    };

    results.hotels = await addImageUrls(results.hotels, 'AccomodationPreferences');
    results.activities = await addImageUrls(results.activities, 'ActivityPreferences');
    results.restaurants = await addImageUrls(results.restaurants, 'RestaurantPreferences');

    console.log("Résultats de la recherche de groupe avec images:", results);
    return results;
  } catch (error) {
    console.error("Erreur lors de la recherche de groupe:", error);
    throw new https.HttpsError("internal", `Une erreur est survenue lors de la recherche de groupe: ${error.message}`);
  }
});

// Fonction pour combiner les préférences du groupe
const combineGroupPreferences = (memberPreferences) => {
  const combinedPreferences = {
    AccommodationPreferences: {},
    ActivityPreferences: {},
    RestaurantPreferences: {},
    budget: 0,
    travelType: "",
    groupPreference: "",
  };

  memberPreferences.forEach(pref => {
    // Combinez les préférences ici
    // Par exemple :
    combinedPreferences.budget += pref.budget || 0;
    // ... combinez d'autres préférences ...
  });

  // Calculez la moyenne du budget
  combinedPreferences.budget /= memberPreferences.length;

  return combinedPreferences;
};

export const initiateGroupSearch = https.onCall(async (data, context) => {
  const { groupId } = data;
  console.log("Initiating group search:", groupId);

  if (!context.auth) {
    throw new https.HttpsError("unauthenticated", "L'utilisateur doit être authentifié.");
  }

  try {
    const groupRef = db.collection('groups').doc(groupId);
    const groupDoc = await groupRef.get();
    
    if (!groupDoc.exists) {
      throw new https.HttpsError("not-found", "Le groupe spécifié n'existe pas.");
    }
    
    const groupData = groupDoc.data();
    
    if (groupData.members.length < 2) {
      throw new https.HttpsError("failed-precondition", "Il faut au moins deux membres dans le groupe pour lancer la recherche.");
    }
    
    const allMembersJoined = groupData.members.every(member => groupData.memberPreferences && groupData.memberPreferences[member]);
    
    if (!allMembersJoined) {
      throw new https.HttpsError("failed-precondition", "Tous les membres du groupe n'ont pas encore rempli leurs préférences.");
    }
    
    await groupRef.update({
      searchInitiated: true,
      lastUpdated: firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'initiation de la recherche de groupe:", error);
    throw new https.HttpsError('internal', error.message);
  }
});

export const checkGroupStatus = https.onCall(async (data, context) => {
  const { groupId } = data;
  console.log("Checking group status for groupId:", groupId);

  if (!context.auth) {
    throw new https.HttpsError("unauthenticated", "L'utilisateur doit être authentifié.");
  }

  try {
    const groupDoc = await db.collection('groups').doc(groupId).get();
    if (!groupDoc.exists) {
      throw new https.HttpsError("not-found", "Le groupe spécifié n'existe pas.");
    }
    
    const groupData = groupDoc.data();
    const userEmail = context.auth.token.email;
    
    const canInitiateSearch = groupData.members.length >= 2;
    const userRole = groupData.creator === userEmail ? "creator" : "member";
    
    const allMembersJoined = groupData.members.every(member => groupData.memberPreferences && groupData.memberPreferences[member]);
    
    return {
      userRole,
      isCreator: groupData.creator === userEmail,
      allMembersJoined,
      savedSearch: groupData.savedSearch || null
    };
  } catch (error) {
    console.error("Erreur lors de la vérification du statut du groupe:", error);
    throw new https.HttpsError('internal', error.message);
  }
});

export const saveGroupSearch = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError(
      "unauthenticated",
      "L'utilisateur doit être authentifié pour sauvegarder une recherche de groupe.",
    );
  }

  const { groupId, searchResults } = data;

  if (!groupId || !searchResults) {
    throw new https.HttpsError(
      "invalid-argument",
      "GroupId et searchResults sont requis.",
    );
  }

  try {
    await db.collection("groups").doc(groupId).update({
      savedSearch: searchResults,
      lastUpdated: firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Recherche sauvegardée avec succès pour le groupe ${groupId}`);
    return { success: true, message: "Recherche sauvegardée avec succès" };
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la recherche:", error);
    throw new https.HttpsError(
      "internal",
      `Une erreur est survenue lors de la sauvegarde de la recherche: ${error.message}`,
    );
  }
});

export const fetchSavedGroupSearch = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError(
      "unauthenticated",
      "L'utilisateur doit être authentifié pour récupérer une recherche de groupe sauvegardée.",
    );
  }

  const { groupId } = data;

  if (!groupId) {
    throw new https.HttpsError(
      "invalid-argument",
      "GroupId est requis.",
    );
  }

  try {
    const groupDoc = await db
      .collection("groups")
      .doc(groupId)
      .get();

    if (!groupDoc.exists) {
      throw new https.HttpsError("not-found", "Groupe non trouvé");
    }

    const groupData = groupDoc.data();

    if (!groupData.savedSearch) {
      return {
        exists: false,
        message: "Aucune recherche sauvegardée pour ce groupe",
      };
    }

    return {
      exists: true,
      savedSearch: groupData.savedSearch,
      lastUpdated: groupData.lastUpdated,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la recherche sauvegardée:",
      error,
    );
    throw new https.HttpsError(
      "internal",
      `Une erreur est survenue lors de la récupération de la recherche sauvegardée: ${error.message}`,
    );
  }
});

export const submitMemberPreferences = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError(
      "unauthenticated",
      "L'utilisateur doit être authentifié pour soumettre ses préférences."
    );
  }

  const { groupId, preferences } = data;
  const userEmail = context.auth.token.email;

  if (!groupId || !preferences) {
    throw new https.HttpsError(
      "invalid-argument",
      "GroupId et preferences sont requis."
    );
  }

  try {
    const groupRef = db.collection("groups").doc(groupId);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists) {
      throw new https.HttpsError("not-found", "Groupe non trouvé");
    }

    const groupData = groupDoc.data();

    if (!groupData.members.includes(userEmail)) {
      throw new https.HttpsError(
        "permission-denied",
        "L'utilisateur n'est pas membre de ce groupe."
      );
    }

    if (!groupData.searchInitiated) {
      throw new https.HttpsError(
        "failed-precondition",
        "La recherche de groupe n'a pas encore été initiée par le créateur."
      );
    }

    if (groupData.memberPreferences && groupData.memberPreferences[userEmail]) {
      throw new https.HttpsError(
        "already-exists",
        "L'utilisateur a déjà soumis ses préférences pour ce groupe."
      );
    }

    await groupRef.update({
      [`memberPreferences.${userEmail}`]: preferences,
    });

    const searchResults = await performSearch({ groupId, formData: preferences });

    await groupRef.update({
      savedSearch: searchResults,
      lastUpdated: firestore.FieldValue.serverTimestamp(),
    });

    console.log("Préférences soumises et nouvelle recherche effectuée pour l'utilisateur:", userEmail);
    return { success: true, message: "Préférences soumises et recherche mise à jour avec succès", results: searchResults };
  } catch (error) {
    console.error("Erreur lors de la soumission des préférences:", error);
    throw new https.HttpsError(
      "internal",
      `Une erreur est survenue lors de la soumission des préférences: ${error.message}`
    );
  }
});

export const saveGroupParticipation = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError(
      "unauthenticated",
      "L'utilisateur doit être authentifié pour sauvegarder sa participation."
    );
  }

  const { groupId, searchResults } = data;
  const userEmail = context.auth.token.email;

  if (!groupId || !searchResults) {
    throw new https.HttpsError(
      "invalid-argument",
      "GroupId et searchResults sont requis."
    );
  }

  try {
    const groupRef = db.collection("groups").doc(groupId);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists) {
      throw new https.HttpsError("not-found", "Groupe non trouvé");
    }

    const groupData = groupDoc.data();

    if (!groupData.members.includes(userEmail)) {
      throw new https.HttpsError(
        "permission-denied",
        "L'utilisateur n'est pas membre de ce groupe."
      );
    }

    await groupRef.update({
      [`memberParticipations.${userEmail}`]: searchResults,
      lastUpdated: firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Participation sauvegardée avec succès pour l'utilisateur ${userEmail} dans le groupe ${groupId}`);
    return { success: true, message: "Participation sauvegardée avec succès" };
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la participation:", error);
    throw new https.HttpsError(
      "internal",
      `Une erreur est survenue lors de la sauvegarde de la participation: ${error.message}`
    );
  }
});

export const getGroupPreferences = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError("unauthenticated", "L'utilisateur doit être authentifié.");
  }

  const { groupId } = data;

  try {
    const groupDoc = await db.collection("groups").doc(groupId).get();
    if (!groupDoc.exists) {
      throw new https.HttpsError("not-found", "Le groupe spécifié n'existe pas.");
    }

    const groupData = groupDoc.data();
    return groupData.memberPreferences || {};
  } catch (error) {
    console.error("Erreur lors de la récupération des préférences du groupe:", error);
    throw new https.HttpsError("internal", "Une erreur est survenue lors de la récupération des préférences du groupe.");
  }
});

export const getGroupResults = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError("unauthenticated", "L'utilisateur doit être authentifié.");
  }

  const { groupId } = data;

  try {
    const groupDoc = await db.collection("groups").doc(groupId).get();
    if (!groupDoc.exists) {
      throw new https.HttpsError("not-found", "Le groupe spécifié n'existe pas.");
    }

    const groupData = groupDoc.data();
    return groupData.savedSearch || null;
  } catch (error) {
    console.error("Erreur lors de la récupération des résultats du groupe:", error);
    throw new https.HttpsError("internal", "Une erreur est survenue lors de la récupération des résultats du groupe.");
  }
});

export const createGroup = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError("unauthenticated", "L'utilisateur doit être authentifié pour créer un groupe.");
  }

  const { groupName } = data;
  const creatorEmail = context.auth.token.email;

  if (!groupName) {
    throw new https.HttpsError("invalid-argument", "Le nom du groupe est requis.");
  }

  try {
    const groupRef = await db.collection("groups").add({
      name: groupName,
      creator: creatorEmail,
      members: [creatorEmail],
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Groupe créé avec succès: ${groupRef.id}`);
    return { success: true, groupId: groupRef.id };
  } catch (error) {
    console.error("Erreur lors de la création du groupe:", error);
    throw new https.HttpsError("internal", `Une erreur est survenue lors de la création du groupe: ${error.message}`);
  }
});

export const joinGroup = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError("unauthenticated", "L'utilisateur doit être authentifié pour rejoindre un groupe.");
  }

  const { groupId } = data;
  const userEmail = context.auth.token.email;

  if (!groupId) {
    throw new https.HttpsError("invalid-argument", "L'ID du groupe est requis.");
  }

  try {
    const groupRef = db.collection("groups").doc(groupId);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists) {
      throw new https.HttpsError("not-found", "Le groupe spécifié n'existe pas.");
    }

    const groupData = groupDoc.data();

    if (groupData.members.includes(userEmail)) {
      throw new https.HttpsError("already-exists", "L'utilisateur est déjà membre de ce groupe.");
    }

    await groupRef.update({
      members: firestore.FieldValue.arrayUnion(userEmail),
    });

    console.log(`Utilisateur ${userEmail} a rejoint le groupe ${groupId}`);
    return { success: true, message: "Vous avez rejoint le groupe avec succès." };
  } catch (error) {
    console.error("Erreur lors de la tentative de rejoindre le groupe:", error);
    throw new https.HttpsError("internal", `Une erreur est survenue lors de la tentative de rejoindre le groupe: ${error.message}`);
  }
});

export const fetchGroupMembersPreferences = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError("unauthenticated", "L'utilisateur doit être authentifié.");
  }

  const { groupId } = data;

  try {
    const groupDoc = await db.collection("groups").doc(groupId).get();
    if (!groupDoc.exists) {
      throw new https.HttpsError("not-found", "Le groupe spécifié n'existe pas.");
    }

    const groupData = groupDoc.data();
    const memberIds = groupData.members;

    const memberPreferences = await Promise.all(memberIds.map(async (memberId) => {
      const userDoc = await db.collection("users").doc(memberId).get();
      return {
        userId: memberId,
        preferences: userDoc.data().preferences || {}
      };
    }));

    console.log("Préférences des membres récupérées:", memberPreferences);
    return memberPreferences;
  } catch (error) {
    console.error("Erreur lors de la récupération des préférences des membres du groupe:", error);
    throw new https.HttpsError("internal", "Une erreur est survenue lors de la récupération des préférences des membres du groupe.");
  }
});

export const sendMoodFormEmail = firestore
  .document('moodforms/{docId}')
  .onCreate(async (snap, context) => {
    const formData = snap.data();
    
    const mailOptions = {
      from: "Rendez-Vous Parfait <noreply@rendez-vous-parfait.com>",
      to: "contact@veever.fr",
      subject: "Nouvelle soumission de formulaire Mood",
      html: `
        <h1>Nouvelle soumission de formulaire Mood</h1>
        
        <h2>Informations générales</h2>
        <ul>
          <li>Date: ${formData.formData.date ? new Date(formData.formData.date).toLocaleDateString('fr-FR') : 'Non spécifiée'}</li>
          <li>Nombre de personnes: ${formData.formData.groupSize}</li>
          <li>Type de groupe: ${
            formData.formData.clientType === 'family' ? 'Famille' : 
            formData.formData.clientType === 'couple' ? 'Couple' :
            formData.formData.clientType === 'friends' ? 'Amis' :
            formData.formData.clientType === 'solo' ? 'Solo' : 'Non spécifié'
          }</li>
          <li>Budget par personne: ${formData.formData.budget}€</li>
        </ul>

        ${formData.formData.services.includes('restaurants') ? `
          <h2>Préférences Restaurant</h2>
          <ul>
            <li>Types de cuisine: ${formData.formData.cuisineTypes.join(', ') || 'Non spécifié'}</li>
            <li>Moment du repas: ${formData.formData.restaurantTime === 'lunch' ? 'Déjeuner' : 'Dîner'}</li>
            <li>Ambiance: ${formData.formData.restaurantVersus.ambiance || 'Non spécifié'}</li>
            <li>Expérience: ${formData.formData.restaurantVersus.experience || 'Non spécifié'}</li>
            <li>Décoration: ${formData.formData.restaurantVersus.decoration || 'Non spécifié'}</li>
          </ul>
        ` : ''}

        ${formData.formData.services.includes('activities') ? `
          <h2>Préférences Activité</h2>
          <ul>
            <li>Moment de la journée: ${
              formData.formData.activityTime === 'morning' ? 'Matinée' :
              formData.formData.activityTime === 'afternoon' ? 'Après-midi' :
              formData.formData.activityTime === 'evening' ? 'Soirée' :
              formData.formData.activityTime === 'night' ? 'Nuit' : 'Non spécifié'
            }</li>
            <li>Type d'activité: ${formData.formData.activityVersus.mood || 'Non spécifié'}</li>
            <li>Localisation: ${formData.formData.activityVersus.location || 'Non spécifié'}</li>
            <li>Intensité: ${formData.formData.activityVersus.intensity || 'Non spécifié'}</li>
          </ul>
        ` : ''}

        ${formData.formData.services.includes('hotels') ? `
          <h2>Préférences Hébergement</h2>
          <ul>
            <li>Cadre: ${formData.formData.accommodationVersus.setting || 'Non spécifié'}</li>
            <li>Ambiance: ${formData.formData.accommodationVersus.ambiance || 'Non spécifié'}</li>
            <li>Services: ${formData.formData.accommodationVersus.services || 'Non spécifié'}</li>
          </ul>
        ` : ''}

        <h2>Informations utilisateur</h2>
        <ul>
          <li>Email: ${formData.userEmail}</li>
          <li>ID: ${formData.userId}</li>
          <li>Date de soumission: ${new Date(formData.createdAt.toDate()).toLocaleString('fr-FR')}</li>
        </ul>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email de formulaire Mood envoyé avec succès');
      return null;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email du formulaire Mood:', error);
      throw new Error(error.message);
    }
  });

