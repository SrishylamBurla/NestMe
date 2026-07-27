import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import fs from "fs";
import path from "path";

let app;

if (getApps().length > 0) {
  app = getApps()[0];
} else if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
} else {
  const serviceAccount = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "serviceAccountKey.json"),
      "utf8"
    )
  );

  app = initializeApp({
    credential: cert(serviceAccount),
  });
}

export const messaging = getMessaging(app);