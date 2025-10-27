
import { database } from '@/lib/firebase/server';
import ProductDetailClient from './client-page';

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  in_stock: boolean;
  description?: string;
  image_url?: string;
  categoryKey: string;
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

export default async function ProductDetailPage({ params }: { params: { category: string, id: string } }) {
  const product = await getProduct(params.category, params.id);

  if (!product) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Товар не найден.</div>;
  }

  return <ProductDetailClient product={product} />;
}
