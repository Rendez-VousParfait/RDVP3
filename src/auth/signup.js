export const signUp = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      username: username,
      email: email,
      // Supprimez la ligne définissant le rôle
      // ... autres champs ...
    });

    return user;
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    throw error;
  }
};