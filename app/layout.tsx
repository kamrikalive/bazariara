import './globals.css';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';

export const metadata = {
  title: 'MarketGE',
  description: 'A one-stop shop for all your needs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
            <Header />
            {children}
        </CartProvider>
      </body>
    </html>
  );
}
