import admin from 'firebase-admin';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length && serviceAccountKey) {
  let serviceAccount;
  try {
    // First, try to parse it as a raw JSON string
    serviceAccount = JSON.parse(serviceAccountKey);
    console.log('Parsed service account key from raw JSON.');
  } catch (e) {
    // If that fails, assume it's a base64 encoded string and decode it
    try {
      const decodedKey = Buffer.from(serviceAccountKey, 'base64').toString('utf8');
      serviceAccount = JSON.parse(decodedKey);
      console.log('Parsed service account key from Base64 string.');
    } catch (error) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it is either a valid JSON string or a Base64 encoded JSON string.', error);
    }
  }

  if (serviceAccount) {
    try {
      // Явно передаём projectId из ENV
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL || serviceAccount.client_email,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || serviceAccount.private_key).replace(/\\n/g, '\n'),
        }),
      });
      console.log('Firebase Admin initialized.');
    } catch (error) {
      console.error('Firebase Admin initialization error', error);
    }
  }
}

const db = admin.apps.length ? admin.firestore() : null;

export { db };
