
import * as admin from 'firebase-admin';

// Configuration is still defined at the top level
const firebaseConfig = {
  "projectId": "ledgerbloom",
  "appId": "1:826516699519:web:123983de7b8f2d5a5c824a",
  "storageBucket": "ledgerbloom.firebasestorage.app",
  "apiKey": "AIzaSyDcgty6AvlLVEiWYqxg59IQ8Mv2r9sz5Ok",
  "authDomain": "ledgerbloom.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "826516699519"
};

// Singleton pattern to ensure single initialization
let app: admin.app.App;

function getFirebaseAdminApp() {
  if (!app) {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
      });
    }
    app = admin.apps[0]!;
  }
  return app;
}

export function getDb() {
  return admin.firestore(getFirebaseAdminApp());
}

export function getStorage() {
  return admin.storage(getFirebaseAdminApp());
}

export function getAuth() {
  return admin.auth(getFirebaseAdminApp());
}
