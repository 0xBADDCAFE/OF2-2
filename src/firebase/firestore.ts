// Import the functions you need from the SDKs you need
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  DocumentData,
  CollectionReference,
  DocumentReference,
  setDoc,
  DocumentSnapshot,
} from "firebase/firestore";
import app from "./app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

type CollectionName = "scores" | "users";
export type DBRow<T> = T & { createdAt: Date };

// Initialize Firebase
const db = getFirestore(app);

const addScore = async (score: Score) => {
  try {
    const docRef = await addDoc(createCollection<DBRow<Score>>("scores"), {
      ...score,
      createdAt: serverTimestamp(),
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

const setScore = async (
  docSnap: DocumentSnapshot<DBRow<Score>>,
  score: Score
) => {
  await setDoc(
    createDoc(createCollection<DBRow<Score>>("scores"), docSnap.id),
    score
  );
};

const setUser = async (id: string, user: User) => {
  await setDoc(createDoc(createCollection<User>("users"), id), user);
};

// unused
const addUser = async (user: User) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      ...user,
      createdAt: serverTimestamp(),
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error setting document: ", e);
    throw e;
  }
};

const getUser = async (id: string): Promise<User | null> => {
  try {
    const docSnap = await getDoc(
      createDoc(createCollection<User>("users"), id)
    );
    // or
    // const docSnap = await getDoc(createDoc<User>(`users/${id}`));

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error geting document: ", e);
    throw e;
  }
};

// https://firebase.google.com/docs/firestore/data-model
// https://javascript.plainenglish.io/using-firestore-with-typescript-in-the-v9-sdk-cf36851bb099
const createCollection = <T = DocumentData>(collectionName: CollectionName) => {
  return collection(db, collectionName) as CollectionReference<T>;
};
// https://stackoverflow.com/a/53143568
type CreateDocSignature = {
  <T>(docPath: string): DocumentReference<T>;
  <T>(collection: CollectionReference<T>, docId: string): DocumentReference<T>;
};
const createDoc: CreateDocSignature = <T>(
  a1: string | CollectionReference<T>,
  a2?: string
) => {
  if (typeof a1 === "string") {
    const docPath = a1;
    return doc(db, docPath) as DocumentReference<T>;
  } else {
    const collection = a1;
    const docId = a2;
    return doc(collection, docId);
  }
};

export { addScore, setScore, addUser, setUser, getUser };
