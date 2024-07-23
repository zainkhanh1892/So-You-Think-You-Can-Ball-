// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, GoogleAuthProvider } from "firebase/database"
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeIl8FS-KTy0XDNxmPRqknC7yQlGdU114",
  authDomain: "soyouthinkyoucanball-6cb78.firebaseapp.com",
  projectId: "soyouthinkyoucanball-6cb78",
  storageBucket: "soyouthinkyoucanball-6cb78.appspot.com",
  messagingSenderId: "743027847258",
  appId: "1:743027847258:web:baf5d3bf237a40c89e2863",
  measurementId: "G-KMGVQG2J78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
const database = getDatabase(app);
export { app, auth, database, };