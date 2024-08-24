const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configuration de l'expéditeur de l'e-mail (utilisez un service comme SendGrid ou votre propre serveur SMTP)
const transporter = nodemailer.createTransport({
  // Configurez votre service d'e-mail ici
  // Par exemple, pour Gmail (moins recommandé pour la production) :
  service: 'gmail',
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password
  }
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// Exemple de fonction pour créer un utilisateur
exports.createUser = functions.https.onCall((data, context) => {
  // Vérifiez l'authentification si nécessaire
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated.",
    );
  }

  const { name, email } = data;

  // Logique pour créer un utilisateur dans Firestore
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
      throw new functions.https.HttpsError("internal", error.message);
    });
});

// Nouvelle fonction pour envoyer un e-mail d'invitation
exports.sendInvitationEmail = functions.https.onCall(async (data, context) => {
  // Vérifiez l'authentification si nécessaire
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to send invitations."
    );
  }

  const { email, groupName, invitationLink } = data;

  const mailOptions = {
    from: 'Votre App <noreply@votreapp.com>',
    to: email,
    subject: `Invitation à rejoindre le groupe "${groupName}"`,
    html: `
      <h1>Vous avez été invité à rejoindre un groupe de voyage !</h1>
      <p>Vous avez été invité à rejoindre le groupe "${groupName}" sur notre application de planification de voyage.</p>
      <p>Pour accepter l'invitation, cliquez sur le lien suivant :</p>
      <a href="${invitationLink}">Rejoindre le groupe</a>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Invitation email sent successfully" };
  } catch (error) {
    console.error('Erreur lors de l'envoi de l'e-mail:', error);
    throw new functions.https.HttpsError('internal', 'Impossible d'envoyer l'e-mail d'invitation.');
  }
});