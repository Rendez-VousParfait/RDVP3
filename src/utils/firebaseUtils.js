import { db } from "../firebase";
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
} from "firebase/firestore";

export const createOrUpdateSearch = async (
  userId,
  searchData,
  searchId = null,
) => {
  try {
    let searchRef;
    if (searchId) {
      searchRef = doc(db, "searches", searchId);
    } else {
      searchRef = doc(collection(db, "searches"));
    }

    const timestamp = serverTimestamp();
    const searchDocData = {
      userId,
      ...searchData,
      updatedAt: timestamp,
    };

    if (!searchId) {
      searchDocData.createdAt = timestamp;
    }

    if (searchId) {
      await updateDoc(searchRef, searchDocData);
    } else {
      await setDoc(searchRef, searchDocData);
    }

    return searchRef.id;
  } catch (error) {
    console.error("Error creating/updating search document:", error);
    throw error;
  }
};