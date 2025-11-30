'use client';

import { useEffect, useState } from 'react';

// Тип для падающих элементов
interface FallingItem {
  id: number;
  left: string;
  animationDuration: string;
  animationDelay: string;
  size: number;
  opacity: number;
  type: 'snowflake' | 'star';
}

const MagicFall = () => {
  const [items, setItems] = useState<FallingItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Определяем, мобильное ли устройство
    const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
    }
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Количество элементов в зависимости от типа устройства
    const itemCount = isMobile ? 40 : 150;

    const createItems = () => {
      // ЯВНО УКАЗЫВАЕМ ТИП ЗДЕСЬ, ЧТОБЫ ИСПРАВИТЬ ОШИБКУ
      const newItems: FallingItem[] = Array.from({ length: itemCount }, (_, i) => {
        const isStar = Math.random() > 0.8; // 20% шанс, что это будет звезда
        const size = isStar ? Math.random() * 8 + 4 : Math.random() * 3 + 2;
        
        return {
          id: i,
          left: `${Math.random() * 100}vw`,
          animationDuration: `${Math.random() * 10 + 8}s`,
          animationDelay: `${Math.random() * 7}s`,
          size: size,
          opacity: Math.random() * 0.6 + 0.4,
          type: isStar ? 'star' : 'snowflake',
        };
      });
      setItems(newItems);
    };

    createItems();
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]); // Пересоздаем элементы при изменении isMobile

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      {items.map((item) => {
        if (item.type === 'star') {
          return (
            <div
              key={item.id}
              className="absolute text-yellow-300"
              style={{
                left: item.left,
                fontSize: `${item.size}px`,
                opacity: item.opacity,
                animationName: 'fall, twinkle',
                animationDuration: `${item.animationDuration}, 3s`,
                animationDelay: item.animationDelay,
                animationIterationCount: 'infinite, infinite',
              }}
            >
              ★
            </div>
          );
        }
        
        return (
          <div
            key={item.id}
            className="absolute bg-white rounded-full"
            style={{
              left: item.left,
              width: `${item.size}px`,
              height: `${item.size}px`,
              opacity: item.opacity,
              animationName: 'fall',
              animationDuration: item.animationDuration,
              animationDelay: item.animationDelay,
              animationIterationCount: 'infinite',
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default MagicFall;
