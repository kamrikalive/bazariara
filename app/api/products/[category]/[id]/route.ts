
import { database } from '@/lib/firebase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { category: string; id: string } }
) {
  try {
    const { category, id } = params;
    if (!category || !id) {
      return NextResponse.json({ message: 'Category and ID are required' }, { status: 400 });
    }

    const productRef = database.ref(`products/${category}/${id}`);
    const snapshot = await productRef.once('value');

    if (!snapshot.exists()) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const productData = snapshot.val();
    const product = {
      ...productData,
      id: parseInt(id, 10),
      categoryKey: category,
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
