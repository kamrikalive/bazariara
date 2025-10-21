
'use client';

import { useState, useEffect } from 'react';

// We will create an API route to securely fetch data.
async function fetchProducts() {
  const res = await fetch('/api/products');
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

const ITEMS_PER_PAGE = 20;

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getProductsClientSide = async () => {
        const products = await fetchProducts();
        setAllProducts(products);
        setFilteredProducts(products);
        const uniqueCategories = Array.from(new Set(products.map((p: any) => p.category)));
        setCategories(['All', ...uniqueCategories]);
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

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="py-12 bg-gray-800 text-center">
        <h1 className="text-5xl font-bold">MarketGE</h1>
        <p className="text-xl mt-2">Your One-Stop Shop</p>
      </header>
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
          {paginatedProducts.map((product: any) => (
            <div key={product.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img src={product.image_url} alt={product.title} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
                <p className="text-gray-400 mb-4">{product.category}</p>
                <p className="text-lg font-semibold">₾{product.price}</p>
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
