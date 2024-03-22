import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZDmXUKBW1kDSRzuhrIci3lRMwUXzGrEM",
  authDomain: "whatsapp-clone-9b238.firebaseapp.com",
  projectId: "whatsapp-clone-9b238",
  storageBucket: "whatsapp-clone-9b238.appspot.com",
  messagingSenderId: "41392389754",
  appId: "1:41392389754:web:ab9ff34986e70f749005c3",
  measurementId: "G-1QPJPLTD3P"
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);