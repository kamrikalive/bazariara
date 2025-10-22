'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';

export default function Header() {
    const { cartItems } = useCart();

    // Calculate total number of items in the cart
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Calculate the total price of items in the cart
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <header className="bg-gray-800 p-4 shadow-md sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-white hover:text-lime-400 transition-colors duration-300">
                    MarketGE
                </Link>
                <nav className="hidden md:flex gap-6 items-center">
                    <Link href="/" className="text-white hover:text-lime-400 transition-colors duration-300">All Products</Link>
                </nav>
                <div className="flex items-center gap-6">
                    <Link href="/cart" className="relative flex items-center text-white hover:text-lime-400 transition-colors duration-300">
                        {
                            totalPrice > 0 && (
                                <span className="mr-3 text-lg font-bold text-lime-400">
                                    ₾{totalPrice.toFixed(2)}
                                </span>
                            )
                        }
                        <ShoppingCartIcon className="h-8 w-8" />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-lime-500 text-gray-900 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                    {/* Placeholder for user avatar */}
                    <div className="h-10 w-10 rounded-full bg-gray-700"></div>
                </div>
            </div>
        </header>
    );
}
