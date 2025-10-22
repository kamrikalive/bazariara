
import admin from 'firebase-admin';

// Check if the service account key is available
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

// Initialize Firebase Admin only if it hasn't been initialized yet
// and the service account key is available.
if (!admin.apps.length && serviceAccountKey) {
  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

// Export a db instance only if an app is available.
// This prevents the build-time error.
const db = admin.apps.length ? admin.firestore() : null;

export { db };
