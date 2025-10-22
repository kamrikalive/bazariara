
import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { category: string, id: string } }) {
  try {
    const { category, id } = params;
    
    const docRef = db.collection(category).doc(id);
    const doc = await docRef.get();

    if (doc.exists) {
      const product = { id: doc.id, ...doc.data() };
      return NextResponse.json(product);
    } else {
      return new NextResponse(`Product with ID ${id} in category ${category} not found`, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching product from Firestore:', error);
    // Check if the error is due to invalid category
    if (error instanceof Error && error.message.includes('Invalid collection id')) {
        return new NextResponse(`Invalid category: ${params.category}`, { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
