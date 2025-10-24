'use client';

import { useOrders } from '@/contexts/OrderContext';
import OrdersList from '@/components/Orderslist';

export default function OrdersPage() {
    const { orders } = useOrders();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-white">Ваши заказы</h1>
            {orders.length > 0 ? (
                <OrdersList orders={orders} />
            ) : (
                <p className="text-gray-400">У вас еще нет заказов.</p>
            )}
        </div>
    );
}
