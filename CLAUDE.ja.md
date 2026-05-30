# 桃花台コードクラブ — Claude 向けプロジェクトガイド（日本語版）

## プロジェクト概要

**桃花台コードクラブ**（Tokadai）の静的 HTML ウェブサイト。  
桃花台 周辺エリア（小牧市東部・春日井市・高蔵寺）の 7〜17 歳の子どもたちのための無料プログラミングクラブ。2026年夏以降の活動開始を予定。

## ファイル構成

```
index.html      トップページ（ヒーロー・about・特徴・カリキュラム・次回開催・統計・ボランティア）
news.html       お知らせ一覧
venue.html      開催場所・アクセス情報
contact.html    お問い合わせ・参加申込みフォーム
mentor.html     メンター募集ページ
style.css       共通スタイルシート（通常編集不要）
script.js       動作スクリプト（アニメーション・季節演出・フォーム処理）
events.js       ★ 開催予定管理ファイル（毎回の開催前に更新）
i18n.js         ★ 多言語テキスト管理（テキスト追加・変更時に編集）
favicon*.svg    ページ別ファビコン
運用方法.txt    運用方法の解説書（この文書より詳細）
scripts/
  check-i18n.py       i18n 整合性チェックスクリプト
  hook-check-i18n.sh  Claude Code 用自動チェックフック
.claude/
  settings.json       フック設定
```

## 開催スケジュール

**時間: 13:30 〜 15:30（2時間）**
- 13:15 — メンター集合・準備
- 13:30 — 開始・ニンジャ受付
- 13:45〜15:10 — コーディングタイム
- 15:10〜15:25 — 作品発表・シェアタイム
- 15:30 — 終了・メンター振り返り

頻度：月1回、いずれかの日曜日。

## 重要ルール

### 開催日程の変更は events.js を更新する
`events.js` がサイト全体の「次回開催」情報の唯一のソース。  
各ページは `data-ev` 属性で自動反映される。  
日程確定時は `tbd: false` にし、`date`・`dayOfWeek`・`connpassUrl` を設定する。

### UI テキストの唯一のソースは i18n.js
翻訳対象テキストはすべて `i18n.js` の `ja`・`en`・`pt`・`vi`・`es`・`zh` セクションで管理。  
HTML に `data-i18n` / `data-i18n-html` 属性を追加したら、**全6言語**に同じキーのエントリを追加すること。  
HTML 要素のテキストは `i18n.js[ja]` の値と完全一致させる（pre-edit フックで自動検証）。

### i18n チェックを手動実行する方法
```bash
python3 scripts/check-i18n.py
```
正常時の出力: `i18n check: OK — all keys present and ja defaults match`

### venue.html と news.html はHTML直書き部分あり
- `venue.html` — 住所・地図 iframe の src
- `news.html` — 各記事の本文（多言語化されていない）

これらは i18n.js ではなく HTML ファイルを直接編集する。

### contact.html には時間の直書きあり
contact.html 内「次回開催」リマインダーボックスに `data-ev` も `data-i18n` も使わない平文の時間文字列がある。  
開催時間を変更したときは手動で合わせること。

## 対応言語

| コード | 言語 |
|--------|------|
| ja | 日本語（デフォルト）|
| en | 英語 |
| pt | ポルトガル語 |
| vi | ベトナム語 |
| es | スペイン語 |
| zh | 中国語（簡体字）|

## よくある作業

### 次回開催日を更新する
1. `events.js` を開く
2. `tbd: false` に変更し、`date`（`YYYY-MM-DD`）・`dayOfWeek`・`connpassUrl` を設定

### お知らせ記事を追加する
`news.html` の `#newsList` 最上部に `<article class="news-card ...">` ブロックを追加。  
テンプレートは `運用方法.txt` の §2 を参照。

### UI テキストを変更する
`i18n.js` の該当キーを全6言語で編集。  
`python3 scripts/check-i18n.py` でエラーなしを確認。

### 開催場所の情報を更新する
`venue.html` を直接編集（住所 `<dd>`・地図 `<iframe src="...">`）。

## 自動チェックの仕組み

`.html` ファイルまたは `i18n.js` を Claude Code で編集すると、  
`hook-check-i18n.sh` が自動実行され、以下を検証する:
1. HTML 内の `data-i18n` / `data-i18n-html` キーが `i18n.js` 全言語セクションに存在するか
2. HTML のデフォルトテキストと `i18n.js[ja]` 値が一致しているか
