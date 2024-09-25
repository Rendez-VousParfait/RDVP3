const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.createUser = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated.",
    );
  }

  const { name, email } = data;

  if (!name || !email) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Name and email are required.",
    );
  }

  return admin
    .firestore()
    .collection("users")
    .add({
      name: name,
      email: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log(`User created successfully: ${email}`);
      return { success: true, message: "User created successfully" };
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      throw new functions.https.HttpsError("internal", error.message);
    });
});

exports.sendInvitationEmail = functions.https.onCall(async (data, context) => {
  console.log("Début de sendInvitationEmail avec données:", data);

  if (!context.auth) {
    console.log("Erreur: Utilisateur non authentifié");
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to send invitations.",
    );
  }

  const { email, groupName, groupId } = data;

  if (!email || !groupName || !groupId) {
    console.log("Erreur: Données manquantes", { email, groupName, groupId });
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Email, group name, and group ID are required.",
    );
  }

  const searchLink = `https://03180a26-2db9-48f9-96be-160405a77d05-00-2ilb0tmq75o6f.spock.replit.dev/search?groupId=${encodeURIComponent(groupId)}`;

  const mailOptions = {
    from: "Rendez-Vous Parfait <noreply@rendez-vous-parfait.com>",
    to: email,
    subject: `Invitation à rejoindre le groupe "${groupName}"`,
    html: `
      <h1>Vous avez été invité à rejoindre un groupe de voyage !</h1>
      <p>Vous avez été invité à rejoindre le groupe "${groupName}" sur Rendez-Vous Parfait, notre application de planification de voyage.</p>
      <p>Pour accepter l'invitation et remplir vos préférences, cliquez sur le lien suivant :</p>
      <a href="${searchLink}">Rejoindre le groupe et remplir mes préférences</a>
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
    throw new functions.https.HttpsError(
      "internal",
      `Impossible d'envoyer l'e-mail d'invitation: ${error.message}`,
    );
  }
});

exports.notifyGroupMembers = functions.firestore
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
            <a href="https://03180a26-2db9-48f9-96be-160405a77d05-00-2ilb0tmq75o6f.spock.replit.dev/search?groupId=${groupId}">Remplir mes préférences</a>
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
          <a href="https://03180a26-2db9-48f9-96be-160405a77d05-00-2ilb0tmq75o6f.spock.replit.dev/search?groupId=${groupId}">Lancer la recherche</a>
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

