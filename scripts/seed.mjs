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
        image_url: '/sneakers/sneakers-3.jpg',
        category: 'garden',
        description: 'Удобная и легкая лейка для полива ваших растений в саду и дома.'
    },
    {
        title: 'Газонокосилка',
        price: 15000,
        image_url: '/sneakers/sneakers-4.jpg',
        category: 'garden',
        description: 'Мощная и эффективная газонокосилка для поддержания вашего газона в идеальном состоянии.'
    },
    {
        title: 'Надувной матрас',
        price: 2500,
        image_url: '/sneakers/sneakers-5.jpg',
        category: 'leisure',
        description: 'Комфортный надувной матрас, который отлично подойдет для отдыха на природе или в качестве дополнительного спального места.'
    },
    {
        title: 'Набор для бадминтона',
        price: 1200,
        image_url: '/sneakers/sneakers-6.jpg',
        category: 'leisure',
        description: 'Набор для бадминтона для активного отдыха на свежем воздухе. Включает 2 ракетки и воланчик.'
    },
    {
        title: 'Мужские Кроссовки Nike Blazer Mid Suede',
        price: 12999,
        image_url: '/sneakers/sneakers-1.jpg',
        category: 'hiking', // Changed from 'shoes' to 'hiking' to match existing categories
        description: 'Классические кеды Nike Blazer в замшевом исполнении. Стильный выбор на каждый день.'
    },
    {
        title: 'Мужские Кроссовки Nike Air Max 270',
        price: 15599,
        image_url: '/sneakers/sneakers-2.jpg',
        category: 'hiking', // Changed from 'shoes' to 'hiking'
        description: 'Современные и удобные кроссовки Nike Air Max 270 с большой воздушной подушкой для максимального комфорта.'
    }
];

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
