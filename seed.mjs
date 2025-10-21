import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

// Initialize Firebase Admin SDK without explicit credentials
// It should automatically discover credentials in the Firebase Studio environment
initializeApp();

const firestore = getFirestore();

const products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));

async function seedDatabase() {
    try {
        const batch = firestore.batch();
        console.log('Starting to seed database with products from \'Сад\' category into \'gre garden\'...');
        const gardenProducts = products.filter(p => p.category === 'Сад');

        gardenProducts.forEach((product, index) => {
            const productData = {
                id: product.id,
                category: 'gre garden',
                title: product.title,
                price: product.price,
                description: product.description,
                image_url: product.image_url
            };
            console.log(`Adding product ${index + 1}: ${productData.title}`);
            const docRef = firestore.collection('gre_garden_items').doc(); // Create a new document with a random ID
            batch.set(docRef, productData);
        });

        await batch.commit();
        console.log('Database seeded successfully! Garden products have been added to the \'gre_garden_items\' collection.');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seedDatabase();
