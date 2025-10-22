'use server';

import { firestore } from '@/lib/firebase/server';

interface OrderItem {
  product: {
    id: string | number;
    title: string;
    price: number;
    image_url?: string;
  };
  quantity: number;
}

interface OrderDetails {
  customer: {
    name: string;
    contact: string;
  };
  items: OrderItem[];
  total: number;
}

interface OrderData {
  customer: {
    name: string;
    contact: string;
  };
  items: Array<{
    id: string | number;
    title: string;
    price: number;
    quantity: number;
    image_url?: string;
  }>;
  total: number;
  createdAt: Date;
}

// Функция для отправки уведомления в Telegram
async function sendTelegramNotification(orderData: OrderData): Promise<boolean> {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не настроены в переменных окружения');
    return false;
  }

  // Формируем сообщение
  const itemsList = orderData.items
    .map((item, index) => 
      `${index + 1}. ${item.title}\n   Количество: ${item.quantity}\n   Цена: ₾${item.price}\n   Сумма: ₾${(item.price * item.quantity).toFixed(2)}`
    )
    .join('\n\n');

  const message = `
🛒 *НОВЫЙ ЗАКАЗ*

👤 *Клиент:* ${orderData.customer.name}
📞 *Контакт:* ${orderData.customer.contact}

📦 *Товары:*
${itemsList}

💰 *ИТОГО: ₾${orderData.total.toFixed(2)}*

📅 Дата: ${new Date(orderData.createdAt).toLocaleString('ru-RU', { timeZone: 'Asia/Tbilisi' })}
  `.trim();

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    const data = await response.json();
    
    if (!data.ok) {
      console.error('Ошибка Telegram API:', data);
      return false;
    }

    console.log('Уведомление успешно отправлено в Telegram');
    return true;
  } catch (error) {
    console.error('Ошибка при отправке уведомления в Telegram:', error);
    return false;
  }
}

export async function handlePlaceOrder(orderDetails: OrderDetails) {
  const { customer, items, total } = orderDetails;

  if (!customer || !customer.name || !customer.contact) {
    return { success: false, message: 'Отсутствуют данные о клиенте.' };
  }

  if (!items || items.length === 0) {
    return { success: false, message: 'Корзина пуста.' };
  }

  try {
    const orderData: OrderData = {
      customer: {
        name: customer.name,
        contact: customer.contact,
      },
      items: items.map((item) => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image_url: item.product.image_url
      })),
      total,
      createdAt: new Date(),
    };

    // Сохраняем заказ в Firestore
    await firestore.collection('orders').add(orderData);

    // ВАЖНО: Отправляем уведомление в Telegram
    const telegramSent = await sendTelegramNotification(orderData);
    
    if (!telegramSent) {
      console.warn('Заказ создан, но уведомление в Telegram не было отправлено');
    }

    return { success: true };
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    return { success: false, message: 'Произошла ошибка при создании заказа.' };
  }
}