
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  projectId: 'bazarge-95f65'
});

const db = admin.firestore();

async function updateCategory() {
  const gardenCollectionRef = db.collection('garden');
  const snapshot = await gardenCollectionRef.get();

  if (snapshot.empty) {
    console.log('No documents found in the "garden" collection.');
    return;
  }

  const batch = db.batch();
  snapshot.forEach(doc => {
    const docRef = gardenCollectionRef.doc(doc.id);
    batch.update(docRef, { category: 'Сад' });
  });

  await batch.commit();
  console.log('Successfully updated the category for all products in the "garden" collection to "Сад".');
}

updateCategory().catch(console.error);
