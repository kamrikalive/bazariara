'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';

// Define the Product type for strong typing
type Product = {
  id: number; // Changed to number to match data
  title: string;
  category: string;
  price: number;
  description?: string;
  image_url?: string;
};

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('/api/products');
  if (!res.ok) {
    // Create an error object with the status text
    throw new Error(`Не удалось загрузить товары: ${res.statusText}`);
  }
  const products = await res.json();
  return products.map((product: any) => ({...product, id: parseInt(product.id, 10)}));
}

// Define a mapping for categories
const categoryMap: { [key: string]: string } = {
    'hiking': 'Товары для отдыха',
    'garden': 'Сад',
};

// Create a reverse mapping
const reverseCategoryMap: { [key: string]: string } = Object.fromEntries(
  Object.entries(categoryMap).map(([key, value]) => [value, key])
);


// Define the categories to be displayed
const displayCategories = ['Товары для отдыха', 'Сад'];

const ITEMS_PER_PAGE = 20;

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Все');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const getProductsClientSide = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await fetchProducts();
        
        // Map categories and filter out unwanted ones
        const processedProducts = products
          .map(p => ({ ...p, category: categoryMap[p.category] || p.category }))
          .filter(p => displayCategories.includes(p.category));

        setAllProducts(processedProducts);
        setFilteredProducts(processedProducts);
        
        // Get unique categories from the processed products
        const uniqueCategories = Array.from(new Set(processedProducts.map((p) => p.category)));
        setCategories(['Все', ...uniqueCategories]);

      } catch (err: any) {
        setError(err.message); // Set the error message to be displayed
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProductsClientSide();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'Все') {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(allProducts.filter(p => p.category === selectedCategory));
    }
    setCurrentPage(1); // Reset to first page on category change
  }, [selectedCategory, allProducts]);

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
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-4">
            <p className="flashing-slogan text-2xl font-bold text-lime-400">Доставим за 2 часа</p>
        </div>
        <div className="mb-12 text-center">
            <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500">
              Наши товары
            </h2>
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
            const originalCategory = reverseCategoryMap[product.category];
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
                          <p className="text-2xl font-semibold text-lime-500">₾{product.price}</p>
                      </div>
                  </Link>
                  <div className="p-5 pt-0 mt-auto">
                      <button 
                          onClick={() => addToCart(product)} // Add product to cart
                          className="w-full flex items-center justify-center px-4 py-3 font-bold rounded-lg bg-lime-500 text-gray-900 hover:bg-lime-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-500/30 hover:shadow-xl hover:shadow-lime-400/40"
                      >
                          <ShoppingCartIcon className="h-5 w-5 mr-2"/>
                          Добавить в корзину
                      </button>
                  </div>
              </div>
            )
          })}
        </div>

        <div className="mt-16 flex justify-center items-center gap-4">
            <button 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 font-semibold rounded-lg bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors duration-300"
            >
                Назад
            </button>
            <span className="text-lg font-medium text-gray-300">Страница {currentPage} из {totalPages}</span>
            <button 
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 font-semibold rounded-lg bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors duration-300"
            >
                Вперед
            </button>
        </div>

      </main>
    </div>
  );
}
