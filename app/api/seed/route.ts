import { db } from '@/lib/firebase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const products: any[] = [];

export async function GET() {
    try {
        // Use a batch to add all products in one go
        const batch = db.batch();
        products.forEach((product) => {
            const docRef = db.collection('products').doc(); // Auto-generate ID
            batch.set(docRef, product);
        });

        await batch.commit();

        return NextResponse.json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error("Error seeding database:", error);
        // Make sure to check if error is an instance of Error
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return new NextResponse(JSON.stringify({ message: 'Failed to seed database', error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
