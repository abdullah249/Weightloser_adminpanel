import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyD10nvaAXiUiHtKbc4r3Ekp5kha3ZfdQsY",
  authDomain: "weightloser-2de95.firebaseapp.com",
  databaseURL: "https://weightloser-2de95-default-rtdb.firebaseio.com",
  projectId: "weightloser-2de95",
  storageBucket: "weightloser-2de95.appspot.com",
  messagingSenderId: "702064832074",
  appId: "1:702064832074:web:b03940039a4b97353380b3",
  measurementId: "G-MFX2M2ECLF",
};

const firbaseApp = initializeApp(config);
const db = getFirestore(firbaseApp);
export { db };