exports.performSearch = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "L'utilisateur doit être authentifié pour effectuer une recherche.",
    );
  }

  const { formData, groupId } = data;
  const userId = context.auth.uid;

  if (!formData) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Les données du formulaire sont requises.",
    );
  }

  try {
    console.log(
      "Début de performSearch avec formData:",
      formData,
      "et groupId:",
      groupId,
    );

    let groupPreferences = [];
    if (groupId) {
      const groupDoc = await admin
        .firestore()
        .collection("groups")
        .doc(groupId)
        .get();
      if (groupDoc.exists) {
        groupPreferences = Object.values(
          groupDoc.data().memberPreferences || {},
        );
      } else {
        console.log(`Groupe avec l'ID ${groupId} non trouvé`);
      }
    }

    const fetchData = async (collectionName) => {
      console.log(`Fetching data from collection: ${collectionName}`);
      const snapshot = await admin.firestore().collection(collectionName).get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };

    let [accommodations, activities, restaurants] = await Promise.all([
      fetchData("AccomodationPreferences"),
      fetchData("ActivityPreferences"),
      fetchData("RestaurantPreferences"),
    ]);

    console.log("Données récupérées:", {
      accommodations,
      activities,
      restaurants,
    });

    const preferencesToUse =
      groupPreferences.length > 0
        ? [...groupPreferences, formData]
        : [formData];

    console.log("Préférences à utiliser:", preferencesToUse);

    const weightResults = (items, preferences, type) => {
      return items.map((item) => {
        let score = 0;
        let maxScore = 100;
        preferences.forEach((pref) => {
          if (type === "accommodations") {
            if (pref.AccommodationPreferences?.price && item.price) {
              if (item.price <= pref.AccommodationPreferences.price)
                score += 20;
              else if (item.price <= pref.AccommodationPreferences.price * 1.2)
                score += 10;
              else if (item.price <= pref.AccommodationPreferences.price * 1.5)
                score += 5;
            }
            if (
              pref.AccommodationPreferences?.accomodation_type &&
              item.accomodation_type
            ) {
              if (
                pref.AccommodationPreferences.accomodation_type.includes(
                  item.accomodation_type,
                )
              )
                score += 20;
            }
            if (pref.AccommodationPreferences?.standing && item.standing) {
              if (
                pref.AccommodationPreferences.standing.includes(item.standing)
              )
                score += 15;
            }
            if (
              pref.AccommodationPreferences?.environment &&
              item.environment
            ) {
              const envMatch = pref.AccommodationPreferences.environment.filter(
                (env) => item.environment.includes(env),
              ).length;
              score += Math.min(15, envMatch * 5);
            }
            if (pref.AccommodationPreferences?.equipments && item.equipments) {
              const eqMatch = pref.AccommodationPreferences.equipments.filter(
                (eq) => item.equipments.includes(eq),
              ).length;
              score += Math.min(15, eqMatch * 3);
            }
            if (pref.AccommodationPreferences?.style && item.style) {
              if (pref.AccommodationPreferences.style.includes(item.style))
                score += 15;
            }
          } else if (type === "activities") {
            if (pref.ActivityPreferences?.budget && item.price) {
              if (item.price <= pref.ActivityPreferences.budget) score += 20;
              else if (item.price <= pref.ActivityPreferences.budget * 1.2)
                score += 10;
              else if (item.price <= pref.ActivityPreferences.budget * 1.5)
                score += 5;
            }
            if (pref.ActivityPreferences?.cadre && item.cadre) {
              if (pref.ActivityPreferences.cadre.includes(item.cadre))
                score += 20;
            }
            if (
              pref.ActivityPreferences?.accessibility !== undefined &&
              item.accessibility !== undefined
            ) {
              if (pref.ActivityPreferences.accessibility === item.accessibility)
                score += 15;
            }
            if (pref.ActivityPreferences?.environment && item.environment) {
              const envMatch = pref.ActivityPreferences.environment.filter(
                (env) => item.environment.includes(env),
              ).length;
              score += Math.min(15, envMatch * 5);
            }
            if (pref.ActivityPreferences?.ambiance && item.ambiance) {
              const ambMatch = pref.ActivityPreferences.ambiance.filter((amb) =>
                item.ambiance.includes(amb),
              ).length;
              score += Math.min(15, ambMatch * 5);
            }
            if (pref.ActivityPreferences?.duration && item.duration) {
              if (pref.ActivityPreferences.duration === item.duration)
                score += 15;
              else if (
                Math.abs(
                  parseInt(pref.ActivityPreferences.duration) -
                    parseInt(item.duration),
                ) <= 1
              )
                score += 10;
            }
          } else if (type === "restaurants") {
            if (pref.RestaurantPreferences?.price && item.price) {
              if (item.price <= pref.RestaurantPreferences.price) score += 20;
              else if (item.price <= pref.RestaurantPreferences.price * 1.2)
                score += 10;
              else if (item.price <= pref.RestaurantPreferences.price * 1.5)
                score += 5;
            }
            if (pref.RestaurantPreferences?.cuisinetype && item.cuisinetype) {
              if (
                pref.RestaurantPreferences.cuisinetype.includes(
                  item.cuisinetype,
                )
              )
                score += 20;
            }
            if (pref.RestaurantPreferences?.environment && item.environment) {
              if (
                pref.RestaurantPreferences.environment.includes(
                  item.environment,
                )
              )
                score += 15;
            }
            if (pref.RestaurantPreferences?.ambiances && item.ambiances) {
              const ambMatch = pref.RestaurantPreferences.ambiances.filter(
                (amb) => item.ambiances.includes(amb),
              ).length;
              score += Math.min(15, ambMatch * 5);
            }
            if (pref.RestaurantPreferences?.services && item.services) {
              const servMatch = pref.RestaurantPreferences.services.filter(
                (serv) => item.services.includes(serv),
              ).length;
              score += Math.min(15, servMatch * 3);
            }
            if (
              pref.RestaurantPreferences?.accessibility !== undefined &&
              item.accessibility !== undefined
            ) {
              if (
                pref.RestaurantPreferences.accessibility === item.accessibility
              )
                score += 15;
            }
          }
        });
        return { ...item, score: (score / maxScore) * 100 };
      });
    };

    accommodations = weightResults(
      accommodations,
      preferencesToUse,
      "accommodations",
    );
    activities = weightResults(activities, preferencesToUse, "activities");
    restaurants = weightResults(restaurants, preferencesToUse, "restaurants");

    console.log("Résultats pondérés:", {
      accommodations,
      activities,
      restaurants,
    });

    const getTopResults = (items) => {
      return items.sort((a, b) => b.score - a.score).slice(0, 3);
    };

    accommodations = getTopResults(accommodations);
    activities = getTopResults(activities);
    restaurants = getTopResults(restaurants);

    console.log("Résultats finaux:", {
      accommodations,
      activities,
      restaurants,
    });

    return {
      accommodations,
      activities,
      restaurants,
    };
    } catch (error) {
    console.error("Error performing search:", error);
    throw new functions.https.HttpsError(
      "internal",
      `Une erreur est survenue lors de la recherche: ${error.message}`,
    );
    }
    });

    exports.checkGroupStatus = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "L'utilisateur doit être authentifié pour vérifier le statut du groupe.",
    );
    }

    const { groupId } = data;
    const userId = context.auth.uid;

    if (!groupId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "L'ID du groupe est requis.",
    );
    }

    try {
    const groupDoc = await admin
      .firestore()
      .collection("groups")
      .doc(groupId)
      .get();
    if (!groupDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Le groupe spécifié n'existe pas.",
      );
    }

    const groupData = groupDoc.data();
    const isCreator = groupData.createdBy === userId;
    const allMembersSubmitted = groupData.members.every(
      (member) =>
        groupData.memberPreferences && groupData.memberPreferences[member],
    );

    return {
      isCreator,
      allMembersSubmitted,
      groupData: {
        tripType: groupData.tripType,
        dates: groupData.dates,
        budget: groupData.budget,
        personCount: groupData.members ? groupData.members.length : 1,
      },
    };
    } catch (error) {
    console.error("Error checking group status:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Une erreur est survenue lors de la vérification du statut du groupe.",
    );
    }
    });

    exports.saveGroupSearch = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'L\'utilisateur doit être authentifié pour sauvegarder une recherche de groupe.'
    );
    }

    const { groupId, searchResults } = data;

    if (!groupId || !searchResults) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'GroupId et searchResults sont requis.'
    );
    }

    try {
    await admin.firestore().collection('groups').doc(groupId).update({
      savedSearch: searchResults,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Recherche sauvegardée avec succès pour le groupe ${groupId}`);
    return { success: true, message: 'Recherche sauvegardée avec succès' };
    } catch (error) {
    console.error('Erreur lors de la sauvegarde de la recherche:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Une erreur est survenue lors de la sauvegarde de la recherche: ${error.message}`
    );
    }
    });

    exports.fetchSavedGroupSearch = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'L\'utilisateur doit être authentifié pour récupérer une recherche de groupe sauvegardée.'
    );
    }

    const { groupId } = data;

    if (!groupId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'GroupId est requis.'
    );
    }

    try {
    const groupDoc = await admin.firestore().collection('groups').doc(groupId).get();

    if (!groupDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Groupe non trouvé');
    }

    const groupData = groupDoc.data();

    if (!groupData.savedSearch) {
      return { exists: false, message: 'Aucune recherche sauvegardée pour ce groupe' };
    }

    return { 
      exists: true, 
      savedSearch: groupData.savedSearch,
      lastUpdated: groupData.lastUpdated
    };
    } catch (error) {
    console.error('Erreur lors de la récupération de la recherche sauvegardée:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Une erreur est survenue lors de la récupération de la recherche sauvegardée: ${error.message}`
    );
    }
    });