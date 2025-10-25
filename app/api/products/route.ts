import { database } from '@/lib/firebase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const productsRef = database.ref('products');
    const snapshot = await productsRef.once('value');
    const products = snapshot.val();

    if (products) {
      // Convert the products object to an array if needed
      const productsArray = Object.keys(products).map(key => ({
        id: key,
        ...products[key]
      }));
      return NextResponse.json(productsArray);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
