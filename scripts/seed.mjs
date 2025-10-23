
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
    console.log('Firebase Admin SDK initialized successfully for seeding.');
  } catch (error) {
    console.error('Firebase Admin SDK initialization error in seed script', error);
    process.exit(1);
  }
}

const firestore = getFirestore();

async function seedDatabase() {
    const categories = {
        'Сад': 'garden',
    };

    console.log('Starting to seed database for the "garden" collection.');

    try {
        for (const [jsonCategory, firestoreCollection] of Object.entries(categories)) {
            console.log(`Processing category: "${jsonCategory}" for collection: "${firestoreCollection}"`);

            const batch = firestore.batch();
            const categoryProducts = products.filter(p => p.category === jsonCategory);

            if (categoryProducts.length === 0) {
                console.log(`No products with category "${jsonCategory}" found in products.json. Skipping.`);
                continue;
            }

            console.log(`Found ${categoryProducts.length} products to update/create in "${firestoreCollection}".`);

            categoryProducts.forEach(product => {
                const { availability, price, ...rest } = product;
                const docRef = firestore.collection(firestoreCollection).doc(String(product.id));

                const newPrice = price * 2;

                const firestoreProduct = {
                    ...rest, 
                    price: newPrice, // Set the new, doubled price
                    in_stock: availability !== "Нет в наличии" // Set in_stock to true unless explicitly out of stock
                };

                // Use set with merge to update existing documents or create new ones
                batch.set(docRef, firestoreProduct, { merge: true });
            });

            await batch.commit();
            console.log(`Successfully seeded ${categoryProducts.length} products in the "${firestoreCollection}" collection.`);
        }
        console.log("Database seeding process completed.");

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
