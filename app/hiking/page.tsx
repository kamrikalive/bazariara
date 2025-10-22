
import ProductCard from '@/components/ProductCard';
import { firestore } from '@/lib/firebase/server';

// Define the Product type
interface Product {
    id: string;
    image_url: string;
    title: string;
    category: string;
    description: string;
    price: number;
}

async function getHikingProducts(): Promise<Product[]> {
    const snapshot = await firestore.collection('hiking').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return products;
}

export default async function HikingPage() {
    const products = await getHikingProducts();

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold my-8">Hiking</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
