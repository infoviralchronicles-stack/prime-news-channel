import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Prime News Channel - primenewschannel.com',
  description: 'Democracy Dies in Darkness. Official autonomous publication of primenewschannel.com. In-depth world, business, technology and political investigative reporting.',
  keywords: ['Prime News Channel', 'The Washington Post Style', 'Investigative Journalism', 'World News', 'Business News'],
  authors: [{ name: 'Prime News Post' }],
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-[#111111]">
        <Header />
        <main className="flex-1 max-w-[1550px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
