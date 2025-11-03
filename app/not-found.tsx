import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-900 text-center px-4">
      <div className="max-w-md">
        <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-600 mb-4">
          404
        </h1>
        <p className="text-2xl md:text-3xl font-bold text-gray-200 mb-3">
          Страница не найдена
        </p>
        <p className="text-gray-400 mb-8">
          Ой! Похоже, вы свернули не туда. Страница, которую вы ищете, могла быть удалена или никогда не существовала.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 font-bold rounded-lg bg-lime-500 text-gray-900 hover:bg-lime-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-500/30 hover:shadow-xl hover:shadow-lime-400/40"
        >
          <ArrowLeftIcon className="h-6 w-6" />
          <span>Вернуться на главную</span>
        </Link>
      </div>
    </div>
  );
}
