'use server';

import { firestore } from '@/lib/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';

// Interface for a single item in the order from the client
interface OrderItem {
  product: {
    id: number; 
    title: string;
    price: number;
    category: string;
    image_url?: string;
  };
  quantity: number;
}

// Interface for the incoming order details from the client
interface OrderDetails {
  customer: {
    name: string;
    phone?: string;
    telegram?: string;
  };
  items: OrderItem[];
  total: number;
}

// This interface is for the data that will be sent to Telegram
interface EnrichedItemData {
    id: number; 
    title: string;
    price: number;
    quantity: number;
    link?: string; // The link fetched from the database
}

// This function sends a formatted message to a Telegram chat
async function sendTelegramNotification(
    customer: OrderDetails['customer'],
    items: EnrichedItemData[],
    total: number,
    createdAt: Date
): Promise<boolean> {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram environment variables are not set.');
    return false;
  }

  const contactDetails = [
    customer.phone && `📞 Телефон: ${customer.phone}`,
    customer.telegram && `💬 Telegram: ${customer.telegram}`
  ].filter(Boolean).join('\n');

  const itemsList = items
    .map((item, index) => {
      const titleWithLink = item.link ? `[${item.title}](${item.link})` : item.title;
      return `${index + 1}. ${titleWithLink}\n   Кол-во: ${item.quantity} x ₾${item.price.toFixed(2)} = ₾${(item.price * item.quantity).toFixed(2)}`;
    })
    .join('\n\n');

  const message = `
🛒 *НОВЫЙ ЗАКАЗ* 🛒

👤 *Клиент:* ${customer.name}
${contactDetails}

📦 *Состав заказа:*
${itemsList}

*💰 ИТОГО: ₾${total.toFixed(2)}*

📅 *Дата:* ${new Date(createdAt).toLocaleString('ru-RU', { timeZone: 'Asia/Tbilisi' })}
  `.trim();

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'Markdown' }),
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

  if (!customer || !customer.name || (!customer.phone && !customer.telegram)) {
    return { success: false, message: 'Необходимо указать имя и хотя бы один контакт.' };
  }

  if (!items || items.length === 0) {
    return { success: false, message: 'Ваша корзина пуста.' };
  }

  try {
    const createdAt = new Date();
    const orderDataForFirestore = {
      customer,
      items: items.map(item => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        category: item.product.category, // Save category with the order
        image_url: item.product.image_url ?? null,
      })),
      total,
      createdAt: FieldValue.serverTimestamp(),
    };

    await firestore.collection('orders').add(orderDataForFirestore);
    console.log('Order saved to Firestore.');

    const productLinks: { [key: number]: string } = {}; 

    const itemsByCategory: { [key:string]: number[] } = {};
    items.forEach(item => {
        // Map display category name to collection name
        const collectionName = item.product.category === 'Сад' ? 'garden' : 'hiking';
        if (!itemsByCategory[collectionName]) {
            itemsByCategory[collectionName] = [];
        }
        itemsByCategory[collectionName].push(item.product.id);
    });

    // Fetch links for each category
    for (const collectionName in itemsByCategory) {
        const productIds = itemsByCategory[collectionName];
        if (productIds.length > 0) {
            const productsSnapshot = await firestore.collection(collectionName).where('id', 'in', productIds).get();
            productsSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.id && data.link) {
                    productLinks[data.id] = data.link;
                }
            });
        }
    }

    const enrichedItems: EnrichedItemData[] = items.map(item => ({
      id: item.product.id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      link: productLinks[item.product.id] || undefined
    }));

    await sendTelegramNotification(customer, enrichedItems, total, createdAt);

    return { success: true };

  } catch (error: any) {
    console.error('Error processing order:', error);
    return { 
      success: false, 
      message: `На сервере произошла ошибка: ${error.message}`
    };
  }
}
