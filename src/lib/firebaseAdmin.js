import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import fs from "fs";
import path from "path";

const serviceAccount = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "serviceAccountKey.json"),
    "utf8"
  )
);

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];

export const messaging = getMessaging(app);

export default app;