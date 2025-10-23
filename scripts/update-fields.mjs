
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import products from '../products.json' assert { type: 'json' };

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
    console.log('Firebase Admin SDK initialized successfully for targeted update.');
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
    process.exit(1);
  }
}

const firestore = getFirestore();

async function updateSpecificFields() {
  const collectionName = 'garden';
  console.log(`Starting to update 'image_url' and 'in_stock' fields for the "${collectionName}" collection.`);

  try {
    const batch = firestore.batch();
    const productsToUpdate = products.filter(p => p.category === 'Сад');

    if (productsToUpdate.length === 0) {
      console.log('No products found in products.json for the specified category.');
      return;
    }

    console.log(`Found ${productsToUpdate.length} products in JSON. Preparing batch update.`);

    for (const product of productsToUpdate) {
      if (!product.id) {
        console.warn('Skipping product with no ID:', product.title);
        continue;
      }

      const docRef = firestore.collection(collectionName).doc(String(product.id));
      
      const updateData = {
        image_url: product.image_url,
        in_stock: product.availability !== "Нет в наличии"
      };

      batch.update(docRef, updateData);
    }

    await batch.commit();
    console.log(`Successfully updated ${productsToUpdate.length} products in the "${collectionName}" collection.`);
    console.log("Targeted field update process completed.");

  } catch (error) {
    console.error('Error during targeted update:', error);
    process.exit(1);
  }
}

updateSpecificFields();
