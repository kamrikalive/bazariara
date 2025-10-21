import { firestore } from '@/lib/firebase/server';
import { NextResponse } from 'next/server';

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

export async function GET() {
    try {
        const batch = firestore.batch();
        products.forEach(product => {
            const docRef = firestore.collection('items').doc(); // Automatically generate unique ID
            batch.set(docRef, product);
        });
        await batch.commit();
        return NextResponse.json({ success: true, message: 'Database seeded successfully!' });
    } catch (error) {
        console.error('Error seeding database:', error);
        // @ts-ignore
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
