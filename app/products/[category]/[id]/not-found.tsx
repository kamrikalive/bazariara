'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function ProductNotFound() {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      {t('product.notFound')}
    </div>
  );
}

