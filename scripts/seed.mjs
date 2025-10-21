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

const products = [
    {
        title: 'Садовая лейка',
        price: 500,
        imageUrl: '/sneakers/sneakers-3.jpg',
        category: 'garden'
    },
    {
        title: 'Газонокосилка',
        price: 15000,
        imageUrl: '/sneakers/sneakers-4.jpg',
        category: 'garden'
    },
    {
        title: 'Надувной матрас',
        price: 2500,
        imageUrl: '/sneakers/sneakers-5.jpg',
        category: 'leisure'
    },
    {
        title: 'Набор для бадминтона',
        price: 1200,
        imageUrl: '/sneakers/sneakers-6.jpg',
        category: 'leisure'
    },
    {
        title: 'Мужские Кроссовки Nike Blazer Mid Suede',
        price: 12999,
        imageUrl: '/sneakers/sneakers-1.jpg',
        category: 'shoes'
    },
    {
        title: 'Мужские Кроссовки Nike Air Max 270',
        price: 15599,
        imageUrl: '/sneakers/sneakers-2.jpg',
        category: 'shoes'
    }
];

async function seedDatabase() {
    console.log('Seeding database...');
    try {
        const batch = firestore.batch();
        const collectionRef = firestore.collection('items');
        products.forEach(product => {
            const docRef = collectionRef.doc();
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
