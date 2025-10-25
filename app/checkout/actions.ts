'use server';

import { database } from '@/lib/firebase/server';

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
    social?: { [key: string]: string };
  };
  items: OrderItem[];
  total: number;
  shippingCost: number;
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
    shippingCost: number,
    createdAt: Date
): Promise<boolean> {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram environment variables are not set.');
    return false;
  }

  const socialContacts = customer.social ? 
    Object.entries(customer.social)
        .map(([platform, value]) => `💬 ${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${value}`)
        .join('\n') 
    : '';

  const contactDetails = [
    customer.phone && `📞 Телефон: ${customer.phone}`,
    socialContacts
  ].filter(Boolean).join('\n');

  const itemsList = items
    .map((item, index) => {
      const titleWithLink = item.link ? `[${item.title}](${item.link})` : item.title;
      return `${index + 1}. ${titleWithLink}\n   Кол-во: ${item.quantity} x ₾${item.price.toFixed(2)} = ₾${(item.price * item.quantity).toFixed(2)}`;
    })
    .join('\n\n');
    
  const subtotal = total - shippingCost;
  const shippingText = shippingCost > 0 ? `*🚚 Доставка: ₾${shippingCost.toFixed(2)}*` : '*🚚 Доставка: БЕСПЛАТНО*';

  const message = `
🛒 *НОВЫЙ ЗАКАЗ* 🛒

👤 *Клиент:* ${customer.name}
${contactDetails}

📦 *Состав заказа:*
${itemsList}

*Подытог: ₾${subtotal.toFixed(2)}*
${shippingText}
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
  const { customer, items, total, shippingCost } = orderDetails;

  const hasSocialContact = customer.social && Object.keys(customer.social).length > 0;

  if (!customer || !customer.name || (!customer.phone && !hasSocialContact)) {
    return { success: false, message: 'Необходимо указать имя и хотя бы один контакт.' };
  }

  if (!items || items.length === 0) {
    return { success: false, message: 'Ваша корзина пуста.' };
  }

  try {
    const createdAt = new Date().toISOString();
    const subtotal = total - shippingCost;
    
    const ordersRef = database.ref('orders');
    const newOrderRef = ordersRef.push();

    const orderDataForRealtimeDB = {
        customer,
        items: items.map(item => ({
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
            category: item.product.category,
            image_url: item.product.image_url ?? null,
        })),
        subtotal,
        shippingCost,
        total,
        createdAt: createdAt,
    };

    await newOrderRef.set(orderDataForRealtimeDB);
    console.log('Order saved to Realtime Database.');

    const productLinks: { [key: number]: string } = {};
    const itemsByCategory: { [key: string]: number[] } = {};

    items.forEach(item => {
        const categoryKey = item.product.category === 'Сад' ? 'garden' : 'hiking';
        if (!itemsByCategory[categoryKey]) {
            itemsByCategory[categoryKey] = [];
        }
        itemsByCategory[categoryKey].push(item.product.id);
    });

    for (const categoryKey in itemsByCategory) {
        const productIds = itemsByCategory[categoryKey];
        if (productIds.length > 0) {
            const categoryRef = database.ref(`products/${categoryKey}`);
            const snapshot = await categoryRef.once('value');
            if (snapshot.exists()) {
                const productsObject = snapshot.val();
                const productsArray = Object.values(productsObject);

                const relevantProducts = productsArray.filter((p: any) => p && productIds.includes(p.id));
                
                relevantProducts.forEach((product: any) => {
                    if (product.link) {
                        productLinks[product.id] = product.link;
                    }
                });
            }
        }
    }

    const enrichedItems: EnrichedItemData[] = items.map(item => ({
      id: item.product.id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      link: productLinks[item.product.id] || undefined
    }));

    await sendTelegramNotification(customer, enrichedItems, total, shippingCost, new Date(createdAt));

    return { success: true };

  } catch (error: any) {
    console.error('Error processing order:', error);
    return { 
      success: false, 
      message: `На сервере произошла ошибка: ${error.message}`
    };
  }
}
