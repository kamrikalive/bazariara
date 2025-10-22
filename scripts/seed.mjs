import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
try {
  if (!admin.apps.length) {
    initializeApp();
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
            const collectionRef = firestore.collection(product.category);
            const docRef = collectionRef.doc(); // Firestore will auto-generate an ID
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
