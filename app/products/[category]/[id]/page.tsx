import { database } from '@/lib/firebase/server';
import ProductDetailClient from './client-page';
import { Metadata } from 'next';

// === 🔸 Тип товара ===
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
};

// === 🔸 Получение товара из Firebase ===
async function getProduct(category: string, id: string): Promise<Product | null> {
  try {
    const productRef = database.ref(`products/${category}/${id}`);
    const snapshot = await productRef.once('value');
    if (!snapshot.exists()) return null;

    const productData = snapshot.val();
    return {
      ...productData,
      id: parseInt(id, 10),
      categoryKey: category,
    };
  } catch (err) {
    console.error('Ошибка при получении товара:', err);
    return null;
  }
}

// === 🔸 Мета-данные для SEO, Facebook и Twitter ===
export async function generateMetadata({ params }: { params: { category: string; id: string } }): Promise<Metadata> {
  const product = await getProduct(params.category, params.id);

  if (!product) {
    return {
      title: 'Товар не найден — BazarIara',
      description: 'Запрошенный товар не существует или был удалён.',
      openGraph: {
        title: 'Товар не найден',
        description: 'Запрошенный товар не существует или был удалён.',
      },
    };
  }

  const title = `${product.title} — купить в Тбилиси с доставкой | BazarIara`;
  const description = product.description
    ? `${product.description} Быстрая доставка по Тбилиси. Цена: ${product.price} ₾.`
    : `Купите ${product.title} по выгодной цене ${product.price} ₾ с быстрой доставкой по Тбилиси.`;
  const image = product.image_url || '/default-product.png';
  const url = `https://bazariara.ge/${product.categoryKey}/${product.id}`;

  return {
    metadataBase: new URL('https://bazariara.ge'),
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'product',
      locale: 'ru_RU',
      url,
      siteName: 'BazarIara',
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    other: {
      'og:price:amount': product.price.toString(),
      'og:price:currency': 'GEL',
      'product:availability': product.in_stock ? 'in stock' : 'out of stock',
    },
  };
}

// === 🔸 Компонент страницы ===
export default async function ProductDetailPage({ params }: { params: { category: string; id: string } }) {
  const product = await getProduct(params.category, params.id);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Товар не найден.
      </div>
    );
  }

  // === Добавляем JSON-LD (структурированные данные) для Google ===
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: product.image_url,
    description: product.description || '',
    sku: product.id.toString(),
    category: product.category,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'GEL',
      price: product.price,
      availability: product.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://bazariara.ge/${product.categoryKey}/${product.id}`,
      seller: {
        '@type': 'Organization',
        name: 'BazarIara',
      },
    },
  };

  return (
    <>
      {/* Структурированные данные для Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
