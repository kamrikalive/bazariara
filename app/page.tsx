import { Suspense } from 'react';
import HomePageContent from './page-content';
import { database } from '@/lib/firebase/server';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 🔁 обновление данных каждые 60 секунд

type Product = {
  id: string;
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
        Object.keys(productsInCategory).forEach(firebaseDocumentKey => {
          const productData = productsInCategory[firebaseDocumentKey];
          if (productData && typeof productData === 'object' && productData.title) {
            const newProduct: Product = {
              ...productData,
              id: firebaseDocumentKey, // ← Сохраняем оригинальный Firebase ключ
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

    // Сортировка: "top" и "hiking" — первые
    allProducts.sort((a, b) => {
      const order: Record<string, number> = { top: 1, hiking: 2 };
      const aOrder = order[a.categoryKey] || 3;
      const bOrder = order[b.categoryKey] || 3;
      return aOrder - bOrder;
    });

    return allProducts;
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    return [];
  }
}

// === 🔹 SEO, Facebook (Open Graph) и Twitter ===
export async function generateMetadata({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> {
  const category = searchParams.category;
  const baseUrl = 'https://bazariara.ge';
  const canonicalUrl = category ? `${baseUrl}/?category=${category}` : baseUrl;

  return {
    metadataBase: new URL(baseUrl),
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
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url: canonicalUrl,
      siteName: 'BAZARI ARA',
      title: 'BAZARI ARA: Всё для дома, сада, туризма и отдыха',
      description: 'Быстрая доставка по Тбилиси за 2 часа. Всё для комфорта дома и активного отдыха!',
      images: [
        {
          url: 'https://i.ibb.co/Rkpg2k2d/Chat-GPT-Image-29-2025-14-40-32.png',
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
      images: ['https://i.ibb.co/Rkpg2k2d/Chat-GPT-Image-29-2025-14-40-32.png'],
    },
    other: {
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': 'BAZARI ARA — интернет-магазин товаров для дома, сада и отдыха',
      'og:locale:alternate': 'ru_RU',
      'fb:app_id': '1234567890', // 🔸 можно добавить свой ID Facebook App, если есть
    },
  };
}


// === 🔹 Главная страница ===
export default async function HomePage() {
  const products = await fetchProductsFromFirebase();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        url: 'https://bazariara.ge',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://bazariara.ge/?search={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        name: 'BAZARIara',
        url: 'https://bazariara.ge',
        logo: 'https://i.ibb.co/Rkpg2k2d/Chat-GPT-Image-29-2025-14-40-32.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+995591017945',
          contactType: 'customer service',
        },
      },
      {
        '@type': 'ItemList',
        itemListElement: products.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: product.title,
            description: product.description || product.title,
            image: product.image_url,
            sku: product.id,
            mpn: product.id,
            brand: {
              '@type': 'Brand',
              name: product.category,
            },
            offers: {
              '@type': 'Offer',
              url: `https://bazariara.ge/products/${product.categoryKey}/${product.id}`,
              priceCurrency: 'GEL',
              price: product.price,
              availability: product.in_stock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              seller: {
                '@type': 'Organization',
                name: 'BAZARIara',
              },
            },
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh] text-white">
            Загрузка главной страницы...
          </div>
        }
      >
        <HomePageContent products={products} />
      </Suspense>
    </>
  );
}