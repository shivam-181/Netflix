import type { Metadata } from 'next';
import GlobalStylesProvider from '../components/GlobalStylesProvider';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: {
    template: '%s - Netflix',
    default: 'Netflix',
  },
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
          <Navbar />
          {children}
        </GlobalStylesProvider>
      </body>
    </html>
  );
}