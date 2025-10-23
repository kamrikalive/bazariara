'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { handlePlaceOrder } from './actions';
import { calculateDisplayPrice } from '@/lib/priceLogic';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = cartItems.reduce((sum, item) => sum + calculateDisplayPrice(item.price) * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const digits = input.replace(/[^0-9]/g, '');
    setPhone(digits);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!name || (!phone && !telegram)) {
      setError('Необходимо указать имя и хотя бы один контакт: телефон или Telegram.');
      setIsSubmitting(false);
      return;
    }

    if (cartItems.length === 0) {
        setError('Ваша корзина пуста.');
        setIsSubmitting(false);
        return;
    }

    const fullPhoneNumber = phone ? `+995${phone}` : '';

    const orderDetails = {
      customer: { name, phone: fullPhoneNumber, telegram },
      items: cartItems.map(item => ({
        product: {
          id: item.id,
          title: item.title,
          price: calculateDisplayPrice(item.price),
          category: item.category, // Added missing category field
          image_url: item.image_url,
        },
        quantity: item.quantity,
      })), 
      total,
    };

    try {
      const result = await handlePlaceOrder(orderDetails);
      if (result.success) {
        clearCart();
        router.push('/order-success');
      } else {
        throw new Error(result.message || 'Не удалось разместить заказ.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 md:p-12">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-lime-400">Оформление заказа</h1>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Ваш заказ ({cartCount} поз.)</h2>
          {cartItems.length > 0 ? (
            <ul className="divide-y divide-gray-700">
              {cartItems.map(item => (
                <li key={item.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded-md mr-4" />
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-gray-400">{item.quantity} x ₾{calculateDisplayPrice(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="font-semibold">₾{(calculateDisplayPrice(item.price) * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400">Ваша корзина пуста.</p>
          )}
          <div className="mt-6 pt-4 border-t border-gray-700 text-right">
            <p className="text-2xl font-bold">Итого: ₾{total.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Контактные данные</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-300 mb-2 font-medium">Имя</label>
                    <input 
                        type="text" 
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all duration-300"
                        required
                    />
                </div>
                
                <div className="mb-6">
                    <label htmlFor="phone" className="block text-gray-300 mb-2 font-medium">Номер телефона (Грузия)</label>
                    <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-lime-500 transition-all duration-300">
                        <div className="flex items-center pl-4 pr-3 pointer-events-none">
                            <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f1ec-1f1ea.png" alt="Georgia Flag" className="w-6 h-6 mr-2"/>
                            <span className="text-white font-medium">+995</span>
                        </div>
                        <input 
                            type="tel" 
                            id="phone"
                            value={phone}
                            onChange={handlePhoneChange}
                            className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
                            placeholder="555 123 456"
                            maxLength={9}
                        />
                    </div>
                </div>

                 <div className="mb-8">
                    <label htmlFor="telegram" className="block text-gray-300 mb-2 font-medium">Telegram</label>
                    <input 
                        type="text" 
                        id="telegram"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all duration-300"
                        placeholder="@username"
                    />
                </div>
                
                {error && <p className="text-red-500 text-center mb-6 p-3 bg-red-900/20 rounded-lg">{error}</p>}

                <button 
                    type="submit" 
                    className="w-full bg-lime-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-lime-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-500/30 disabled:opacity-50 disabled:cursor-wait"
                    disabled={isSubmitting || cartItems.length === 0}
                >
                    {isSubmitting ? 'Обработка...' : 'Отправить заказ'}
                </button>
            </form>
        </div>
      </main>
    </div>
  );
}
