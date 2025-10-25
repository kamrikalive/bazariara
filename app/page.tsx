import { Suspense } from 'react';
import HomePageContent from './page-content';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-white">Загрузка главной страницы...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
