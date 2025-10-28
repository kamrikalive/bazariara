'use client';

import { useState, useEffect } from 'react';
import { useCart, Product } from '@/contexts/CartContext';
import { MinusIcon, PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';

interface QuantityInputProps {
    product: Product;
}

export default function QuantityInput({ product }: QuantityInputProps) {
    const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
    const cartItem = cartItems.find(item => item.id === product.id);

    const [inputValue, setInputValue] = useState<string | number>('');

    useEffect(() => {
        if (cartItem) {
            setInputValue(cartItem.quantity);
        } else {
            setInputValue(''); // Clear input if item is removed from cart
        }
    }, [cartItem]);

    const handleIncreaseQuantity = () => {
        if (cartItem) {
            const newQuantity = cartItem.quantity + 1;
            setInputValue(newQuantity);
            updateQuantity(cartItem.id, newQuantity);
        }
    };

    const handleDecreaseQuantity = () => {
        if (cartItem) {
            if (cartItem.quantity > 1) {
                const newQuantity = cartItem.quantity - 1;
                setInputValue(newQuantity);
                updateQuantity(cartItem.id, newQuantity);
            } else {
                removeFromCart(cartItem.id);
            }
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleBlur = () => {
        if (cartItem) {
            const newQuantity = parseInt(inputValue.toString(), 10);
            if (!isNaN(newQuantity) && newQuantity > 0) {
                updateQuantity(cartItem.id, newQuantity);
            } else if (newQuantity <= 0) {
                removeFromCart(cartItem.id);
            } else {
                // If input is invalid or empty, reset to original quantity
                setInputValue(cartItem.quantity);
            }
        }
    };

    if (!cartItem) {
        return (
            <button
                onClick={() => addToCart(product)}
                className="w-full flex items-center justify-center px-4 py-3 font-bold rounded-lg bg-lime-500 text-gray-900 hover:bg-lime-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-500/30 hover:shadow-xl hover:shadow-lime-400/40"
            >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                В корзину
            </button>
        );
    }

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={handleDecreaseQuantity}
                className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
                <MinusIcon className="h-5 w-5" />
            </button>
            <input
                type="number"
                value={inputValue}
                onChange={handleQuantityChange}
                onBlur={handleBlur}
                className="text-xl font-bold w-12 text-center bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-lime-500 rounded-md"
                min="1"
            />
            <button
                onClick={handleIncreaseQuantity}
                className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
                <PlusIcon className="h-5 w-5" />
            </button>
        </div>
    );
}
