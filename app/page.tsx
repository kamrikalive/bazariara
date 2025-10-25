
import { Suspense } from 'react';
import HomePageContent from './page-content';
import { database } from '@/lib/firebase/server';
import { ref, get } from 'firebase/database';

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
  const gardenRef = ref(database, 'products/garden');
  const hikingRef = ref(database, 'products/hiking');

  const [gardenSnapshot, hikingSnapshot] = await Promise.all([
    get(gardenRef),
    get(hikingRef)
  ]);

  const gardenProducts = gardenSnapshot.exists() ? gardenSnapshot.val() : [];
  const hikingProducts = hikingSnapshot.exists() ? hikingSnapshot.val() : [];

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
