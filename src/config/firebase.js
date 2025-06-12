import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDPjrvR3U0qAwfhH_nH-xGwx23qd1LiR6Y",
  authDomain: "fir-app-f6a15.firebaseapp.com",
  projectId: "fir-app-f6a15",
  storageBucket: "fir-app-f6a15.appspot.com",
  messagingSenderId: "783730760736",
  appId: "1:783730760736:web:72ac071b9366630c8ff045",
  measurementId: "G-PGXPKEBLPD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Add scopes for Google sign-in
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
// Always prompt for account selection
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const database = getFirestore(app);