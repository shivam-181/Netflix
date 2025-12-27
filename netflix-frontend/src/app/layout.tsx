import { Suspense } from 'react';
import type { Metadata } from 'next';
import GlobalStylesProvider from '../components/GlobalStylesProvider';
import Navbar from '@/components/layout/Navbar';

import TitleManager from '@/components/layout/TitleManager';

export const metadata: Metadata = {
  title: 'Netflix India – Watch Shows Online, Watch Movies Online',
  description: 'Watch Netflix movies & TV shows online or stream right to your smart TV, game console, PC, Mac, mobile, tablet and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GlobalStylesProvider>
          <Suspense fallback={null}>
            <Navbar />
            <TitleManager />
          </Suspense>
          {children}
        </GlobalStylesProvider>
      </body>
    </html>
  );
}