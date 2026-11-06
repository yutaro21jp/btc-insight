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

## 公開ページのキャッシュ

公開ページはHTMLをキャッシュして配信し、再検証間隔を共通レイアウトで24時間に設定しています。記事・カテゴリ・タグ・著者ページは初回アクセス時に生成して以後はキャッシュを使います。新しいslugもデプロイせずに表示できます。再検証はアクセスを契機に行われ、常時24時間ごとに処理が動くわけではありません。

既存のSanity更新通知先 `POST /api/revalidate` とBearer認証は維持しています。対応するタグへの通知で次回アクセス時に更新し、通知がない場合は24時間経過後のアクセスで再生成します。再生成中は以前のキャッシュを返す場合があります。SanityのCDN反映時間もあるため、厳密な即時反映の保証ではありません。

CPU削減の確認では、公開後の記事URLで繰り返しアクセスがCDN HITになることと、VercelのActive CPU・Function Invocationsを同じ期間・プロジェクトで比較します。アクセス数やbot巡回で値が変わるため、削減率は公開後の実測で判断します。
