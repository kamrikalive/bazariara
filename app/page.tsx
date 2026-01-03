import { Suspense } from 'react';
import HomePageContent from './page-content';
import { database } from '@/lib/firebase/server';
import type { Metadata } from 'next';
import { translations } from '@/lib/translations';

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

    // Сортировка: "new-year", "top" и "hiking" — первые
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
        // Русский
        'новогодние товары', 'новый год', 'елки', 'гирлянды', 'елочные игрушки',
        'товары для дома', 'мебель', 'мягкая мебель', 'кухонная мебель', 'детская мебель',
        'офисная мебель', 'мебель под заказ', 'шкафы', 'столы', 'стулья', 'диваны', 'кровати',
        'сад и огород', 'садовая техника', 'инструменты для сада', 'растения', 'семена', 'цветы',
        'горшки для растений', 'садовые аксессуары', 'грядки', 'удобрения', 'туризм', 'отдых',
        'пляжный отдых', 'семейный отдых', 'походы', 'кемпинг', 'палатки', 'спальные мешки',
        'туристические рюкзаки', 'туристическое снаряжение', 'игрушки', 'мягкие игрушки',
        'конструкторы', 'развивающие игрушки', 'настольные игры', 'строительные инструменты',
        'электроинструменты', 'ручные инструменты', 'инструменты для ремонта', 'дрели', 'шуруповерты',
        'газ', 'баллоны газа', 'газовое оборудование', 'термобелье', 'термос', 'дождевик',
        'доставка Тбилиси', 'онлайн заказ', 'быстрая доставка', 'доставка по Грузии', 'BAZARI ARA',
        'онлайн магазин', 'купить мебель Тбилиси', 'купить игрушки Тбилиси', 'купить инструменты Тбилиси',
        'садовый магазин Тбилиси', 'туристические товары Тбилиси', 'аксессуары для дома', 'декор для дома',
        'освещение', 'ковры', 'текстиль', 'подушки', 'занавески', 'кухонные принадлежности',
        'посуда', 'бытовая техника', 'очистка и уборка', 'интерьер',
      
        // English
        'new year goods', 'new year', 'christmas trees', 'garlands', 'christmas decorations',
        'home goods', 'furniture', 'sofa', 'kitchen furniture', 'kids furniture', 'office furniture',
        'custom furniture', 'wardrobes', 'tables', 'chairs', 'beds', 'garden and yard', 'garden tools',
        'plants', 'seeds', 'flowers', 'flower pots', 'garden accessories', 'raised beds', 'fertilizers',
        'tourism', 'vacation', 'beach vacation', 'family vacation', 'hiking', 'camping', 'tents',
        'sleeping bags', 'backpacks', 'tourist gear', 'toys', 'soft toys', 'construction toys',
        'educational toys', 'board games', 'construction tools', 'power tools', 'hand tools', 'repair tools',
        'drills', 'screwdrivers', 'gas', 'gas cylinders', 'gas equipment', 'thermal underwear', 'thermos', 'raincoat',
        'Tbilisi delivery', 'online order', 'fast delivery', 'delivery in Georgia', 'BAZARI ARA', 'online store',
        'buy furniture Tbilisi', 'buy toys Tbilisi', 'buy tools Tbilisi', 'garden store Tbilisi',
        'tourist goods Tbilisi', 'home accessories', 'home decor', 'lighting', 'carpets', 'textiles',
        'pillows', 'curtains', 'kitchen utensils', 'tableware', 'appliances', 'cleaning', 'painting supplies',
        'interior design'
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
          url: 'pre.png',
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
      images: ['pre.png'],
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
            {translations.ru.home.loading}
          </div>
        }
      >
        <HomePageContent products={products} />
      </Suspense>
    </>
  );
}
