import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabaseClient';

const URL = 'https://bazariara.ge';

type Product = {
  id: number;
  categoryKey: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all products to generate dynamic routes
  const { data: products, error } = await supabase
    .from('products')
    .select('id, categoryKey')
    .eq('in_stock', true)
    .order('id');

  if (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }

  const productEntries: MetadataRoute.Sitemap = products ? products.map(({ id, categoryKey }) => ({
    url: `${URL}/products/${categoryKey}/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  })) : [];

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
