import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Prime News Channel - Latest Breaking World, Tech & Business News',
  description: 'Official 24/7 Auto-Publishing News Portal for primenewschannel.com. Verified global breaking news, business insights, sports, and tech innovations.',
  keywords: ['Prime News Channel', 'Prime News', 'Breaking News', 'Technology News', 'World News', 'Live Updates'],
  authors: [{ name: 'Prime News Network' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-[#141414]">
        <Header />
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
