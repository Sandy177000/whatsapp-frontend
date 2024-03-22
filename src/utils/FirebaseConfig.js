import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "whatsapp-clone-9b238.firebaseapp.com",
  projectId: "whatsapp-clone-9b238",
  storageBucket: "whatsapp-clone-9b238.appspot.com",
  messagingSenderId: "xxxxxxx",
  appId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  measurementId: "G-1QPJPLTD3P"
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
