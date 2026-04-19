// ─── CONFIGURAÇÃO FIREBASE SER+ ───────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMx1xOGr876NJsjIguvV6BchhuVVrJAOM",
  authDomain: "ser-mais-7d338.firebaseapp.com",
  projectId: "ser-mais-7d338",
  storageBucket: "ser-mais-7d338.firebasestorage.app",
  messagingSenderId: "974915147883",
  appId: "1:974915147883:web:b3c197a41bbf60033d392e",
  measurementId: "G-JPM0YRW37Q"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
