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
        url: new URL('/icon_96x96.png', siteUrl).toString(),
        width: 96,
        height: 96,
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
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon_32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icon_96x96.png" />
        <link rel="icon" type="image/png" sizes="128x128" href="/icon_128x128.png" />
        <link rel="icon" type="image/png" sizes="256x256" href="/icon_256x256.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon_512x512.png" />
        <link rel="apple-touch-icon" sizes="128x128" href="/icon_128x128.png" />
        <link rel="manifest" href="/site.webmanifest" />
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
