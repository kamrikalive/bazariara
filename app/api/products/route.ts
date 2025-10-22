
import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebaseAdmin';

export async function GET() {
  // If db is not initialized (e.g., during build), return an empty array.
  if (!db) {
    return NextResponse.json([]);
  }

  try {
    const hikingSnapshot = await db.collection('hiking').get();
    const gardenSnapshot = await db.collection('garden').get();

    const hikingProducts = hikingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const gardenProducts = gardenSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const allProducts = [...hikingProducts, ...gardenProducts];

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
