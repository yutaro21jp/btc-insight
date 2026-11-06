![BTC Insight Header](/public/images/common/btc-insight-header.webp)

BTCインサイトは、「ビットコインの最新ニュースを、日本語で、わかりやすく」提供するサイトです。

## ニュースレター

https://diamondhandscommunity.substack.com/t/btc-insight

## 特徴

- ビットコインに関する最新ニュースと洞察
- 技術的な解説とトレンドの追跡
- 海外ニュースと各国カンファレンス情報
- ビットコイナー反省会文字起こし　他

## スポンサー

- ビットコイン保有者向けの究極のハードウェアウォレット：Jade Plus 様
- ビットコイン保有者向けの理想のモバイルウォレット：Blockstream App 様
- ビットコイン関連商品がライトニング決済と匿名配送で買える：Lightning Base 様

## ロゴ

<img src="/public/images/common/btc-insight-logo.webp" alt="BTCインサイト" width="150" height="150">

ビットコインの情報をキャッチするアンテナをモチーフにしています。

## 後援

<img src="/public/images/common/DH-MAGAZINE.webp" alt="DH MAGAZINE" width="150" height="150">

https://diamondhandscommunity.substack.com

## 貢献

このプロジェクトへの貢献を歓迎いたします。 バグ報告、機能提案、プルリクエストなど、お気軽にお寄せください。

## 開発

Node.js 24.xとnpmを使用します。`.nvmrc`、`package.json`、CIでバージョンを揃えています。
開発・本番ビルドは、既存構成を引き継いでWebpackを使用します。

```sh
nvm install
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

`http://localhost:3000` で確認できます。CMSへの接続やAPIキーは不要です。
本番環境では `NEXT_PUBLIC_BASE_URL` にサイトの公開URLを設定してください。

## 記事の追加

記事は `content/posts/*.md` で管理します。ファイル名が記事のURLになります。
例えば `bitcoin-basics.md` は `/blog/bitcoin-basics` です。ファイル名には半角英小文字・数字・ハイフンを使います。

```sh
cp content/templates/article.md content/posts/bitcoin-basics.md
```

```markdown
---
title: 'ビットコインの基本'
date: '2026-11-06'
description: 'ビットコインの基本的な仕組みを解説します。'
author: yutaro
categories:
  - name: 基礎知識
    slug: basics
tags:
  - name: Bitcoin
    slug: bitcoin
draft: true
---

## ビットコインとは

ここに本文を書きます。
```

- 必須項目は `title`、`date`、`description` です。本文も空にできません。
- `draft: false` を明示した記事だけが公開対象です。省略した場合は下書きになります。
- 下書きは記事ページ・一覧・カテゴリ・タグ・関連記事・サイトマップに含まれません。
- **公開Repo内のファイルは下書きも閲覧できます。機密情報は置かないでください。**
- `date` は `YYYY-MM-DD` 形式です。表示順に使用し、予約公開の機能はありません。
- 任意で `updated`、`image`、`showImage`、`author`、`categories`、`tags`、`faq` を設定できます。未知の項目や不正な値は検証エラーになります。
- `updated` は更新日です。`image: /images/posts/bitcoin-basics.webp` でカバー画像を指定できます。画像は `public/images/posts/` に置きます。HTTPS画像も使用できます。
- `showImage: false` にすると、カバー画像を記事本文の先頭に表示しません。
- `categories` と `tags` は `name`（表示名）と `slug`（URL）の配列です。`slug` には半角英小文字・数字・ハイフンを使います。例えば `name: 基礎知識`、`slug: basics` は `/categories/basics` になります。同じ分類には同じ名前とslugを使ってください。表示名を変更してもURLを維持できます。
- `author` を使う場合は `content/authors.json` のキーを指定します。名前・画像に加え、略歴 (`bio`)、肩書き (`title`)、所属 (`organization`)、拠点 (`location`)、専門領域 (`expertise`)、実績 (`achievements`)、資格 (`credentials`)、SNS (`socialLinks`) を設定できます。SNSは `nostr`、`x`、`github` のHTTPS URLを指定します。
- `welcome.md` を公開した場合は、トップページの先頭に固定表示します。

### 本文の書式

見出しは `##` から始めます。画像・リスト・引用・コードブロック・表・打ち消し線など、通常のMarkdownとGFMに対応しています。HTMLやJSXは実行・表示しません。
YouTube動画やXの投稿は、URLだけを独立した段落に書くと埋め込み表示になります。通常のラベル付きリンクはリンクのまま表示されます。

```markdown
![画像の説明](/images/posts/bitcoin-basics.webp)

https://www.youtube.com/watch?v=VIDEO_ID

https://x.com/username/status/1234567890

## 参考資料

- [資料のタイトル](https://example.com/)
```

FAQは任意で以下のように指定できます。

```yaml
faq:
  - question: '質問文'
    answer: '回答文'
```

### 確認と公開

ローカルで表示を確認する場合は、対象記事の `draft` を `false` にして `npm run dev` で開きます。
公開対象の記事・画像・変更内容を確認したうえで、デプロイしてください。記事の追加・修正・削除は新しいビルドで反映されます。

```sh
npm run check:content
npm run audit
npm run format:check
npm run lint
npm test
npm run build
npm run typecheck
npm start
```

`npm run build` は下書きを含む全記事のメタ情報を検証し、公開対象のページを静的に生成します。
Webhookや定期再取得は使いません。記事がゼロ件でもビルドできます。
削除した記事や存在しないURLはHTTP 404となり、リニューアル案内とホーム・記事一覧へのリンクを表示します。
GitHub ActionsでもLint・テスト・ビルド・型チェックを実行します。
コードの書式はPrettierで統一します。変更後は `npm run format` で整えられます。

### 依存関係の監査

`npm run audit` で開発用を含む依存関係を検査し、CIでも実行します。
上流パッケージに残る脆弱な `glob`・`minimatch` の系列を `package.json` の `overrides` で修正版に揃えています。
Next.jsの設定が対応するESLint 10を使い、プラグインの古いpeer指定もルートのESLintバージョンに統一しています。上流の依存指定が更新されたら、監査・Lint・ビルドを確認したうえで解除できます。

## 構成

```text
app/                   ページ・404・サイトマップ
components/            共通UIとMarkdown表示
content/posts/         記事 (.md)
content/templates/     記事のひな形（公開対象外）
content/authors.json   執筆者情報
lib/posts.ts           記事の読み込み・検証・絞り込み
lib/site.ts            URL・日付・メタデータの共通処理
public/images/         ロゴ・記事画像
scripts/               記事検証・画像変換
tests/                 記事の公開条件とメタ情報のテスト
```
