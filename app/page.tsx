
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
  categoryKey: string;
  image_urls?: string[];
  links?: string[];
  sub_category?: string;
  subCategoryKey?: string;
};

async function fetchProductsFromFirebase(): Promise<Product[]> {
  const productsRef = database.ref('products');
  const snapshot = await productsRef.once('value');
  const categoriesData = snapshot.val() || {};

  const allProducts: Product[] = [];

  const generateKey = (name: string) => {
    if (!name) return '';
    // Simplified key generation that handles Cyrillic characters
    return name.trim().toLowerCase().replace(/\s+/g, '-');
  };

  Object.keys(categoriesData).forEach(categoryKey => {
    const productsInCategory = categoriesData[categoryKey];
    if (productsInCategory && typeof productsInCategory === 'object') {
      Object.keys(productsInCategory).forEach(productId => {
        const productData = productsInCategory[productId];
        if (productData && typeof productData === 'object' && productData.title) {
          const newProduct: Product = {
            ...productData,
            id: parseInt(productId, 10),
            categoryKey: categoryKey,
          };

          if (productData.sub_category) {
            newProduct.subCategoryKey = generateKey(productData.sub_category);
          }
          
          allProducts.push(newProduct);
        }
      });
    }
  });

  // Sort products to show 'top' category first
  allProducts.sort((a, b) => {
    if (a.categoryKey === 'top' && b.categoryKey !== 'top') {
      return -1; // a comes first
    }
    if (a.categoryKey !== 'top' && b.categoryKey === 'top') {
      return 1; // b comes first
    }
    return 0; // maintain original order for other categories
  });

  return allProducts;
}


export const metadata: Metadata = {
    title: 'Онлайн-магазин для сада и отдыха',
    description: 'Лучшие товары для сада и отдыха с доставкой за 2 часа. Широкий ассортимент, высокое качество и быстрая доставка по всему городу. Заказывайте онлайн!',
    openGraph: {
        title: 'Онлайн-магазин для сада и отдыха',
        description: 'Быстрая доставка за 2 часа.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Онлайн-магазин для сада и отдыха',
            },
        ],
    },
};

export default async function HomePage() {
  const products = await fetchProductsFromFirebase();
  
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-white">Загрузка главной страницы...</div>}>
      <HomePageContent products={products} />
    </Suspense>
  );
}
