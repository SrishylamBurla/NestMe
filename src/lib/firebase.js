import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5tLsYhe_7prdRjctn88K3r4an5Zd8qlc",
  authDomain: "nestme-18df7.firebaseapp.com",
  projectId: "nestme-18df7",
  appId: "1:97785357490:web:7adc29d2f130d0030155ab",
};

// ✅ Prevent multiple initialization (IMPORTANT)
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// ✅ MUST export auth like this
export const auth = getAuth(app);