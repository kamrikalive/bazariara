import { Metadata } from 'next';
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
      { url: '/icon_32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon_96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon_128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/icon_256x256.png', sizes: '256x256', type: 'image/png' },
      { url: '/icon_512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icon_128x128.png',
  },
  
  openGraph: {
    type: 'website',
    url: siteUrl.toString(),
    siteName,
    title: { default: siteName, template: `%s | ${siteName}` },
    description,
    images: [
      {
        url: new URL('/icon_32x32.png', siteUrl).toString(),
        width: 32,
        height: 32,
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
      <head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-900">
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
