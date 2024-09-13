import { db } from '../../firebase'; // Assurez-vous que le chemin est correct

import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Fonction pour ajouter un billet de blog
export const addBlogPost = async (postData) => {
  try {
    const docRef = await addDoc(collection(db, "blogPosts"), postData);
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de la création du billet de blog:", error);
    throw error;
  }
};

// Fonction pour récupérer tous les billets de blog
export const getBlogPosts = async () => {
  try {
    const snapshot = await getDocs(collection(db, "blogPosts"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des billets de blog:", error);
    throw error;
  }
};

// Fonction pour récupérer un billet de blog par ID
export const getBlogPostById = async (id) => {
  try {
    const docRef = doc(db, "blogPosts", id);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return { id: docSnapshot.id, ...docSnapshot.data() };
    } else {
      throw new Error("Le billet de blog n'existe pas.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du billet de blog:", error);
    throw error;
  }
};

// Fonction pour mettre à jour un billet de blog
export const updateBlogPost = async (id, updatedData) => {
  try {
    const docRef = doc(db, "blogPosts", id);
    await updateDoc(docRef, updatedData);
    return id;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du billet de blog:", error);
    throw error;
  }
};

// Fonction pour supprimer un billet de blog
export const deleteBlogPost = async (id) => {
  try {
    const docRef = doc(db, "blogPosts", id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error("Erreur lors de la suppression du billet de blog:", error);
    throw error;
  }
};