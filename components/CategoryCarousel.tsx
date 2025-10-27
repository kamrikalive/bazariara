'use client';

import { useRef, useState, useEffect } from 'react';

type Category = {
    name: string;
    key: string;
    imageUrl: string;
};

export default function CategoryCarousel({ 
    categories, 
    selectedCategory, 
    onSelectCategory 
}: { 
    categories: Category[], 
    selectedCategory: string, 
    onSelectCategory: (category: string) => void 
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () => {
            const scrollLeft = el.scrollLeft;
            const maxScroll = el.scrollWidth - el.clientWidth;
            const progress = (scrollLeft / maxScroll) * 100;
            setScrollProgress(progress || 0);
        };

        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="w-full px-2 sm:px-4">
            {/* Горизонтальная лента категорий */}
            <div
                ref={scrollRef}
                className="flex space-x-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2
                           [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {categories.map((category) => (
                    <button 
                        key={category.key}
                        onClick={() => onSelectCategory(category.key)}
                        className={`flex flex-col items-center justify-between flex-shrink-0 w-40 sm:w-48 md:w-52 rounded-2xl overflow-hidden snap-start transition-all duration-300
                            ${selectedCategory === category.key 
                                ? 'ring-2 ring-lime-500 shadow-md shadow-lime-500/30 scale-[1.04]' 
                                : 'ring-1 ring-gray-700 hover:ring-lime-400 hover:scale-[1.03]'
                            }`}
                    >
                        {/* Фото категории */}
                        <div className="w-full flex justify-center items-center bg-gray-900">
                            <img 
                                src={category.imageUrl} 
                                alt={category.name} 
                                className="object-cover w-full h-auto"
                                loading="lazy"
                            />
                        </div>

                        {/* Название категории */}
                        <span 
                            className={`w-full text-center py-1.5 text-[11px] sm:text-sm font-semibold tracking-wide truncate
                                ${selectedCategory === category.key 
                                    ? 'bg-lime-500 text-gray-900' 
                                    : 'bg-gray-800 text-gray-100'
                                }`}
                        >
                            {category.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Индикатор прокрутки */}
            <div className="relative mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-lime-500 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${Math.max(scrollProgress, 5)}%` }}
                />
            </div>
        </div>
    );
}
