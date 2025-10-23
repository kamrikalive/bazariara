'use server';

import { firestore } from '@/lib/firebase/server';

// Updated interface for a single item in the order
interface OrderItem {
  product: {
    id: string | number;
    title: string;
    price: number;
    image_url?: string;
  };
  quantity: number;
}

// Updated interface for the incoming order details from the client
interface OrderDetails {
  customer: {
    name: string;
    phone?: string;
    telegram?: string;
  };
  items: OrderItem[];
  total: number;
}

// Updated interface for the data structure to be saved in Firestore and sent to Telegram
interface OrderData {
  customer: {
    name: string;
    phone?: string;
    telegram?: string;
  };
  items: Array<{
    id: string | number;
    title: string;
    price: number;
    quantity: number;
    image_url?: string | null;
  }>;
  total: number;
  createdAt: Date;
}

// This function sends a formatted message to a Telegram chat
async function sendTelegramNotification(orderData: OrderData): Promise<boolean> {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram environment variables (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID) are not set.');
    return false; // Return false if Telegram is not configured
  }

  // Construct the contact details string
  const contactDetails = [
    orderData.customer.phone && `📞 Телефон: ${orderData.customer.phone}`,
    orderData.customer.telegram && `💬 Telegram: ${orderData.customer.telegram}`
  ].filter(Boolean).join('\n'); // Filter out empty values and join

  // Construct the list of items
  const itemsList = orderData.items
    .map((item, index) => 
      `${index + 1}. ${item.title}\n   Кол-во: ${item.quantity} x ₾${item.price.toFixed(2)} = ₾${(item.price * item.quantity).toFixed(2)}`
    )
    .join('\n\n');

  // Construct the final message for Telegram
  const message = `
🛒 *НОВЫЙ ЗАКАЗ* 🛒

👤 *Клиент:* ${orderData.customer.name}
${contactDetails}

📦 *Состав заказа:*
${itemsList}

*💰 ИТОГО: ₾${orderData.total.toFixed(2)}*

📅 *Дата:* ${new Date(orderData.createdAt).toLocaleString('ru-RU', { timeZone: 'Asia/Tbilisi' })}
  `.trim();

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    const data = await response.json();
    if (!data.ok) {
      console.error('Telegram API Error:', data.description);
      return false;
    }

    console.log('Telegram notification sent successfully.');
    return true;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
}

// This server action handles placing the order
export async function handlePlaceOrder(orderDetails: OrderDetails) {
  const { customer, items, total } = orderDetails;

  // Server-side validation
  if (!customer || !customer.name || (!customer.phone && !customer.telegram)) {
    return { success: false, message: 'Необходимо указать имя и хотя бы один контакт (телефон или Telegram).' };
  }

  if (!items || items.length === 0) {
    return { success: false, message: 'Ваша корзина пуста.' };
  }

  try {
    // Prepare the order data for saving and notification
    const orderData: OrderData = {
      customer: {
        name: customer.name,
        phone: customer.phone || undefined,
        telegram: customer.telegram || undefined,
      },
      items: items.map((item) => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image_url: item.product.image_url ?? null,
      })),
      total,
      createdAt: new Date(),
    };

    // Save the order to Firestore
    await firestore.collection('orders').add(orderData);
    console.log(`Order ${orderData.createdAt.toISOString()} saved to Firestore.`);

    // Send a notification to Telegram
    const telegramSent = await sendTelegramNotification(orderData);
    if (!telegramSent) {
      // Log a warning but don't fail the order if Telegram fails
      console.warn('Order was saved to Firestore, but the Telegram notification failed to send.');
    }

    // Return success
    return { success: true };

  } catch (error: any) {
    console.error('Error processing order:', error);
    return { 
      success: false, 
      message: `На сервере произошла ошибка при обработке вашего заказа. Пожалуйста, попробуйте еще раз. (${error.message})`
    };
  }
}
