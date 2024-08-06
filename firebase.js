// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRMMSuluEjszf1G4O51hKC26vakHpdks8",
  authDomain: "hspanryapp.firebaseapp.com",
  projectId: "hspanryapp",
  storageBucket: "hspanryapp.appspot.com",
  messagingSenderId: "680479471420",
  appId: "1:680479471420:web:c76250cf51666d9f22d039"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { app, firestore }