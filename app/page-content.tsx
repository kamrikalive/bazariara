'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCartIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import { calculateDisplayPrice } from '@/lib/priceLogic';
import { database } from '@/lib/firebaseClient';
import { ref, get } from 'firebase/database';
import { useSearchParams } from 'next/navigation';

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  in_stock: boolean;
  description?: string;
  image_url?: string;
};

async function fetchProductsFromFirebase(): Promise<Product[]> {
  const gardenRef = ref(database, 'products/garden');
  const hikingRef = ref(database, 'products/hiking');

  const [gardenSnapshot, hikingSnapshot] = await Promise.all([
    get(gardenRef),
    get(hikingRef)
  ]);

  const gardenProducts = gardenSnapshot.exists() ? gardenSnapshot.val() : [];
  const hikingProducts = hikingSnapshot.exists() ? hikingSnapshot.val() : [];

  return [...gardenProducts, ...hikingProducts];
}

const ITEMS_PER_PAGE = 20;

export default function HomePageContent() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Все');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get('category');
    setSelectedCategory(category || 'Все');
  }, [searchParams]);

  useEffect(() => {
    const getProductsClientSide = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await fetchProductsFromFirebase();
        
        const sortedProducts = products.sort((a, b) => {
            if (a.in_stock && !b.in_stock) return -1;
            if (!a.in_stock && b.in_stock) return 1;
            return 0;
        });
        
        setAllProducts(sortedProducts);

        const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
        setCategories(['Все', ...uniqueCategories]);

      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProductsClientSide();
  }, []);

  useEffect(() => {
    let products = allProducts;

    if (selectedCategory && selectedCategory !== 'Все') {
      products = products.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      products = products.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(products);
    setCurrentPage(1);
  }, [selectedCategory, allProducts, searchQuery]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-white">Загрузка товаров...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-[60vh] text-red-500">Ошибка: {error}</div>;
  }

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <main className="container mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="text-center py-4">
            <p className="flashing-slogan text-2xl font-bold text-lime-400">Доставим за 2 часа</p>
        </div>
        <div className="mb-12 text-center">
            <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500">
              {selectedCategory === 'Все' ? 'Все товары' : selectedCategory}
            </h2>
            <div className="mb-8 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Поиск по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
                {categories.map(category => (
                    <button 
                        key={category}
                        onClick={() => setSelectedCategory(category)} 
                        className={`px-5 py-2 font-medium rounded-full text-sm transition-all duration-300 ease-in-out ${
                            selectedCategory === category 
                            ? 'bg-lime-500 text-gray-900 shadow-lg shadow-lime-500/30'
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}>
                        {category}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {paginatedProducts.map((product) => {
            const originalCategory = product.category === 'Сад' ? 'garden' : 'hiking';
            const cartItem = cartItems.find(item => item.id === product.id);

            const handleAddToCart = () => {
                addToCart(product);
            };

            const handleIncreaseQuantity = () => {
                if(cartItem) {
                    updateQuantity(cartItem.id, cartItem.quantity + 1);
                }
            };

            const handleDecreaseQuantity = () => {
                if(cartItem) {
                    if (cartItem.quantity > 1) {
                        updateQuantity(cartItem.id, cartItem.quantity - 1);
                    } else {
                        removeFromCart(cartItem.id);
                    }
                }
            };

            return (
              <div 
                key={product.id} 
                className="bg-gray-800/40 rounded-xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:shadow-lime-500/20"
              >
                  <Link href={`/products/${originalCategory}/${product.id}`} className="flex-grow">
                      <div className="overflow-hidden">
                        <img 
                          src={product.image_url} 
                          alt={product.title} 
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                        />
                      </div>
                      <div className="p-5">
                          <h2 className="text-xl font-bold mb-2 truncate group-hover:text-lime-400 transition-colors duration-300">{product.title}</h2>
                          <p className="text-gray-400 text-sm mb-3">{product.category}</p>
                           <div className="flex justify-between items-center">
                              <p className="text-2xl font-semibold text-lime-500">₾{calculateDisplayPrice(product.price)}</p>
                              {product.in_stock && <span className="text-sm font-semibold text-green-400 bg-green-900/50 rounded-full px-3 py-1">В наличии</span>}
                          </div>
                      </div>
                  </Link>
                  <div className="p-5 pt-0 mt-auto">
                      {cartItem ? (
                        <div className="flex items-center justify-center gap-2">
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
                      ) : (
                        <button 
                            onClick={handleAddToCart} 
                            className="w-full flex items-center justify-center px-4 py-3 font-bold rounded-lg bg-lime-500 text-gray-900 hover:bg-lime-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-500/30 hover:shadow-xl hover:shadow-lime-400/40"
                        >
                            <ShoppingCartIcon className="h-5 w-5 mr-2"/>
                            Добавить в корзину
                        </button>
                      )}
                  </div>
              </div>
            )
          })}
        </div>

        {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-4">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-3 rounded-full bg-lime-500 text-gray-900 font-bold hover:bg-lime-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-500/30 disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
                >
                    <ChevronLeftIcon className="h-6 w-6" />
                </button>

                <span className="text-lg font-semibold text-white bg-gray-800/80 rounded-full px-5 py-2 shadow-inner">Страница {currentPage} из {totalPages}</span>

                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-full bg-lime-500 text-gray-900 font-bold hover:bg-lime-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-500/30 disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
                >
                    <ChevronRightIcon className="h-6 w-6" />
                </button>
            </div>
        )}

      </main>
    </div>
  );
}
