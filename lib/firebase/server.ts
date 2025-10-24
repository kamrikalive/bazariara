
import admin from 'firebase-admin';

// Function to get credentials from environment variables
const getFirebaseCredentials = () => {
  // Handle the single, possibly base64-encoded service account key
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      let serviceAccount;
      try {
        // First, try to parse it as a raw JSON string
        serviceAccount = JSON.parse(serviceAccountKey);
      } catch (e) {
        // If that fails, assume it's a base64 encoded string and decode it
        const decodedKey = Buffer.from(serviceAccountKey, 'base64').toString('utf8');
        serviceAccount = JSON.parse(decodedKey);
      }
      return {
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      };
    } catch (error: any) {
      console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", error.message);
      throw new Error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY.");
    }
  }

  // Fallback to individual environment variables if the single key is not present
  if (!process.env.PROJECT_ID || !process.env.CLIENT_EMAIL || !process.env.PRIVATE_KEY) {
    throw new Error('Firebase server credentials (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY, or a complete FIREBASE_SERVICE_ACCOUNT_KEY) are not set in environment variables.');
  }

  return {
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    // Restore newlines in the private key, as they are often escaped in env vars
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  };
};

// Initialize Firebase Admin SDK only if it hasn't been initialized yet
if (!admin.apps.length) {
  try {
    const credentials = getFirebaseCredentials();
    // Correct Database URL for the europe-west1 region
    const databaseURL = "https://bazarge-95f65-default-rtdb.europe-west1.firebasedatabase.app";

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: credentials.projectId,
        clientEmail: credentials.clientEmail,
        privateKey: credentials.privateKey,
      }),
      databaseURL: databaseURL,
      projectId: credentials.projectId,
    });
    console.log('Firebase Admin SDK initialized successfully on the server.');

  } catch (error) {
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
  }
}

// Export the initialized services
export const firestore = admin.firestore();
export const database = admin.database();
