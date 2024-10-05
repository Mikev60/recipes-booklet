import { recipesCollection, storageRef, db } from "@/includes/firebase.js";
import {
  getDocs,
  updateDoc,
  addDoc,
  doc,
  getDoc,
  collection,
} from "firebase/firestore";
import {
  uploadBytes,
  ref as refFunction,
  getDownloadURL,
} from "firebase/storage";

async function getCollectionDocuments(CollectionRef) {
  let array = [];
  const querySnapshot = await getDocs(CollectionRef);
  querySnapshot.forEach((doc) => {
    array.push({ ...doc.data(), id: doc.id });
  });
  return array;
}

async function getSingleDocument(documentID, collectionString) {
  const docRef = doc(db, collectionString, documentID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {
      ...docSnap.data(),
      id: docSnap.id,
    };
  } else {
    throw error;
  }
}

async function uploadFile(filePath, file) {
  const fileRef = refFunction(storageRef, filePath);
  await uploadBytes(fileRef, file);
  const fileUrl = await getDownloadURL(fileRef);
  return fileUrl;
}

async function updateDocument(collectionString, documentID, valueObject) {
  const docRef = doc(db, collectionString, documentID);
  await updateDoc(docRef, valueObject);
}

async function createDocument(collectionRef, valueObject) {
  const queryResult = await addDoc(collectionRef, valueObject);
  return queryResult;
}

export {
  getCollectionDocuments,
  getSingleDocument,
  uploadFile,
  updateDocument,
  createDocument,
};
