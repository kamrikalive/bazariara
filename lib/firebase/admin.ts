
import * as admin from 'firebase-admin';

// Initialize the app if it hasn't been already
if (!admin.apps.length) {
  try {
    // Ensure the environment variable is set
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set.');
    }

    // Decode the Base64 encoded service account
    const serviceAccountString = Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
      'base64'
    ).toString('utf8');
    
    const serviceAccount = JSON.parse(serviceAccountString);

    // Initialize the Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    console.log('Firebase Admin SDK initialized successfully via Base64 credentials.');

  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error', {
      message: error.message,
    });
  }
}

// Export the initialized admin instance for use in other server-side files
export { admin };
