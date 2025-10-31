'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the types for our context
export type ProductInCart = {
    id: string;
    title: string;
    price: number;
    image_url?: string;
    quantity: number;
    category: string;
    categoryKey: string;
    sub_category?: string;
    subCategoryKey?: string;
};

export type Product = {
    id: string;
    title: string;
    price: number;
    image_url?: string;
    category: string;
    categoryKey: string;
    description?: string;
    sub_category?: string;
    subCategoryKey?: string;
};

type CartContextType = {
    cartItems: ProductInCart[];
    addToCart: (item: Product) => void;
    removeFromCart: (itemId: string, category: string) => void;
    updateQuantity: (itemId: string, quantity: string, category: string) => void;
    clearCart: () => void;
};

// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<ProductInCart[]>([]);

    // Load cart from localStorage on initial render
    useEffect(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                const parsedCart = JSON.parse(storedCart);
                if (Array.isArray(parsedCart) && parsedCart.every(item => 'categoryKey' in item)) {
                    setCartItems(parsedCart);
                }
            }
        } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
            setCartItems([]);
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item: Product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id && i.category === item.category);
            if (existingItem) {
                return prevItems.map(i => 
                    i.id === item.id && i.category === item.category ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                return [...prevItems, { ...item, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (itemId: string, category: string) => {
        setCartItems(prevItems => prevItems.filter(item => !(item.id === itemId && item.category === category)));
    };

    const updateQuantity = (itemId: string, quantity: number, category: string) => {
        if (quantity <= 0) {
            removeFromCart(itemId, category);
        } else {
            setCartItems(prevItems => 
                prevItems.map(item => 
                    item.id === itemId && item.category === category ? { ...item, quantity } : item
                )
            );
        }
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Create a custom hook to use the cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
