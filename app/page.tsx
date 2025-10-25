
import { Suspense } from 'react';
import HomePageContent from './page-content';
import { database } from '@/lib/firebase/server';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  in_stock: boolean;
  description?: string;
  image_url?: string;
};

async function fetchProductsFromFirebase(): Promise<Product[]> {
  const gardenRef = database.ref('products/garden');
  const hikingRef = database.ref('products/hiking');

  const [gardenSnapshot, hikingSnapshot] = await Promise.all([
    gardenRef.once('value'),
    hikingRef.once('value')
  ]);

  const gardenData = gardenSnapshot.val() || {};
  const hikingData = hikingSnapshot.val() || {};

  const gardenProducts: Product[] = Object.keys(gardenData).map(key => ({ ...gardenData[key], id: parseInt(key, 10) }));
  const hikingProducts: Product[] = Object.keys(hikingData).map(key => ({ ...hikingData[key], id: parseInt(key, 10) }));

  return [...gardenProducts, ...hikingProducts];
}


export default async function HomePage() {
  const products = await fetchProductsFromFirebase();
  
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-white">Загрузка главной страницы...</div>}>
      <HomePageContent products={products} />
    </Suspense>
  );
}
