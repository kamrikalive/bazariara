'use server';

import { firestore } from '@/lib/firebase/server';

export async function handlePlaceOrder(orderDetails: any) {
  const { customer, items, total } = orderDetails;

  if (!customer || !customer.name || !customer.contact) {
    return { success: false, message: 'Customer details are missing.' };
  }

  if (!items || items.length === 0) {
    return { success: false, message: 'Cart is empty.' };
  }

  try {
    const orderData = {
      customer: {
        name: customer.name,
        contact: customer.contact,
      },
      items: items.map((item: any) => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image_url: item.product.image_url
      })),
      total,
      createdAt: new Date(),
    };

    await firestore.collection('orders').add(orderData);

    return { success: true };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, message: 'Произошла ошибка при создании заказа.' };
  }
}
