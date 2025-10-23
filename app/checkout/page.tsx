'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { handlePlaceOrder } from './actions';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

    const orderDetails = {
      customer: { name, phone, telegram },
      items: cartItems.map(item => ({ product: item, quantity: item.quantity })), 
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
                      <p className="text-gray-400">{item.quantity} x ₾{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="font-semibold">₾{(item.price * item.quantity).toFixed(2)}</span>
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
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-300 mb-2">Имя</label>
                    <input 
                        type="text" 
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-300 mb-2">Номер телефона</label>
                    <input 
                        type="text" 
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
                        placeholder="+995 555 123 456"
                    />
                </div>
                 <div className="mb-6">
                    <label htmlFor="telegram" className="block text-gray-300 mb-2">Telegram</label>
                    <input 
                        type="text" 
                        id="telegram"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
                        placeholder="@username"
                    />
                </div>
                
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <button 
                    type="submit" 
                    className="w-full bg-lime-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-lime-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-wait"
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
