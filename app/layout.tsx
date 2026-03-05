'use client';

import './globals.css';
import '../zeus-icons.js';
import '../zeus-styles.css';
import { Inter } from 'next/font/google'
import Script from 'next/script';
import { Providers } from '@/components/Providers';
import { ComponentSelectorHelper } from '@/components/component-selector-helper';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <Providers>
          <ComponentSelectorHelper />
          {children}
        </Providers>
        <Script src="http://localhost:3030/inspector-client.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}