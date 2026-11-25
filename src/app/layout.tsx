import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://saraswathylab.com'),
  title: 'Saraswathy Lab & Medicals | Accurate Diagnostics in Coimbatore',
  description: 'Saraswathy Lab & Medicals provides reliable blood tests, thyroid panels, diabetes screenings, and routine pathology diagnostics in Sundarapuram, Coimbatore. Serving patients since 1986.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Saraswathy Lab & Medicals | Accurate Diagnostics in Coimbatore',
    description: 'Trusted local diagnostic laboratory and pharmacy in Coimbatore since 1986.',
    url: 'https://saraswathylab.com',
    siteName: 'Saraswathy Lab & Medicals',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://saraswathylab.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'Saraswathy Lab & Medicals Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saraswathy Lab & Medicals | Accurate Diagnostics in Coimbatore',
    description: 'Trusted local diagnostic laboratory and pharmacy in Coimbatore since 1986.',
    images: ['https://saraswathylab.com/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
