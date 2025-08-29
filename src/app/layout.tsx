
'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseAppProvider, AuthProvider } from 'reactfire';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';

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
        <FirebaseAppProvider firebaseApp={app}>
          <AuthProvider sdk={getAuth(app)}>
            {children}
            <Toaster />
          </AuthProvider>
        </FirebaseAppProvider>
      </body>
    </html>
  );
}
