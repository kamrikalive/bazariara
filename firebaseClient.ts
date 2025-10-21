// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASpXekYaQlTYDJRxLTNIQIla8rxSxwjJY",
  authDomain: "bazarge-95f65.firebaseapp.com",
  databaseURL: "https://bazarge-95f65-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bazarge-95f65",
  storageBucket: "bazarge-95f65.appspot.com",
  messagingSenderId: "134025029703",
  appId: "1:134025029703:web:9a6ee8eaf1005aea506962"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
