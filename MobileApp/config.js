import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDWypKyU_bVFutF2cHYqAcrhkQlCchuVsg",
  authDomain: "opot-2b284.firebaseapp.com",
  databaseURL: "https://opot-2b284-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "opot-2b284",
  storageBucket: "opot-2b284.appspot.com",
  messagingSenderId: "806942648227",
  appId: "1:806942648227:web:95402cf01e27fbcd615c16"
};

const app = initializeApp(firebaseConfig);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export { firebase };

export const db = getDatabase(app)