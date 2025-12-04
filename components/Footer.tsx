
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between md:items-center">
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 order-1 md:order-2">
            <Link href="/" className="text-gray-500 hover:text-gray-900">ホーム</Link>
            <Link href="/blog" className="text-gray-500 hover:text-gray-900">ブログ</Link>
            <Link href="https://diamondhandscommunity.substack.com" className="text-gray-500 hover:text-gray-900" target="_blank" rel="noopener noreferrer">後援</Link>
            <Link href="https://diamondhandscommunity.substack.com/t/btc-insight" className="text-gray-500 hover:text-gray-900" target="_blank" rel="noopener noreferrer">ニュースレター</Link>
          </nav>
          <div className="text-sm text-gray-500 order-2 md:order-1 text-center md:text-left">
            &copy; {new Date().getFullYear()} BTCインサイト. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
