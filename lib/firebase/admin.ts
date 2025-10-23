
import admin from 'firebase-admin';

// This is the correct way to initialize the Firebase Admin SDK in a serverless environment like Vercel.
// It uses environment variables to configure the SDK.

if (!admin.apps.length) {
  try {
    // Ensure all required environment variables are present
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error('Missing Firebase environment variables (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY)');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key must be formatted correctly by replacing escaped newlines.
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Firebase Admin SDK initialization error', error);
  }
}

// Export the initialized admin instance
export const firestore = admin.firestore();
export { admin };
