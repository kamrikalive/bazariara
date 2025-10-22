import { db } from '@/lib/firebase';
import { NextResponse } from 'next/server';

async function getProductFromCollection(collectionName: string, id: string) {
    const doc = await db.collection(collectionName).doc(id).get();
    if (doc.exists) {
        return { id: doc.id, ...doc.data() };
    }
    return null;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        let product = await getProductFromCollection('garden', params.id);
        if (!product) {
            product = await getProductFromCollection('hiking', params.id);
        }

        if (!product) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        // @ts-ignore
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
