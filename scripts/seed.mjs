import admin from 'firebase-admin';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import products from '../../products.json' assert { type: 'json' };


// Initialize Firebase Admin SDK using Base64 encoded service account
try {
  if (!admin.apps.length) {
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
    initializeApp({
      credential: cert(serviceAccount),
    });
    
    console.log('Firebase Admin SDK initialized successfully for seeding.');
  }
} catch (error) {
  console.error('Firebase initialization error:', error.message);
  process.exit(1);
}

const firestore = getFirestore();

async function seedDatabase() {
    console.log('Seeding database...');
    try {
        const batch = firestore.batch();
        products.forEach(product => {
            // Use a consistent collection name for all products
            const docRef = firestore.collection('products').doc(String(product.id)); 
            batch.set(docRef, product);
        });
        await batch.commit();
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
