'use client';

import { useOrders } from '@/contexts/OrderContext';
import OrdersList from '@/components/Orderslist';
import { useLanguage } from '@/contexts/LanguageContext';

export default function OrdersPage() {
    const { orders } = useOrders();
    const { t } = useLanguage();

    return (
        <div className="bg-gray-900 min-h-screen text-white p-4 md:p-12">
            <main className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-lime-400">{t('orders.title')}</h1>
                {orders.length > 0 ? (
                    <OrdersList orders={orders} />
                ) : (
                    <div className="text-center bg-gray-800 p-8 rounded-lg shadow-lg">
                        <p className="text-xl text-gray-400">{t('orders.noOrders')}</p>
                        <p className="text-gray-500 mt-2">{t('orders.noOrdersHint')}</p>
                    </div>
                )}
            </main>
        </div>
    );
}
