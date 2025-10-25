'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { database } from '@/lib/firebaseClient';
import { ref, get } from 'firebase/database';

type Product = {
  id: number;
  category: string;
};

async function fetchCategoriesFromFirebase(): Promise<string[]> {
  const gardenRef = ref(database, 'products/garden');
  const hikingRef = ref(database, 'products/hiking');

  const [gardenSnapshot, hikingSnapshot] = await Promise.all([
    get(gardenRef),
    get(hikingRef)
  ]);

  const gardenProducts = gardenSnapshot.exists() ? gardenSnapshot.val() : [];
  const hikingProducts = hikingSnapshot.exists() ? hikingSnapshot.val() : [];

  const allProducts: Product[] = [...gardenProducts, ...hikingProducts];
  const uniqueCategories = Array.from(new Set(allProducts.map((p) => p.category)));
  return ['Все', ...uniqueCategories];
}

export default function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
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
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
        <Bars3Icon className="h-6 w-6" />
      </button>

      <div 
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-900 bg-opacity-95 backdrop-blur-sm w-72 shadow-2xl p-6 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500">Категории</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>
        <nav>
          <ul>
            {categories.map(category => (
              <li key={category} className="mb-3">
                <Link 
                  href={category === 'Все' ? '/' : `/?category=${encodeURIComponent(category)}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-lg text-gray-300 hover:bg-lime-500/10 hover:text-lime-300 border border-transparent hover:border-lime-500/30 transition-all duration-200"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {isOpen && <div className="fixed inset-0 bg-black opacity-60 z-40" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
}
