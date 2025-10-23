import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { RootLayoutClient } from './root-layout-client';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'ClubNath',
  description: 'A comunidade de fé e acolhimento que toda mãe precisa.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#E9A891" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <RootLayoutClient>
            {children}
          </RootLayoutClient>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
