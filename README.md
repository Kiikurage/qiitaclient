# QiitaClient

QiitaのクライアントWebアプリ

https://temperman.github.io/qiitaclient/

# Support Browser
- [x] Chrome
- [ ] FF
- [ ] Safari
- [ ] IE
- [ ] iOS Safari
- [x] Chrome for Android 最新版

# 特長
- ServiceWorkerやらCustomElementやらWebの最新技術を使用
  - 例えばChrome for Androidの場合、メニューの「ホーム画面に追加」を押すと、ネイティブアプリのように使うことが可能

# 課題
- [ ] 基本機能
  - [x] ログイン/ログアウト
  - [x] 記事一覧の取得
  - [ ] 記事の検索
  - [ ] 記事を表示
  - [ ] コメント
  - [ ] ストック
  - [ ] フォロー
  - [ ] 記事の投稿・編集
  - [ ] アカウント情報の編集

- [ ] Contribute数の取得
  - [ ] APIが提供されていないので自力でWebPageをスクレイピング

- [ ] GithubPage以外のまともなホスティング環境の用意
- [ ] Push通知の機構
  - [ ] サーバー側の実装
  - [ ] フロント側の実装

- [ ] データのキャッシュ
  - [ ] 記事・ユーザー情報をIndexedDBでキャッシュ
  - [ ] 画像をServiceWorkerでキャッシュ

- [ ] オフラインスケジューリング
  - [ ] オフライン時につけたstock情報/投稿記事をオンラインになった時に同期
  - [ ] 人気記事を事前読み込み
  - [ ] フィードをバックグラウンドで読み込み、おすすめの記事を通知

- [ ] チューンナップ
  - [ ] ネイティブアプリと区別の付かないUXの提供
