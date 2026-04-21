import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5tLsYhe_7prdRjctn88K3r4an5Zd8qlc",
  authDomain: "nestme-18df7.firebaseapp.com",
  projectId: "nestme-18df7",
  appId: "1:97785357490:web:7adc29d2f130d0030155ab",
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);

// 🔥 FIX: ensure persistence is applied BEFORE auth usage
export const initAuth = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    // console.log("✅ Firebase persistence ready");
  } catch (err) {
    console.error("❌ Persistence error:", err);
  }
};