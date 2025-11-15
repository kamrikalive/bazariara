import { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import { CartProvider } from '@/contexts/CartContext';
import { OrderProvider } from '@/contexts/OrderContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const siteName = 'BAZARI ARA';
const siteUrl = new URL('https://bazariara.ge');
const description = 'Все для дома, дачи и отдыха с быстрой доставкой по Тбилиси. У нас вы найдете широкий ассортимент товаров по доступным ценам.';

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: ['BAZARI ARA', 'интернет-магазин', 'товары для дома', 'товары для дачи', 'отдых', 'кемпинг', 'рыбалка', 'купить в Тбилиси', 'доставка по Тбилиси', 'Грузия'],
  
  // --- Иконки через Metadata API ---
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon_120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  
  openGraph: {
    type: 'website',
    url: siteUrl.toString(),
    siteName,
    title: { default: siteName, template: `%s | ${siteName}` },
    description,
    images: [
      {
        url: new URL('/web-app-manifest-512x512.png', siteUrl).toString(),
        width: 512,
        height: 512,
        alt: 'Логотип BAZARI ARA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  
  // --- Для Windows плиток и темы ---
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#1a202c',
    'theme-color': '#1a202c',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head />
      <body className="flex flex-col min-h-screen bg-gray-900">
        <OrderProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </OrderProvider>
        <Analytics />
      </body>
    </html>
  );
}
