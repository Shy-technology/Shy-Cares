// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDipUr3xNDvDWSHVAsoDCY-GZ6t_ojXF24",
    authDomain: "shy-technology.firebaseapp.com",
    projectId: "shy-technology",
    storageBucket: "shy-technology.firebasestorage.app",
    messagingSenderId: "589237669898",
    appId: "1:589237669898:web:2e58b12485cf4a84994ff3",
    measurementId: "G-GWQ68EBCYV"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  export const db = getFirestore(app);
  export const storage = getStorage(app);
  export const auth = getAuth(app);
  