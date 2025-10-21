import { firestore } from '@/lib/firebase/server';
import CardList from '@/components/CardList';

async function getLeisureItems() {
  const snapshot = await firestore.collection('items').where('category', '==', 'leisure').get();
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return items;
}

export default async function LeisurePage() {
  const items = await getLeisureItems();

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
