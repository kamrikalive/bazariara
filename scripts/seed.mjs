import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import products from '../products.json' assert { type: 'json' };

// Correctly initialize Firebase Admin SDK for the seeding script
if (!admin.apps.length) {
  try {
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error('Missing Firebase environment variables for seeding script');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin SDK initialized successfully for seeding.');
  } catch (error) {
    console.error('Firebase Admin SDK initialization error in seed script', error);
    process.exit(1); // Exit if initialization fails
  }
}

const firestore = getFirestore();

async function seedDatabase() {
    console.log('Seeding database...');
    try {
        const batch = firestore.batch();
        products.forEach(product => {
            const collectionRef = firestore.collection(product.category);
            const docRef = collectionRef.doc(String(product.id)); 
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
