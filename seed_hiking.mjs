
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

// Initialize Firebase Admin SDK for the Studio environment
initializeApp();
const firestore = getFirestore();

// Load and parse the products file
const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));

async function seedHikingCategory() {
    const collectionRef = firestore.collection('hiking');
    console.log('Starting to update the \'hiking\' category...');

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
                console.log('Collection is already empty. No documents to delete.');
            }
        } catch (error) {
            if (error.code === 5) { // 5 = NOT_FOUND
                console.log('\'hiking\' collection does not exist yet. Skipping deletion.');
            } else {
                throw error;
            }
        }

        // 2. Filter for products with the category "Товары для отдыха"
        const hikingProducts = products.filter(p => p.category === 'Товары для отдыха');
        
        if (hikingProducts.length === 0) {
            console.log('No products found for the \"Товары для отдыха\" category in products.json. The collection will remain empty.');
            return;
        }

        console.log(`Found ${hikingProducts.length} products to add.`);

        // 3. Add new products to the collection, excluding the 'availability' field
        const addBatch = firestore.batch();
        hikingProducts.forEach(product => {
            const docRef = collectionRef.doc(String(product.id));
            // Create a new object without the 'availability' field
            const { availability, ...productForFirestore } = product;
            addBatch.set(docRef, productForFirestore);
        });

        await addBatch.commit();
        console.log(`Successfully added ${hikingProducts.length} products to the \'hiking\' collection.`);
        console.log('Database update for the hiking category is complete!');

    } catch (error) {
        console.error('Error updating the hiking category:', error);
        process.exit(1); // Exit with an error code
    }
}

seedHikingCategory();
