'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { database } from '@/lib/firebaseClient';
import { ref, get } from 'firebase/database';

// Иконка для категории
const CategoryIcon = () => (
  <svg className="w-5 h-5 mr-3 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
  </svg>
);

type Product = {
  category: string;
};

type CategoryInfo = {
  name: string;
  key: string; // e.g. 'sad', 'dom'
  count: number;
};

async function fetchCategoriesFromFirebase(): Promise<CategoryInfo[]> {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    const productsData = snapshot.val();

    if (!productsData) return [{ name: 'Все', key: 'all', count: 0 }];

    const categories: CategoryInfo[] = [];
    let totalProducts = 0;

    for (const categoryKey in productsData) {
        const categoryProducts = productsData[categoryKey];
        if (typeof categoryProducts === 'object' && categoryProducts !== null) {
            const productList = Object.values(categoryProducts) as Product[];
            const count = productList.length;
            totalProducts += count;
            
            if (count > 0) {
                const categoryName = productList[0].category || categoryKey;
                categories.push({ name: categoryName, key: categoryKey, count });
            }
        }
    }
    
    categories.sort((a, b) => a.name.localeCompare(b.name));

    categories.unshift({ name: 'Все', key: 'all', count: totalProducts });
    
    return categories;
}

export default function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getCategories = async () => {
      const cats = await fetchCategoriesFromFirebase();
      setCategories(cats);
    };
    getCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-10 h-10 flex flex-col justify-between items-center p-2 group z-50"
        >
            {['top', 'mid', 'bottom'].map((pos, i) => (
            <span
                key={pos}
                className={`block w-7 h-[3px] bg-lime-400 rounded-sm transition-all duration-300 ease-in-out
                    group-hover:shadow-[0_0_10px_#a3e635]
                    ${
                    isOpen
                        ? i === 0
                        ? 'rotate-45 translate-y-[8px]'
                        : i === 1
                        ? 'opacity-0'
                        : '-rotate-45 -translate-y-[8px]'
                        : ''
                    }`}
            ></span>
            ))}
        </button>

      <div 
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-900 bg-opacity-95 backdrop-blur-sm w-72 shadow-2xl p-6 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-end items-center mb-4 border-b border-gray-700 pb-2 mt-2">
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500 mb-8">Категории</h2>
        <nav>
          <ul>
            {categories.map(category => (
              <li key={category.key} className="mb-3">
                <Link 
                  href={category.key === 'all' ? '/' : `/?category=${encodeURIComponent(category.key)}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg text-lg text-gray-300 hover:bg-lime-500/10 hover:text-lime-300 border border-transparent hover:border-lime-500/30 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <CategoryIcon />
                    <span>{category.name}</span>
                  </div>
                  <span className="text-sm font-mono bg-lime-500/20 text-lime-300 rounded-full px-2 py-0.5">{category.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {isOpen && <div className="fixed inset-0 bg-black opacity-60 z-30" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
}
