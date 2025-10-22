
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebaseAdmin';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    let product;
    let docRef;

    // Check in 'hiking' collection
    docRef = db.collection('hiking').doc(id);
    let doc = await docRef.get();
    if (doc.exists) {
      product = { id: doc.id, ...doc.data() };
    }

    // If not found, check in 'garden' collection
    if (!product) {
      docRef = db.collection('garden').doc(id);
      doc = await docRef.get();
      if (doc.exists) {
        product = { id: doc.id, ...doc.data() };
      }
    }

    if (product) {
      return NextResponse.json(product);
    } else {
      return new NextResponse(`Product with ID ${id} not found`, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching product from Firestore:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
