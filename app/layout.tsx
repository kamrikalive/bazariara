import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'MarketGE',
  description: 'A one-stop shop for all your needs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-800 p-4 shadow-md">
          <div className="container mx-auto flex justify-between">
            <div className="flex space-x-4">
              <Link href="/" className="text-white hover:text-gray-300 transition-colors duration-300">
                All Products
              </Link>
              <Link href="/gre-garden" className="text-white hover:text-gray-300 transition-colors duration-300">
                Gre Garden
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
