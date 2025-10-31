import { Suspense } from 'react';
import HomePageContent from './page-content';
import { database } from '@/lib/firebase/server';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 🔁 обновление данных каждые 60 секунд

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

// === 🔹 Получение данных из Firebase ===
async function fetchProductsFromFirebase(): Promise<Product[]> {
  try {
    const productsRef = database.ref('products');
    const snapshot = await productsRef.once('value');
    const categoriesData = snapshot.val() || {};

    const allProducts: Product[] = [];

    const generateKey = (name: string) => {
      if (!name) return '';
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

    // Сортировка: категория "top" — первая
    allProducts.sort((a, b) => {
      if (a.categoryKey === 'top' && b.categoryKey !== 'top') return -1;
      if (a.categoryKey !== 'top' && b.categoryKey === 'top') return 1;
      return 0;
    });

    return allProducts;
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    return [];
  }
}

// === 🔹 SEO, Facebook (Open Graph) и Twitter ===
export const metadata: Metadata = {
  metadataBase: new URL('https://bazariara.ge'),
  title: 'BAZARIara: Товары для дома, сада, туризма и отдыха',
  description:
    'Широкий ассортимент товаров: мебель, инструменты, игрушки, всё для сада, дома и активного отдыха. Быстрая доставка по Тбилиси за 2 часа!',
  keywords: [
    'товары для дома',
    'сад и огород',
    'туризм',
    'отдых',
    'мебель',
    'инструменты',
    'игрушки',
    'доставка Тбилиси',
    'BAZARI ARA',
  ],
  alternates: {
    canonical: 'https://bazariara.ge',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://bazariara.ge',
    siteName: 'BAZARI ARA',
    title: 'BAZARI ARA: Всё для дома, сада, туризма и отдыха',
    description: 'Быстрая доставка по Тбилиси за 2 часа. Всё для комфорта дома и активного отдыха!',
    images: [
      {
        url: 'https://i.ibb.co/nMkbLTfC/IMG-4573.png',
        width: 1200,
        height: 630,
        alt: 'BAZARI ARA — интернет-магазин товаров для дома, сада и отдыха',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BAZARI ARA — всё для дома и отдыха',
    description: 'Мебель, инструменты, туризм, сад и огород. Быстрая доставка по Тбилиси!',
    images: ['https://i.ibb.co/nMkbLTfC/IMG-4573.png'],
  },
  other: {
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': 'BAZARI ARA — интернет-магазин товаров для дома, сада и отдыха',
    'og:locale:alternate': 'en_US',
    'fb:app_id': '1234567890', // 🔸 можно добавить свой ID Facebook App, если есть
  },
};

// === 🔹 Главная страница ===
export default async function HomePage() {
  const products = await fetchProductsFromFirebase();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh] text-white">
          Загрузка главной страницы...
        </div>
      }
    >
      <HomePageContent products={products} />
    </Suspense>
  );
}
