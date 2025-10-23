
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
      throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable');
    }
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountKey);
    } catch (e) {
      const decodedKey = Buffer.from(serviceAccountKey, 'base64').toString('utf8');
      serviceAccount = JSON.parse(decodedKey);
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Firebase Admin SDK initialization error', error);
    process.exit(1);
  }
}

const firestore = getFirestore();

async function updateProductPrices() {
  const collections = ['garden', 'hiking'];
  console.log(`Starting to update prices for products in: ${collections.join(', ')}`);

  try {
    for (const collectionName of collections) {
      const collectionRef = firestore.collection(collectionName);
      const snapshot = await collectionRef.get();

      if (snapshot.empty) {
        console.log(`No products found in the ${collectionName} collection. Skipping.`);
        continue;
      }

      let updatedCount = 0;
      const batch = firestore.batch();

      snapshot.forEach(doc => {
        const product = doc.data();
        const currentPrice = product.price;

        if (typeof currentPrice === 'number') {
          const newPrice = currentPrice * 2;
          batch.update(doc.ref, { price: newPrice });
          updatedCount++;
        }
      });

      await batch.commit();
      console.log(`Successfully updated prices for ${updatedCount} products in the ${collectionName} collection.`);
    }
    console.log('Price update process finished.');
  } catch (error) {
    console.error('Error updating product prices:', error);
    process.exit(1);
  }
}

updateProductPrices();
