import { firestore } from '@/lib/firebase/server';
import CardList from '@/components/CardList';

async function getHikingItems() {
  const snapshot = await firestore.collection('items').where('category', '==', 'hiking').get();
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return items;
}

export default async function HikingPage() {
  const items = await getHikingItems();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Товары для отдыха</h1>
      </div>
      {/* @ts-ignore */}
      <CardList items={items} />
    </div>
  )
}
