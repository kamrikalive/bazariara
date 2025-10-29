
import { database } from '@/lib/firebase/server';
import ProductDetailClient from './client-page';
import { Metadata } from 'next';

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

async function getProduct(category: string, id: string): Promise<Product | null> {
  const productRef = database.ref(`products/${category}/${id}`);
  const snapshot = await productRef.once('value');

  if (snapshot.exists()) {
    const productData = snapshot.val();
    return { 
      ...productData, 
      id: parseInt(id, 10),
      categoryKey: category
    };
  } else {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { category: string, id: string } }): Promise<Metadata> {
  const product = await getProduct(params.category, params.id);

  if (!product) {
    return {
      title: 'Товар не найден',
      description: 'Запрошенный товар не существует или был удален.',
    };
  }

  return {
    title: `${product.title} - купить в Тбилиси с доставкой`,
    description: `Купите ${product.title} по выгодной цене ${product.price} ₾. Быстрая доставка по Тбилиси. Заказывайте онлайн в нашем интернет-магазине.`,
    openGraph: {
      title: `${product.title}`,
      description: `Лучшее предложение на ${product.title} в Тбилиси.`,
      images: [
        {
          url: product.image_url || '',
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
      type: 'product',
      siteName: 'Bazar Iara',
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { category: string, id: string } }) {
  const product = await getProduct(params.category, params.id);

  if (!product) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Товар не найден.</div>;
  }

  return <ProductDetailClient product={product} />;
}
