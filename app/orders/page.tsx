'use client';

import { useOrders } from '@/contexts/OrderContext';
import OrdersList from '@/components/Orderslist';

export default function OrdersPage() {
    const { orders } = useOrders();

    return (
        <div className="bg-gray-900 min-h-screen text-white p-4 md:p-12">
            <main className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-lime-400">Ваши заказы</h1>
                {orders.length > 0 ? (
                    <OrdersList orders={orders} />
                ) : (
                    <div className="text-center bg-gray-800 p-8 rounded-lg shadow-lg">
                        <p className="text-xl text-gray-400">У вас еще нет заказов.</p>
                        <p className="text-gray-500 mt-2">Как только вы сделаете заказ, он появится здесь.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
