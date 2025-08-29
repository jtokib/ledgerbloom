
'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseAppProvider } from 'reactfire';
import { AuthProvider, getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';

const firebaseConfig = {
  projectId: "ledgerbloom",
  appId: "1:826516699519:web:123983de7b8f2d5a5c824a",
  storageBucket: "ledgerbloom.firebasestorage.app",
  apiKey: "AIzaSyDcgty6AvlLVEiWYqxg59IQ8Mv2r9sz5Ok",
  authDomain: "ledgerbloom.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "826516699519"
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseAppProvider firebaseConfig={firebaseConfig} firebaseApp={app}>
          <AuthProvider sdk={getAuth(app)}>
            {children}
            <Toaster />
          </AuthProvider>
        </FirebaseAppProvider>
      </body>
    </html>
  );
}
