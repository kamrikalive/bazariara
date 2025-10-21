
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  projectId: 'bazarge-95f65'
});

const db = admin.firestore();

async function migrateCollections() {
  // 1. Move gre_garden_items to garden
  const greGardenSnapshot = await db.collection('gre_garden_items').get();
  const gardenCollectionRef = db.collection('garden');
  const batch = db.batch();

greGardenSnapshot.forEach(doc => {
    const newDocRef = gardenCollectionRef.doc(doc.id);
    batch.set(newDocRef, doc.data());
  });

  await batch.commit();
  console.log('Successfully moved items from "gre_garden_items" to "garden".');

  // 2. Delete old gre_garden_items collection
  const deleteGreGardenBatch = db.batch();
  greGardenSnapshot.forEach(doc => {
    deleteGreGardenBatch.delete(doc.ref);
  });
  await deleteGreGardenBatch.commit();
  console.log('Old "gre_garden_items" collection deleted.');

  // 3. Delete hiking collection
  const hikingSnapshot = await db.collection('hiking').get();
  const deleteHikingBatch = db.batch();
  hikingSnapshot.forEach(doc => {
    deleteHikingBatch.delete(doc.ref);
  });
  await deleteHikingBatch.commit();
  console.log('"hiking" collection deleted.');

}

migrateCollections().catch(console.error);
