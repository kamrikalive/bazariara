'use server';

import { database } from '@/lib/firebase/server';

interface OrderItem {
  product: {
    id: string; 
    title: string;
    price: number;
    category: string;
    categoryKey: string;
    image_url?: string;
  };
  quantity: number;
}

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

interface EnrichedItemData {
    id: string; 
    title: string;
    price: number;
    quantity: number;
    link?: string;
}

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
            categoryKey: item.product.categoryKey,
            image_url: item.product.image_url ?? null,
        })),
        subtotal,
        shippingCost,
        total,
        createdAt: createdAt,
    };

    await newOrderRef.set(orderDataForRealtimeDB);
    console.log('Order saved to Realtime Database.');

    // --- FINAL, ROBUST LINK FETCHING LOGIC ---
    // item.product.id is the Firebase document key
    const enrichedItems: EnrichedItemData[] = await Promise.all(
        items.map(async (item) => {
            const categoryKey = item.product.categoryKey || item.product.category;
            const firebaseDocumentKey = item.product.id; // Firebase document key
            const title = item.product.title;
            let finalLink: string | undefined = undefined;

            console.log(`\n🔍 SEARCHING for product: FirebaseKey="${firebaseDocumentKey}", Title="${title}", Category=${categoryKey}`);

            try {
                const productRef = database.ref(`products/${categoryKey}/${firebaseDocumentKey}`);
                const snapshot = await productRef.once('value');

                if (snapshot.exists()) {
                    const product = snapshot.val();
                    console.log(`✅ Product found at products/${categoryKey}/${firebaseDocumentKey}`);
                    console.log(`   Full product:`, JSON.stringify(product, null, 2));
                    
                    if (product.link) {
                        finalLink = product.link;
                        console.log(`✅ Link extracted: ${finalLink}`);
                    } else {
                        console.log(`⚠️ No link field in product`);
                    }
                } else {
                    console.log(`❌ Product not found at path: products/${categoryKey}/${firebaseDocumentKey}`);
                }
            } catch (err) {
                console.error(`[FATAL] Database error fetching link for product "${title}":`, err);
            }
            
            console.log(`✅ Final result for "${title}": link="${finalLink}"\n`);
            
            return {
                id: item.product.id,
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                link: finalLink
            };
        })
    );
    // --- END OF LOGIC ---

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