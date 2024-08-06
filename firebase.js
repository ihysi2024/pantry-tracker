import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyDK9AE7YBJN3EfeYsqRtjyeW1ztwQc4lWg",
    authDomain: "pantry-tracker-55c7d.firebaseapp.com",
    projectId: "pantry-tracker-55c7d",
    storageBucket: "pantry-tracker-55c7d.appspot.com",
    messagingSenderId: "636847483917",
    appId: "1:636847483917:web:e4b63a5b0c9752dfa23944",
    measurementId: "G-Z31B1T99F3"
  };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };