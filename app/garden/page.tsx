import ProductCard from '@/components/ProductCard';
import { db } from '@/lib/firebase';

interface Product {
  id: string;
  image_url: string;
  title: string;
  category: string;
  description: string;
  price: number;
}

async function getGardenProducts(): Promise<Product[]> {
  const snapshot = await db.collection('garden').get();
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  return products;
}

export default async function GardenPage() {
  const products = await getGardenProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Садовые товары</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
