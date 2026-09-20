import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://primenewschannel.com'),
  title: {
    default: 'Prime News Channel - 24/7 Global Breaking, Business & Tech Journalism',
    template: '%s | Prime News Channel',
  },
  description: 'Democracy Dies in Darkness. Official autonomous publication of primenewschannel.com. In-depth world, business, technology and political investigative reporting.',
  keywords: [
    'Prime News Channel',
    'Prime News',
    'primenewschannel.com',
    'Breaking News',
    'World News Today',
    'Business and Market Analysis',
    'Technology News and AI',
    'Investigative Journalism',
    'Live News Stream'
  ],
  authors: [{ name: 'Prime News Network' }],
  creator: 'Prime News Channel',
  publisher: 'Prime News Channel',
  alternates: {
    canonical: 'https://primenewschannel.com',
  },
  openGraph: {
    title: 'Prime News Channel - Global Breaking, Business & Tech Journalism',
    description: 'Autonomous, 24/7 in-depth world, business, technology and investigative reporting.',
    url: 'https://primenewschannel.com',
    siteName: 'Prime News Channel',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Prime News Channel Live Broadcaster',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prime News Channel - Latest Breaking News',
    description: 'Autonomous, 24/7 in-depth world, business, and technology reporting.',
    images: ['https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'Prime News Channel',
    url: 'https://primenewschannel.com',
    logo: 'https://primenewschannel.com/icon.png',
    sameAs: ['https://primenewschannel.com'],
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
