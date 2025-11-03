import { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/contexts/CartContext';
import { OrderProvider } from '@/contexts/OrderContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const siteName = 'BAZARI ARA';
const siteUrl = new URL('https://bazariara.ge');
const description = 'Все для дома, дачи и отдыха с быстрой доставкой по Тбилиси. У нас вы найдете широкий ассортимент товаров по доступным ценам.';

// --- Метаданные --- 
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: ['BAZARI ARA', 'интернет-магазин', 'товары для дома', 'товары для дачи', 'отдых', 'кемпинг', 'рыбалка', 'купить в Тбилиси', 'доставка по Тбилиси', 'Грузия'],
  openGraph: {
    type: 'website',
    url: siteUrl.toString(),
    siteName,
    title: { default: siteName, template: `%s | ${siteName}` },
    description,
    images: [
      {
        url: new URL('/android-chrome-512x512.png', siteUrl).toString(),
        width: 512,
        height: 512,
        alt: 'Логотип BAZARI ARA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

// --- Корневой макет --- 
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        {/* --- Иконки сайта (Favicon) для всех устройств --- */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#1a202c" />
        <meta name="theme-color" content="#1a202c" />
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
