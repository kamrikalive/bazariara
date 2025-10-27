'use client';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

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
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 8,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div>
            <Slider {...settings}>
                {categories.map((category) => (
                    <div key={category.key} className="px-2">
                        <button 
                            onClick={() => onSelectCategory(category.key)}
                            className={`flex flex-col items-center justify-center w-full rounded-lg overflow-hidden transition-all duration-300 transform-gpu ${selectedCategory === category.key ? 'ring-2 ring-lime-500 shadow-lg shadow-lime-500/30' : 'ring-1 ring-gray-700 hover:ring-lime-500'}`}>
                            <img src={category.imageUrl} alt={category.name} className="w-full aspect-square object-cover"/>
                            <span className={`w-full py-2 text-xs font-semibold ${selectedCategory === category.key ? 'bg-lime-500 text-gray-900' : 'bg-gray-800 text-white'}`}>
                                {category.name}
                            </span>
                        </button>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
