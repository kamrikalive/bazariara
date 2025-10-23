
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

// Initialize Firebase Admin SDK for the Studio environment
initializeApp();
const firestore = getFirestore();

// Load and parse the products file
const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));

async function updateProductsById() {
    const collectionRef = firestore.collection('hiking');
    console.log(`Starting to update/add ${products.length} products in the \'hiking\' collection by ID...`);

    try {
        const batch = firestore.batch();

        products.forEach(product => {
            // Use the product ID as the document ID
            const docRef = collectionRef.doc(String(product.id));

            // Prepare the data for Firestore
            const { availability, ...productForFirestore } = product;
            productForFirestore.category = 'Товары для отдыха';

            // Use set with { merge: true } to update existing docs or create new ones.
            // This is the "update by ID" logic.
            batch.set(docRef, productForFirestore, { merge: true });
        });

        // Commit the batch operation
        await batch.commit();

        console.log(`Successfully updated/added ${products.length} products.`);
        console.log('Database update is complete!');

    } catch (error) {
        console.error('Error updating products by ID:', error);
        process.exit(1); // Exit with an error code
    }
}

updateProductsById();
