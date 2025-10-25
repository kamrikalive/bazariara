'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCartIcon, ArrowLeftIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { calculateDisplayPrice } from '@/lib/priceLogic';
import { database } from '@/lib/firebaseClient';
import { ref, get } from 'firebase/database';

// Define the Product type locally
type Product = {
    id: number;
    title: string;
    category: string;
    price: number;
    in_stock: boolean;
    description?: string;
    image_url?: string;
};

// === Fetch product by ID and Category from Firebase ===
async function getProduct(category: string, id: string): Promise<Product | null> {
  // Reference to the specific category array in Firebase
  const productsRef = ref(database, `products/${category}`);
  const snapshot = await get(productsRef);

  if (snapshot.exists()) {
    const productsArray: Product[] = snapshot.val();
    const numericId = parseInt(id, 10);

    // Find the product in the array by its ID
    const product = productsArray.find(p => p.id === numericId);
    
    return product || null;
  } else {
    return null;
  }
}

export default function ProductDetailPage({ params }: { params: { category: string, id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
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

  const cartItem = product ? cartItems.find(item => item.id === product.id) : undefined;

  const handleAddToCart = () => {
    if (product) {
        addToCart(product);
    }
  };

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (cartItem) {
        if (cartItem.quantity > 1) {
            updateQuantity(cartItem.id, cartItem.quantity - 1);
        } else {
            removeFromCart(cartItem.id);
        }
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
          <Link href={`/`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
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
                
                <div className="flex justify-between items-center mb-6">
                    <p className="text-4xl font-bold text-lime-500">{calculateDisplayPrice(product.price)} ₾</p>
                    {product.in_stock && <span className="text-sm font-semibold text-green-400 bg-green-900/50 rounded-full px-3 py-1">В наличии</span>}
                </div>

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
                {cartItem ? (
                    <div className="flex items-center gap-4">
                        <p className="text-lg font-semibold">В корзине:</p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDecreaseQuantity}
                                className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                            >
                                <MinusIcon className="h-5 w-5" />
                            </button>
                            <span className="text-xl font-bold w-12 text-center">{cartItem.quantity}</span>
                            <button
                                onClick={handleIncreaseQuantity}
                                className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                            >
                                <PlusIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button 
                      onClick={handleAddToCart}
                      className="w-full flex items-center justify-center px-4 py-4 font-bold rounded-lg bg-lime-500 text-gray-900 hover:bg-lime-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-500/30 hover:shadow-xl hover:shadow-lime-400/40">
                      <ShoppingCartIcon className="h-6 w-6 mr-3"/>
                      Добавить в корзину
                    </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


