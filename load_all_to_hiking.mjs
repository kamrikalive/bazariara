
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

// Initialize Firebase Admin SDK for the Studio environment
initializeApp();
const firestore = getFirestore();

// Load and parse the products file
const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));

async function loadAllProductsToHiking() {
    const collectionRef = firestore.collection('hiking');
    console.log('Starting to load ALL products from products.json into the \'hiking\' collection...');

    try {
        // 1. Clear all existing documents in the 'hiking' collection
        console.log('Attempting to delete existing documents from the \'hiking\' collection...');
        try {
            const snapshot = await collectionRef.get();
            if (!snapshot.empty) {
                const deleteBatch = firestore.batch();
                snapshot.docs.forEach(doc => {
                    deleteBatch.delete(doc.ref);
                });
                await deleteBatch.commit();
                console.log(`Deleted ${snapshot.size} existing documents.`);
            } else {
                console.log('Collection is already empty.');
            }
        } catch (error) {
            if (error.code === 5) { // 5 = NOT_FOUND
                console.log('\'hiking\' collection does not exist yet. Skipping deletion.');
            } else {
                throw error;
            }
        }

        // 2. Use ALL products from the JSON file
        console.log(`Found ${products.length} products in products.json to load.`);

        // 3. Add all products to the collection
        const addBatch = firestore.batch();
        products.forEach(product => {
            const docRef = collectionRef.doc(String(product.id));
            // Create a new object without the 'availability' field and set category
            const { availability, ...productForFirestore } = product;
            productForFirestore.category = 'Товары для отдыха'; // Set category as requested

            addBatch.set(docRef, productForFirestore);
        });

        await addBatch.commit();
        console.log(`Successfully added ${products.length} products to the \'hiking\' collection.`);
        console.log('Database update for the hiking category is complete!');

    } catch (error) {
        console.error('Error updating the hiking category:', error);
        process.exit(1); // Exit with an error code
    }
}

loadAllProductsToHiking();
