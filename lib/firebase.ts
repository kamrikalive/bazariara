
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'bazarge-95f65',
  });
}

const db = admin.firestore();

export { db };
