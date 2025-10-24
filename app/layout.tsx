import './globals.css';
import { CartProvider } from '@/contexts/CartContext';
import { OrderProvider } from '@/contexts/OrderContext';
import Header from '@/components/Header';

export const metadata = {
  title: 'MarketGE',
  description: 'A one-stop shop for all your needs',
  icons: {
    icon: '/favicon-32x32.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OrderProvider>
          <CartProvider>
              <Header />
              {children}
          </CartProvider>
        </OrderProvider>
      </body>
    </html>
  );
}
