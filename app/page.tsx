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
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }
  return res.json();
}

const ITEMS_PER_PAGE = 20;

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('All');
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
        setAllProducts(products);
        setFilteredProducts(products);
        const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
        setCategories(['All', ...uniqueCategories]);
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
    if (selectedCategory === 'All') {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(allProducts.filter(p => p.category === selectedCategory));
    }
    setCurrentPage(1); // Reset to first page on category change
  }, [selectedCategory, allProducts]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-white">Loading products...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-[60vh] text-red-500">Error: {error}</div>;
  }

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <main className="p-12">
        <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Categories</h2>
            <div className="flex justify-center gap-4 flex-wrap">
                {categories.map(category => (
                    <button 
                        key={category}
                        onClick={() => setSelectedCategory(category)} 
                        className={`px-4 py-2 font-semibold rounded-lg transition-colors duration-300 ${
                            selectedCategory === category 
                            ? 'bg-lime-500 text-gray-900'
                            : 'bg-gray-700 hover:bg-lime-500 hover:text-gray-900'
                        }`}>
                        {category}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
                <Link href={`/products/${product.id}`} className="flex-grow">
                    <img src={product.image_url} alt={product.title} className="w-full h-64 object-cover" />
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
                        <p className="text-gray-400 mb-4">{product.category}</p>
                        <p className="text-lg font-semibold">₾{product.price}</p>
                    </div>
                </Link>
                <div className="p-6 pt-0">
                    <button 
                        onClick={() => addToCart(product)} // Add product to cart
                        className="w-full flex items-center justify-center px-4 py-2 font-semibold rounded-lg bg-lime-500 text-gray-900 hover:bg-lime-600 transition-colors duration-300"
                    >
                        <ShoppingCartIcon className="h-6 w-6 mr-2"/>
                        Add to Cart
                    </button>
                </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center items-center gap-4">
            <button 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 font-semibold rounded-lg bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-500 hover:text-gray-900 transition-colors duration-300"
            >
                Previous
            </button>
            <span className="text-lg">Page {currentPage} of {totalPages}</span>
            <button 
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 font-semibold rounded-lg bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-500 hover:text-gray-900 transition-colors duration-300"
            >
                Next
            </button>
        </div>

      </main>
    </div>
  );
}
