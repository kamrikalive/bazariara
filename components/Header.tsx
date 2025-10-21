'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

export default function Header() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)

  return (
    <header className="flex justify-between items-center p-5 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <div>
            <h1 className="text-xl font-bold uppercase">Next Market</h1>
            <p className="text-gray-500">Магазин лучших товаров</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4 relative">
        <button
          onClick={() => setIsCatalogOpen(!isCatalogOpen)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <Image src="/file.svg" alt="Catalog" width={16} height={16} />
          <span>Каталог</span>
        </button>
        {isCatalogOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <Link href="/garden" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Сад</Link>
            <Link href="/leisure" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Товары для отдыха</Link>
            <Link href="/hiking" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Походы</Link>
          </div>
        )}
        <div className="relative">
          <input
            type="text"
            placeholder="Найти товар..."
            className="border border-gray-300 rounded-lg py-2 px-4 w-96"
          />
          <Image
            src="/search.svg"
            alt="Search"
            width={20}
            height={20}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          />
        </div>
      </div>

      <ul className="flex items-center gap-8">
        <li>
          <Link href="/favorites" className="flex flex-col items-center gap-1 hover:text-blue-500">
            <Image src="/heart.svg" alt="Favorites" width={24} height={24} />
            <span>Избранное</span>
          </Link>
        </li>
        <li>
          <Link href="/cart" className="flex flex-col items-center gap-1 hover:text-blue-500">
            <Image src="/cart.svg" alt="Cart" width={24} height={24} />
            <span>Корзина</span>
          </Link>
        </li>
      </ul>
    </header>
  )
}
