import { db } from '@/lib/firebase';

interface Product {
  id: string;
  title: string;
  description?: string; // Make description optional
  price: number;
  category: string;
  image_url: string;
}

async function getProduct(id: string): Promise<Product | null> {
  const collections = ['garden', 'hiking', 'leisure'];
  for (const collectionName of collections) {
    const doc = await db.collection(collectionName).doc(id).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() } as Product;
    }
  }
  return null;
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-[400px] overflow-hidden rounded-lg">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.title}
            width={600}
            height={600}
            className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">{product.description || 'Описание отсутствует.'}</p>
          <div className="flex items-center justify-between mb-6">
            <p className="text-3xl font-bold">${product.price}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Category:</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-500">
                {product.category}
              </span>
            </div>
          </div>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 w-full">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
