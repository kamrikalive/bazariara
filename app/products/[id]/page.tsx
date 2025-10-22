
'use client';

import { useState, useEffect } from 'react';

// This function will fetch the data for a single product.
async function getProduct(id: string) {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch product data');
  }
  return res.json();
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(params.id);
        setProduct(productData);
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Product not found.</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="py-12 bg-gray-800 text-center">
        <a href="/" className="text-5xl font-bold">MarketGE</a>
        <p className="text-xl mt-2">Your One-Stop Shop</p>
      </header>
      <main className="p-12">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden md:flex">
          <div className="md:w-1/2">
              <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-8 md:w-1/2">
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
            <p className="text-gray-400 mb-6 text-lg">{product.category}</p>
            <p className="text-2xl font-semibold mb-6">₾{product.price}</p>
            <button className="w-full bg-lime-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-lime-600 transition-colors duration-300">
              Add to Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
