
'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseAppProvider, AuthProvider } from 'reactfire';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Playfair_Display, PT_Sans } from 'next/font/google';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfairDisplay.variable} ${ptSans.variable}`}>
      <head />
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
