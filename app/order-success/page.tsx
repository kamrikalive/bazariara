'use client';

import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function OrderSuccessPage() {
  return (
    <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center p-4">
      <main className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <CheckCircleIcon className="w-20 h-20 text-lime-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Заказ успешно оформлен!</h1>
        <p className="text-gray-300 mb-8">
          Спасибо за вашу покупку. Наш менеджер скоро свяжется с вами для подтверждения деталей.
        </p>
        <Link href="/" className="inline-block bg-lime-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-lime-600 transition-colors duration-300">
            Вернуться на главную
        </Link>
      </main>
    </div>
  );
}
