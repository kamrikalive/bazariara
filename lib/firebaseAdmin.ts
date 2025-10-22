
import admin from 'firebase-admin';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length && serviceAccountKey) {
  try {
    // Decode the base64 encoded service account key
    const decodedServiceAccountKey = Buffer.from(serviceAccountKey, 'base64').toString('utf8');
    const serviceAccount = JSON.parse(decodedServiceAccountKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

const db = admin.apps.length ? admin.firestore() : null;

export { db };
