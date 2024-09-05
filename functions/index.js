const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require('nodemailer');

// Initialisation de l'application Firebase Admin
admin.initializeApp();

// Configuration du transporteur d'e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password
  }
});

// Fonction de test Hello World
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// Fonction pour créer un utilisateur
exports.createUser = functions.https.onCall((data, context) => {
  // Vérification de l'authentification
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated.",
    );
  }

  const { name, email } = data;

  // Création de l'utilisateur dans Firestore
  return admin
    .firestore()
    .collection("users")
    .add({
      name: name,
      email: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      return { success: true, message: "User created successfully" };
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      throw new functions.https.HttpsError("internal", error.message);
    });
});

// Fonction pour envoyer un e-mail d'invitation
exports.sendInvitationEmail = functions.https.onCall(async (data, context) => {
  // Vérification de l'authentification
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to send invitations."
    );
  }

  const { email, groupName, invitationLink } = data;

  // Vérification des données requises
  if (!email || !groupName || !invitationLink) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Email, group name, and invitation link are required."
    );
  }

  const mailOptions = {
    from: 'Rendez-Vous Parfait <noreply@rendez-vous-parfait.com>',
    to: email,
    subject: `Invitation à rejoindre le groupe "${groupName}"`,
    html: `
      <h1>Vous avez été invité à rejoindre un groupe de voyage !</h1>
      <p>Vous avez été invité à rejoindre le groupe "${groupName}" sur Rendez-Vous Parfait, notre application de planification de voyage.</p>
      <p>Pour accepter l'invitation, cliquez sur le lien suivant :</p>
      <a href="${invitationLink}">Rejoindre le groupe</a>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Invitation email sent successfully to ${email}`);
    return { success: true, message: "Invitation email sent successfully" };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail:", error);
    throw new functions.https.HttpsError('internal', "Impossible d'envoyer l'e-mail d'invitation.");
  }
});