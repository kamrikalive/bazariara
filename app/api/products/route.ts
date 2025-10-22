import { db } from '@/lib/firebase';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const gardenSnapshot = await db.collection('garden').get();
        const gardenProducts = gardenSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const hikingSnapshot = await db.collection('hiking').get();
        const hikingProducts = hikingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const allProducts = [...gardenProducts, ...hikingProducts];

        return NextResponse.json(allProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        // @ts-ignore
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
