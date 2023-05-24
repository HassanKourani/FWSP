import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDOTASQJ_xU1P0t5HcOc5L4h_KPbrHcp9U",
  authDomain: "seniorproject-cd393.firebaseapp.com",
  projectId: "seniorproject-cd393",
  storageBucket: "seniorproject-cd393.appspot.com",
  messagingSenderId: "620394562973",
  appId: "1:620394562973:web:883ca016fc3f4085b49b74",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { auth, db, storage };
