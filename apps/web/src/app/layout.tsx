import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@boilerplate/store';
import { Navigation } from '@/components/Navigation';
import '@boilerplate/ui/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cross-Platform Boilerplate',
  description: 'Modern cross-platform application boilerplate',
  keywords: ['React', 'Next.js', 'React Native', 'Electron', 'TypeScript'],
  authors: [{ name: 'Your Name' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <QueryProvider>
          <div className="min-h-full bg-background text-foreground">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
