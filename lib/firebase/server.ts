import admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount as string)),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  } catch (e) {
    console.error('Firebase admin initialization error', e);
  }
}

const database = admin.database();

export { database };
