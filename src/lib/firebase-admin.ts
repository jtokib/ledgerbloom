
import * as admin from 'firebase-admin';

// Configuration is still defined at the top level
const firebaseConfig = {
  "projectId": "ledgerbloom",
  "appId": "1:826516699519:web:123983de7b8f2d5a5c824a",
  "storageBucket": "ledgerbloom.firebasestorage.app",
  "apiKey": process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  "authDomain": "ledgerbloom.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "826516699519"
};

// Singleton pattern to ensure single initialization
let app: admin.app.App;

// Export app for use in other modules
export { app };

function getFirebaseAdminApp() {
  if (!app) {
    if (admin.apps.length === 0) {
      // Try service account key first, fallback to application default
      const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      
      let credential;
      if (serviceAccountKey) {
        try {
          const serviceAccount = JSON.parse(serviceAccountKey);
          credential = admin.credential.cert(serviceAccount);
        } catch (error) {
          console.warn('Invalid FIREBASE_SERVICE_ACCOUNT_KEY, using application default');
          credential = admin.credential.applicationDefault();
        }
      } else {
        // For development/Firebase Studio compatibility
        credential = admin.credential.applicationDefault();
      }

      admin.initializeApp({
        credential,
        projectId: firebaseConfig.projectId,
        databaseURL: `https://${firebaseConfig.projectId}-default-rtdb.firebaseio.com`
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
