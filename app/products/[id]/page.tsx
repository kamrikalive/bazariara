'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';

// Define the Product type for strong typing
type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  description?: string;
  image_url?: string;
};

// === Fetch product by ID ===
async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch product data');
  }
  return res.json();
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

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
      <main className="p-12">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden md:flex">
          {/* === Product Image === */}
          <div className="md:w-1/2">
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* === Product Info === */}
          <div className="p-8 md:w-1/2 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              <p className="text-gray-400 mb-4 text-lg">{product.category}</p>
              <p className="text-2xl font-semibold mb-4">₾{product.price}</p>

              {/* === Description Field === */}
              {product.description && (
                <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              )}
            </div>

            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-lime-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-lime-600 transition-colors duration-300 flex items-center justify-center">
              <ShoppingCartIcon className="h-6 w-6 mr-2"/>
              Add to Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
