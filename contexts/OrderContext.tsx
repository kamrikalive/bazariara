'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProductInCart } from './CartContext';

export interface OrderItem extends ProductInCart {
    shippingCost: number;
}

// An order is an array of order items
export type Order = OrderItem[];

type OrderContextType = {
    orders: Order[];
    addOrder: (order: Order) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        try {
            const storedOrders = localStorage.getItem('orders');
            if (storedOrders) {
                setOrders(JSON.parse(storedOrders));
            }
        } catch (error) {
            console.error("Failed to parse orders from localStorage", error);
            setOrders([]);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    const addOrder = (order: Order) => {
        setOrders(prevOrders => [...prevOrders, order]);
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};
