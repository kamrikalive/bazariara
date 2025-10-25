'use server'

import { database } from '@/lib/firebase/server';
import { redirect } from 'next/navigation';

export async function createOrder(cartItems: any[], formData: FormData) {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;

    if (!name || !phone) {
        return { success: false, message: 'Имя и телефон обязательны для заполнения.' };
    }

    try {
        const orderData = {
            name,
            phone,
            items: cartItems.map(item => ({ 
                id: item.id,
                title: item.title,
                price: item.price
            })),
            createdAt: new Date().toISOString(),
        };

        const newOrderRef = database.ref('orders').push();
        await newOrderRef.set(orderData);

    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, message: 'Произошла ошибка при создании заказа.' };
    }

    redirect('/order-success');
}
