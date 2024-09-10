const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password
  }
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

exports.sendInvitationEmail = functions.https.onCall(async (data, context) => {
  console.log("Début de sendInvitationEmail avec données:", data);

  if (!context.auth) {
    console.log("Erreur: Utilisateur non authentifié");
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated to send invitations.");
  }

  const { email, groupName, groupId } = data;

  if (!email || !groupName || !groupId) {
    console.log("Erreur: Données manquantes", { email, groupName, groupId });
    throw new functions.https.HttpsError("invalid-argument", "Email, group name, and group ID are required.");
  }

  const searchLink = `https://03180a26-2db9-48f9-96be-160405a77d05-00-2ilb0tmq75o6f.spock.replit.dev/search?groupId=${encodeURIComponent(groupId)}`;

  const mailOptions = {
    from: 'Rendez-Vous Parfait <noreply@rendez-vous-parfait.com>',
    to: email,
    subject: `Invitation à rejoindre le groupe "${groupName}"`,
    html: `
      <h1>Vous avez été invité à rejoindre un groupe de voyage !</h1>
      <p>Vous avez été invité à rejoindre le groupe "${groupName}" sur Rendez-Vous Parfait, notre application de planification de voyage.</p>
      <p>Pour accepter l'invitation et remplir vos préférences, cliquez sur le lien suivant :</p>
      <a href="${searchLink}">Rejoindre le groupe et remplir mes préférences</a>
    `
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
    throw new functions.https.HttpsError('internal', `Impossible d'envoyer l'e-mail d'invitation: ${error.message}`);
  }
});

exports.notifyGroupMembers = functions.firestore
  .document('groups/{groupId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();
    const groupId = context.params.groupId;

    if (newValue.members.length > previousValue.members.length) {
      const newMembers = newValue.members.filter(m => !previousValue.members.includes(m));

      for (const memberEmail of newMembers) {
        const mailOptions = {
          from: 'Rendez-Vous Parfait <noreply@rendez-vous-parfait.com>',
          to: memberEmail,
          subject: `Remplissez vos préférences pour le groupe "${newValue.name}"`,
          html: `
            <h1>Vous avez rejoint un nouveau groupe de voyage !</h1>
            <p>Vous avez été ajouté au groupe "${newValue.name}" sur Rendez-Vous Parfait.</p>
            <p>Veuillez remplir vos préférences pour le voyage en vous connectant à l'application.</p>
            <a href="https://03180a26-2db9-48f9-96be-160405a77d05-00-2ilb0tmq75o6f.spock.replit.dev/search?groupId=${groupId}">Remplir mes préférences</a>
          `
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`E-mail de notification envoyé à ${memberEmail}`);
        } catch (error) {
          console.error(`Erreur lors de l'envoi de l'e-mail à ${memberEmail}:`, error);
        }
      }
    }

    const memberPreferences = newValue.memberPreferences || {};
    if (Object.keys(memberPreferences).length === newValue.members.length) {
      const creatorEmail = newValue.members[0];
      const mailOptions = {
        from: 'Rendez-Vous Parfait <noreply@rendez-vous-parfait.com>',
        to: creatorEmail,
        subject: `Toutes les préférences sont remplies pour le groupe "${newValue.name}"`,
        html: `
          <h1>Toutes les préférences ont été remplies !</h1>
          <p>Tous les membres du groupe "${newValue.name}" ont rempli leurs préférences.</p>
          <p>Vous pouvez maintenant lancer la recherche pour le groupe.</p>
          <a href="https://03180a26-2db9-48f9-96be-160405a77d05-00-2ilb0tmq75o6f.spock.replit.dev/search?groupId=${groupId}">Lancer la recherche</a>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail de notification envoyé au créateur ${creatorEmail}`);
      } catch (error) {
        console.error(`Erreur lors de l'envoi de l'e-mail au créateur ${creatorEmail}:`, error);
      }
    }
  });