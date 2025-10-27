import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import fs from 'fs';

const firebaseConfig = {
    databaseURL: "https://bazarge-95f65-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const products = JSON.parse(fs.readFileSync('top.json', 'utf-8'));

async function seedDatabase() {
    try {
        console.log('Starting to seed Realtime Database with products from top.json into /products/top...');
        const promises = products.map(product => {
            // The only change is here: the path is now 'products/top/'
            const productRef = ref(database, 'products/top/' + product.id);
            console.log(`Setting data for product ID: ${product.id}`);
            return set(productRef, product);
        });

        await Promise.all(promises);
        console.log('Realtime Database seeded successfully! All fields for top products have been added to the /products/top path.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding Realtime Database:', error);
        process.exit(1);
    }
}

seedDatabase();