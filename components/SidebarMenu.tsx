'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { database } from '@/lib/firebaseClient';
import { ref, get } from 'firebase/database';
import { useLanguage } from '@/contexts/LanguageContext';

// Иконка для категории
const CategoryIcon = () => (
  <svg className="w-5 h-5 mr-3 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
  </svg>
);

// Утилита для генерации ключа, аналогичная той, что в page.tsx
const generateKey = (name: string) => {
  if (!name) return '';
  return name.trim().toLowerCase().replace(/\s+/g, '-');
};

type Product = {
  category: string;
  sub_category?: string;
};

type SubCategoryInfo = {
    name: string;
    key: string; // ключ для URL, в нижнем регистре
    count: number;
};

type CategoryInfo = {
  name: string;
  key: string;
  count: number;
  subCategories: SubCategoryInfo[];
};

async function fetchCategoriesFromFirebase(): Promise<CategoryInfo[]> {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    const productsData = snapshot.val();

    if (!productsData) return [{ name: '', key: 'all', count: 0, subCategories: [] }];

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
                const subCategoryCounts: { [name: string]: number } = {};

                productList.forEach(product => {
                    if (product.sub_category) {
                        subCategoryCounts[product.sub_category] = (subCategoryCounts[product.sub_category] || 0) + 1;
                    }
                });

                const subCategories: SubCategoryInfo[] = Object.entries(subCategoryCounts)
                    .map(([name, count]) => ({
                        name, // Оригинальное имя для отображения ("Стулья")
                        count,
                        key: generateKey(name), // Ключ для URL ("стулья")
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name));

                categories.push({ name: categoryName, key: categoryKey, count, subCategories });
            }
        }
    }
    
    categories.sort((a, b) => a.name.localeCompare(b.name));
    categories.unshift({ name: '', key: 'all', count: totalProducts, subCategories: [] });
    
    return categories;
}

export default function SidebarMenu() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
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
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCategoryToggle = (categoryKey: string) => {
    setOpenCategory(openCategory === categoryKey ? null : categoryKey);
  };

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
        className={`fixed top-0 left-0 h-full bg-gray-900 bg-opacity-95 backdrop-blur-sm w-72 shadow-2xl p-6 z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-end items-center mb-4 border-b border-gray-700 pb-2 mt-2">
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500 mb-8">{t('common.categories')}</h2>
        <nav>
          <ul>
            {categories.map(category => (
              <li key={category.key} className="mb-2">
                <div className="flex flex-col">
                    <div 
                        className="flex items-center justify-between px-4 py-3 rounded-lg text-lg text-gray-300 hover:bg-lime-500/10 hover:text-lime-300 border border-transparent hover:border-lime-500/30 transition-all duration-200 cursor-pointer"
                        onClick={() => category.subCategories.length > 0 ? handleCategoryToggle(category.key) : setIsOpen(false)}
                    >
                        <Link 
                            href={category.key === 'all' ? '/' : `/?category=${encodeURIComponent(category.key)}`}
                            onClick={(e) => { if (category.subCategories.length > 0) e.preventDefault(); }}
                            className="flex items-center flex-grow"
                        > 
                            <CategoryIcon />
                            <span>{category.key === 'all' ? t('common.all') : category.name}</span>
                        </Link>
                        <div className="flex items-center">
                            <span className="text-sm font-mono bg-lime-500/20 text-lime-300 rounded-full px-2 py-0.5">{category.count}</span>
                            {category.subCategories.length > 0 && (
                                <ChevronDownIcon className={`w-5 h-5 ml-2 transition-transform duration-300 ${openCategory === category.key ? 'rotate-180' : ''}`} />
                            )}
                        </div>
                    </div>

                    {category.subCategories.length > 0 && openCategory === category.key && (
                        <ul className="pl-8 mt-2 space-y-2">
                            {category.subCategories.map(sub => (
                                <li key={sub.key}>
                                    <Link 
                                        href={`/?category=${encodeURIComponent(category.key)}&subcategory=${encodeURIComponent(sub.key)}`}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-between py-2 px-3 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                                    >
                                        <span>{sub.name}</span>
                                        <span className="text-xs font-mono bg-gray-600 text-gray-300 rounded-full px-1.5 py-0.5">{sub.count}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {isOpen && <div className="fixed inset-0 bg-black opacity-60 z-30" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
}
