import { Suspense } from 'react';
import type { Metadata } from 'next';
import GlobalStylesProvider from '../components/GlobalStylesProvider';
import Navbar from '@/components/layout/Navbar';

import TitleManager from '@/components/layout/TitleManager';

export const metadata: Metadata = {
  title: 'Home – Netflix',
  description: 'Watch TV Shows Online, Watch Movies Online',
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