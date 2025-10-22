'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500">
                    Your Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="text-center bg-gray-800/50 rounded-xl p-12 shadow-2xl shadow-black/20">
                        <p className="text-2xl font-semibold mb-6 text-gray-300">Your cart feels a little empty.</p>
                        <Link href="/" className="bg-lime-500 text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-lime-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-500/30 hover:shadow-xl hover:shadow-lime-400/40">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 bg-gray-800/40 rounded-xl shadow-lg backdrop-blur-sm">
                            <ul className="divide-y divide-gray-700/50">
                                {cartItems.map(item => (
                                    <li key={item.id} className="flex flex-col sm:flex-row justify-between items-center p-5 gap-4">
                                        <div className="flex items-center gap-5 w-full sm:w-auto">
                                            <img src={item.image_url} alt={item.title} className="w-20 h-20 object-cover rounded-lg shadow-md"/>
                                            <div className="flex-grow">
                                                <h2 className="font-bold text-lg text-gray-200 group-hover:text-lime-400 transition-colors duration-300">{item.title}</h2>
                                                <p className="text-lime-500 font-semibold">₾{item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-4">
                                            <div className="flex items-center rounded-lg bg-gray-700/50 border border-gray-600">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-l-lg transition-colors">
                                                    <MinusIcon className="h-5 w-5"/>
                                                </button>
                                                <input 
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                    className="w-16 p-2 bg-transparent text-center focus:outline-none appearance-none"
                                                    style={{ MozAppearance: 'textfield' }} // Hide spinners in Firefox
                                                />
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-r-lg transition-colors">
                                                    <PlusIcon className="h-5 w-5"/>
                                                </button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors duration-300">
                                                <TrashIcon className="h-6 w-6" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1 bg-gray-800/60 rounded-xl shadow-xl p-6 backdrop-blur-sm top-20 sticky">
                            <h2 className="text-2xl font-bold border-b border-gray-700 pb-4 mb-4">Order Summary</h2>
                            <div className="flex justify-between mb-2 text-gray-300">
                                <span>Subtotal</span>
                                <span>₾{totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-6 text-gray-300">
                                <span>Shipping</span>
                                <span className="font-semibold text-lime-500">FREE</span>
                            </div>
                            <div className="flex justify-between font-extrabold text-2xl border-t border-gray-700 pt-4 mt-4">
                                <span>Total</span>
                                <span>₾{totalPrice.toFixed(2)}</span>
                            </div>

                            <div className="mt-8 flex flex-col gap-4">
                                 <Link href="/checkout" className="w-full text-center bg-lime-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-lime-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-500/30 hover:shadow-xl hover:shadow-lime-400/40">
                                    Proceed to Checkout
                                </Link>
                                <button onClick={clearCart} className="w-full text-center bg-gray-700 text-gray-300 font-semibold py-2 px-6 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-300">
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
