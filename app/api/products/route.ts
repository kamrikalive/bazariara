
import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const apps = getApps();
if (!apps.length) {
  try {
    initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string))
    });
  } catch (e) {
    console.error("Firebase initialization error", e);
  }
}

const db = getFirestore();

export async function GET() {
  const gardenSnapshot = await db.collection('garden').get();
  const gardenProducts = gardenSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  const hikingSnapshot = await db.collection('hiking').get();
  const hikingProducts = hikingSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  const allProducts = [...gardenProducts, ...hikingProducts];

  return NextResponse.json(allProducts);
}
