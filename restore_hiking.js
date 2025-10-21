
const admin = require('firebase-admin');
const fs = require('fs').promises;

// Initialize Firebase Admin SDK
admin.initializeApp({
  projectId: 'bazarge-95f65'
});

const db = admin.firestore();

async function deleteCollection(collectionPath) {
  const collectionRef = db.collection(collectionPath);
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
}

async function restoreHikingCollection() {
  console.log('Deleting existing documents from "hiking" collection...');
  await deleteCollection('hiking');
  console.log('Successfully deleted existing documents.');

  const data = await fs.readFile('products.json', 'utf8');
  const products = JSON.parse(data);

  const batch = db.batch();
  const hikingCollectionRef = db.collection('hiking');

  console.log('Adding new documents to "hiking" collection...');
  products.forEach(product => {
    const docRef = product.id ? hikingCollectionRef.doc(String(product.id)) : hikingCollectionRef.doc();
    batch.set(docRef, product);
  });

  await batch.commit();

  console.log('Successfully restored the "hiking" collection with all products from products.json.');
}

restoreHikingCollection().catch(console.error);
