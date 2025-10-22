'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <main className="p-12">
                <h1 className="text-4xl font-bold text-center mb-8">Your Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center">
                        <p className="text-xl mb-4">Your cart is empty.</p>
                        <Link href="/" className="bg-lime-500 text-gray-900 font-semibold py-2 px-6 rounded-lg hover:bg-lime-600 transition-colors duration-300">
                            Shop Now
                        </Link>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center border-b border-gray-700 py-4 last:border-b-0">
                                    <div className="flex items-center gap-4">
                                        <img src={item.image_url} alt={item.title} className="w-24 h-24 object-cover rounded-lg"/>
                                        <div>
                                            <h2 className="text-xl font-bold">{item.title}</h2>
                                            <p className="text-gray-400">₾{item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                            className="w-16 p-2 bg-gray-700 rounded-lg text-center"
                                        />
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 font-bold">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold">Total: ₾{totalPrice.toFixed(2)}</h2>
                            <div className="flex gap-4">
                                <button onClick={clearCart} className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300">
                                    Clear Cart
                                </button>
                                <Link href="/checkout" className="bg-lime-500 text-gray-900 font-semibold py-2 px-6 rounded-lg hover:bg-lime-600 transition-colors duration-300">
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
