import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full pt-20">
      <Image src="/order-success-icon.png" alt="Order success" width={120} height={120} />
      <h2 className="text-2xl font-bold mt-4">Заказ оформлен!</h2>
      <p className="text-gray-500 mt-2">Ваш заказ скоро будет передан курьерской доставке.</p>
      <Link href="/"
        className="bg-lime-500 text-white rounded-xl py-3 px-6 mt-10 transition hover:bg-lime-600">
          Вернуться на главную
      </Link>
    </div>
  );
}
