import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { serializeJsonLd, siteUrl } from '@/lib/site'

export const metadata = {
  title: 'BTCインサイト',
  description: 'ビットコインの最新ニュースを日本語で、わかりやすく。',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BTCインサイト',
  url: siteUrl,
  logo: new URL('/images/common/btc-insight-logo.webp', siteUrl).toString(),
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BTCインサイト',
  url: siteUrl,
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd([organizationJsonLd, websiteJsonLd]) }}
      />
      <Header />
      <main className="max-w-7xl mx-auto px-4">{children}</main>
      <Footer />
    </>
  )
}
