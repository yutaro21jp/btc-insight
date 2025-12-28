import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const defaultTitle = 'BTCインサイト';
const defaultDescription = 'ビットコインの最新ニュースを日本語で、わかりやすく。';
const defaultOgImage = new URL('/no-image.png', siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: defaultTitle,
  description: defaultDescription,
  icons: {
    icon: '/btc-insight-logo.png',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName: defaultTitle,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'BTCインサイト ロゴ',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
