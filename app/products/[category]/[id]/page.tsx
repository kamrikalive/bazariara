'use client';

import { useState, useEffect } from 'react';
import { useCart, Product } from '@/contexts/CartContext';
import { ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { calculateDisplayPrice } from '@/lib/priceLogic';

// === Fetch product by ID and Category ===
async function getProduct(category: string, id: string): Promise<Product> {
  const res = await fetch(`/api/products/${category}/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch product data');
  }
  const product = await res.json();
  return {...product, id: parseInt(product.id, 10)};
}

export default function ProductDetailPage({ params }: { params: { category: string, id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(params.category, params.id);
        setProduct(productData);
      } catch (err) {
        setError('Не удалось загрузить товар. Пожалуйста, попробуйте еще раз позже.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.category, params.id]);

  const handleAddToCart = () => {
    if (product) {
        addToCart(product);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Загрузка...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Товар не найден.</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href={`/${params.category === 'garden' ? 'garden' : 'hiking'}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeftIcon className="h-5 w-5"/>
            Назад к товарам
          </Link>
        </div>

        <div className="bg-gray-800/40 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* === Product Image === */}
            <div className="p-4">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* === Product Info === */}
            <div className="p-8 flex flex-col justify-center">
              <div>
                <p className="text-sm text-lime-400 font-semibold mb-2">{product.category}</p>
                <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-gray-100">{product.title}</h1>
                
                <p className="text-4xl font-bold text-lime-500 mb-6">₾{calculateDisplayPrice(product.price)}</p>

                {/* === Description Field === */}
                {product.description && (
                  <div className="text-gray-300 leading-relaxed space-y-4 whitespace-pre-line">
                    {product.description.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button 
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center px-4 py-4 font-bold rounded-lg bg-lime-500 text-gray-900 hover:bg-lime-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-500/30 hover:shadow-xl hover:shadow-lime-400/40">
                  <ShoppingCartIcon className="h-6 w-6 mr-3"/>
                  Добавить в корзину
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
