
"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="w-full border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* 左：ロゴ */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/btc-insight-header.png" // ロゴ画像パス
            alt="BTCインサイト"
            width={192}
            height={192}
          />
        </Link>

        {/* ハンバーガーメニューボタン（モバイル用） */}
        <button
          className="md:hidden flex items-center px-3 py-2 border rounded text-purple-700 border-purple-700 hover:text-purple-900 hover:border-purple-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-6z" />
          </svg>
        </button>

        {/* 右：ナビゲーション（デスクトップ用） */}
        <nav className="hidden md:flex space-x-6 text-purple-700 text-sm sm:text-base font-medium">
          <Link href="/">ホーム</Link>
          <Link href="/blog">ブログ</Link>
          <Link href="https://diamondhandscommunity.substack.com/about" target="_blank" rel="noopener noreferrer">後援</Link>
          <Link href="https://diamondhandscommunity.substack.com/t/btc-insight" target="_blank" rel="noopener noreferrer">ニュースレター</Link>
        </nav>
      </div>

      {/* モバイルメニュー */}
      {isOpen && (
        <div className="md:hidden bg-white border-b">
          <nav className="flex flex-col items-center py-4 space-y-4 text-purple-700 text-base font-medium">
            <Link href="/" onClick={() => setIsOpen(false)}>ホーム</Link>
            <Link href="/blog" onClick={() => setIsOpen(false)}>ブログ</Link>
            <Link href="https://diamondhandscommunity.substack.com/about" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>後援</Link>
            <Link href="https://diamondhandscommunity.substack.com/t/btc-insight" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>ニュースレター</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
