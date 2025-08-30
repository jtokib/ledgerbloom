
import * as admin from 'firebase-admin';

const firebaseConfig = {
  "projectId": "ledgerbloom",
  "appId": "1:826516699519:web:123983de7b8f2d5a5c824a",
  "storageBucket": "ledgerbloom.firebasestorage.app",
  "apiKey": "AIzaSyDcgty6AvlLVEiWYqxg59IQ8Mv2r9sz5Ok",
  "authDomain": "ledgerbloom.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "826516699519"
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
  });
}

export const app = admin.apps[0]!;
export const db = admin.firestore(app);
export const storage = admin.storage(app);
export const auth = admin.auth(app);

    