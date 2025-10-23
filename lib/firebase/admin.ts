import * as admin from 'firebase-admin';

// This file initializes the Firebase Admin SDK for server-side operations.

// IMPORTANT: Your service account credentials should be stored securely as environment variables.
// Do not hardcode them in your source code.

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Ensure newlines are correctly formatted
};

// Initialize the app if it hasn't been already
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID, // Explicitly set the project ID
      // You can add your databaseURL here if you use Realtime Database
      // databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error', {
      message: error.message,
      // Only log specific details in a secure, non-production environment
      // In production, you'd want to be more careful about logging sensitive info
      // projectId: process.env.FIREBASE_PROJECT_ID, 
    });
  }
}

// Export the initialized admin instance for use in other server-side files
export { admin };
