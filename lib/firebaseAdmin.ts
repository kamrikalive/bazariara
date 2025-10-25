import admin from 'firebase-admin';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length && serviceAccountKey) {
  let serviceAccount;
  try {
    // First, try to parse it as a raw JSON string
    serviceAccount = JSON.parse(serviceAccountKey);
  } catch (e) {
    // If that fails, assume it's a base64 encoded string and decode it
    try {
      const decodedKey = Buffer.from(serviceAccountKey, 'base64').toString('utf8');
      serviceAccount = JSON.parse(decodedKey);
    } catch (error) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it is either a valid JSON string or a Base64 encoded JSON string.', error);
    }
  }

  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error('Firebase Admin initialization error', error);
    }
  }
}

const db = admin.apps.length ? admin.firestore() : null;

export { db };
