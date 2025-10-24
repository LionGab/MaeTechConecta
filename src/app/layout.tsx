import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { RootLayoutClient } from './root-layout-client';
import { FirebaseClientProvider } from '@/firebase';
import { cn } from '@/lib/utils';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'ClubNath',
  description: 'A comunidade de fé e acolhimento que toda mãe precisa.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
      </head>
      <body className={cn('antialiased', fontBody.variable, fontHeadline.variable)}>
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
