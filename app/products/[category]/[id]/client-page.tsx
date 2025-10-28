'use client';

import { useCart } from '@/contexts/CartContext';
import { ShoppingCartIcon, ArrowLeftIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { calculateDisplayPrice } from '@/lib/priceLogic';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useState, useEffect } from 'react';

type Product = {
    id: number;
    title: string;
    category: string;
    price: number;
    in_stock: boolean;
    description?: string;
    image_url?: string;
    categoryKey: string;
    image_urls?: string[];
    links?: string[];
    sub_category?: string;
    subCategoryKey?: string;
};

async function fetchProduct(category: string, id: string): Promise<Product | null> {
    try {
        const response = await fetch(`/api/products/${category}/${id}`);
        if (!response.ok) {
            return null;
        }
        return response.json();
    } catch (error) {
        console.error('Failed to fetch related product', error);
        return null;
    }
}

function RelatedProductCard({ category, id }: { category: string; id: string }) {
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProduct(category, id).then(setProduct);
    }, [category, id]);

    if (!product) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-md p-4 text-center">
                <div className="w-full h-32 bg-gray-700 animate-pulse rounded-lg mb-4"></div>
                <div className="w-3/4 h-4 bg-gray-700 animate-pulse rounded-md mx-auto"></div>
            </div>
        );
    }

    return (
        <Link href={`/products/${product.categoryKey}/${product.id}`} className="block bg-gray-800 rounded-lg shadow-md hover:shadow-lime-500/20 transition-shadow duration-300">
            <img src={product.image_url} alt={product.title} className="w-full h-32 object-cover rounded-t-lg" />
            <div className="p-4">
                <h4 className="font-bold text-md truncate text-white">{product.title}</h4>
                <p className="text-lime-400 font-semibold">{calculateDisplayPrice(product.price)} ₾</p>
            </div>
        </Link>
    );
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();
  const cartItem = cartItems.find(item => item.id === product.id);
  const [mainImage, setMainImage] = useState(product.image_url);
  const [inputValue, setInputValue] = useState<string | number>('');

  useEffect(() => {
    if (cartItem) {
        setInputValue(cartItem.quantity);
    }
  }, [cartItem]);

  const allImages = [product.image_url, ...(product.image_urls || [])].filter(Boolean) as string[];

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      const newQuantity = cartItem.quantity + 1;
      setInputValue(newQuantity);
      updateQuantity(cartItem.id, newQuantity);
    }
  };

  const handleDecreaseQuantity = () => {
    if (cartItem) {
        if (cartItem.quantity > 1) {
            const newQuantity = cartItem.quantity - 1;
            setInputValue(newQuantity);
            updateQuantity(cartItem.id, newQuantity);
        } else {
            removeFromCart(cartItem.id);
        }
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    if (cartItem) {
        const newQuantity = parseInt(inputValue.toString(), 10);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            updateQuantity(cartItem.id, newQuantity);
        } else {
            // If input is invalid or empty, reset to original quantity
            setInputValue(cartItem.quantity);
        }
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeftIcon className="h-5 w-5"/>
            Назад к товарам
          </button>
        </div>

        <div className="bg-gray-800/40 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* === Product Image Gallery === */}
            <div className="p-4">
              <img
                src={mainImage}
                alt={product.title}
                className="w-full h-[400px] object-cover rounded-lg shadow-lg mb-4"
              />
              {allImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {allImages.map((url, index) => (
                    <button key={index} onClick={() => setMainImage(url)} className={`rounded-lg overflow-hidden border-2 ${mainImage === url ? 'border-lime-500' : 'border-transparent'}`}>
                      <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* === Product Info === */}
            <div className="p-8 flex flex-col justify-center">
              <div>
                <p className="text-sm text-lime-400 font-semibold mb-2">{product.category}{product.sub_category && ` / ${product.sub_category}`}</p>
                <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-gray-100">{product.title}</h1>
                
                <div className="flex justify-between items-center mb-6">
                    <p className="text-4xl font-bold text-lime-500">{calculateDisplayPrice(product.price)} ₾</p>
                    {product.in_stock && <span className="text-sm font-semibold text-green-400 bg-green-900/50 rounded-full px-3 py-1">В наличии</span>}
                </div>

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
                            <button onClick={handleDecreaseQuantity} className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"><MinusIcon className="h-5 w-5" /></button>
                            <input
                                type="number"
                                value={inputValue}
                                onChange={handleQuantityChange}
                                onBlur={handleBlur}
                                className="text-xl font-bold w-12 text-center bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-lime-500 rounded-md"
                                min="1"
                            />
                            <button onClick={handleIncreaseQuantity} className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"><PlusIcon className="h-5 w-5" /></button>
                        </div>
                    </div>
                ) : (
                    <button onClick={handleAddToCart} className="w-full flex items-center justify-center px-4 py-4 font-bold rounded-lg bg-lime-500 text-gray-900 hover:bg-lime-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-500/30 hover:shadow-xl hover:shadow-lime-400/40"><ShoppingCartIcon className="h-6 w-6 mr-3"/>Добавить в корзину</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* === Related Products === */}
        {product.links && product.links.length > 0 && (
            <div className="mt-2">
                <h3 className="text-2xl font-bold mb-2 text-white">С этим покупают:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {product.links.map((link, index) => {
                        try {
                            const url = new URL(link);
                            const pathnameParts = url.pathname.split('/');
                            if (pathnameParts.length >= 4) {
                                const category = pathnameParts[2];
                                const id = pathnameParts[3];
                                return <RelatedProductCard key={index} category={category} id={id} />
                            }
                        } catch (error) {
                            console.error("Invalid URL in product links", link, error);
                        }
                        return null;
                    })}
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
