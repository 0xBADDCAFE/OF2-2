// Import the functions you need from the SDKs you need
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { app } from "./app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const db = getFirestore(app);

const addScore = async (score: Score) => {
  try {
    const docRef = await addDoc(collection(db, "scores"), score);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export default { addScore };
