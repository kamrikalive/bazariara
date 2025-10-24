'use client';

import { Order, OrderItem } from '@/contexts/OrderContext';
import { calculateDisplayPrice } from '@/lib/priceLogic';

interface OrdersListProps {
    orders: Order[];
}

export default function OrdersList({ orders }: OrdersListProps) {
    return (
        <div className="space-y-6">
            {orders.map((order, index) => {
                const subtotal = order.reduce((sum, item) => sum + calculateDisplayPrice(item.price) * item.quantity, 0);
                // All items in an order share the same shipping cost
                const shippingCost = order.length > 0 ? (order[0] as OrderItem).shippingCost : 0;
                const total = subtotal + shippingCost;

                return (
                    <div key={index} className="bg-gray-800 rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-lime-400 mb-4">Заказ #{index + 1}</h2>
                        <div className="divide-y divide-gray-700">
                            {order.map((item: OrderItem) => (
                                <div key={item.id} className="flex items-center justify-between py-4">
                                    <div className="flex items-center gap-4">
                                        {item.image_url && (
                                            <img src={item.image_url} alt={item.title} className="h-16 w-16 rounded-md object-cover" />
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-white">{item.title}</h3>
                                            <p className="text-gray-400">Количество: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-white">₾{(calculateDisplayPrice(item.price) * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-700 space-y-2 text-right">
                            <div className="flex justify-between text-gray-400">
                                <span>Подытог:</span>
                                <span>₾{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Доставка:</span>
                                {shippingCost > 0 ? (
                                    <span>₾{shippingCost.toFixed(2)}</span>
                                ) : (
                                    <span className="font-semibold text-lime-500">БЕСПЛАТНО</span>
                                )}
                            </div>
                            <div className="flex justify-between text-lg font-bold text-white">
                                <span>Итого:</span>
                                <span>₾{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}
