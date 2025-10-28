import { MetadataRoute } from 'next';
import { database } from '@/lib/firebase/server'; // Using the alias defined in tsconfig.json

const URL = 'https://bazariara.ge';

type Product = {
  id: number;
  categoryKey: string;
  in_stock: boolean;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productsRef = database.ref('products');
  let products: Product[] = [];

  try {
    const snapshot = await productsRef.once('value');
    if (snapshot.exists()) {
      const allProducts = snapshot.val();
      // Firebase returns an object, we convert it to an array, filter, and assert the type.
      products = Object.values(allProducts).filter(
        (product: any) => product.in_stock
      ) as Product[];
    } else {
      console.log("No products found for sitemap.");
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return []; // Return empty sitemap on error
  }

  const productEntries: MetadataRoute.Sitemap = products.map(({ id, categoryKey }) => ({
    url: `${URL}/products/${categoryKey}/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
        url: `${URL}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
    },
    ...productEntries,
  ];
}
