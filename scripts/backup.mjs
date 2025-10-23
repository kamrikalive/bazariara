
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs/promises';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
      throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable');
    }
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountKey);
    } catch (e) {
      const decodedKey = Buffer.from(serviceAccountKey, 'base64').toString('utf8');
      serviceAccount = JSON.parse(decodedKey);
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Firebase Admin SDK initialization error', error);
    process.exit(1);
  }
}

const firestore = getFirestore();

async function backupDatabase() {
  const collectionsToBackup = ['garden', 'hiking'];
  const backupData = {};

  console.log('Starting database backup...');

  try {
    for (const collectionName of collectionsToBackup) {
      console.log(`Backing up collection: ${collectionName}`);
      const collectionRef = firestore.collection(collectionName);
      const snapshot = await collectionRef.get();

      if (snapshot.empty) {
        console.log(`Collection ${collectionName} is empty. Skipping.`);
        backupData[collectionName] = [];
        continue;
      }

      const collectionData = [];
      snapshot.forEach(doc => {
        collectionData.push({ id: doc.id, ...doc.data() });
      });
      backupData[collectionName] = collectionData;
      console.log(`Successfully backed up ${collectionData.length} documents from ${collectionName}.`);
    }

    // Write the backup data to a file
    await fs.writeFile('firestore-backup.json', JSON.stringify(backupData, null, 2));
    console.log('Database backup successfully saved to firestore-backup.json');

  } catch (error) {
    console.error('Error during database backup:', error);
    process.exit(1);
  }
}

backupDatabase();
