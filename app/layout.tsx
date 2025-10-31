import { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/contexts/CartContext';
import { OrderProvider } from '@/contexts/OrderContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'BAZARI ARA',
  description: 'A one-stop shop for all your needs',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="flex flex-col min-h-screen">
        <OrderProvider>
          <CartProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
          </CartProvider>
        </OrderProvider>
      </body>
    </html>
  );
}
