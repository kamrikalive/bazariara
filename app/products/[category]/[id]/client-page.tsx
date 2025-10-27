'use client';

import { useCart } from '@/contexts/CartContext';
import { ShoppingCartIcon, ArrowLeftIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { calculateDisplayPrice } from '@/lib/priceLogic';
import { useSearchParams } from 'next/navigation';

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

export default function ProductDetailClient({ product }: { product: Product }) {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const cartItem = cartItems.find(item => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
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

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href={`/?category=${product.category}&page=${page}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
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
                        <p className="text-lg font-semibold">В корсине:</p>
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
