# 桃花台コードクラブ — Claude 向けプロジェクトガイド（日本語版）

## プロジェクト概要

**桃花台コードクラブ**（Tokadai）の静的 HTML ウェブサイト。  
桃花台 周辺エリア（小牧市東部・春日井市・高蔵寺）の小学生〜高校生の子どもたちのための無料プログラミング・クラブ。第0回「準備会」は2026年8月30日に開催。

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
i18n.js         多言語ランタイム（言語切替・適用。テキストは含まない）
i18n/           ★ 言語別 UI テキスト — ja・en・pt・vi・es・zh・id の *.json
favicon*/logo*  ページ別ファビコン・ロゴ（SVG / PNG）
運用方法.md    運用方法の解説書（この文書より詳細）
scripts/
  check-i18n.py       i18n 整合性チェックスクリプト
  hook-check-i18n.sh  編集後（PostToolUse）に check-i18n.py を自動実行するフック
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

頻度：いずれかの日曜日。

## 重要ルール

### 開催日程の変更は events.js を更新する
`events.js` がサイト全体の「次回開催」情報の唯一のソース。各ページは `data-ev` 属性で自動反映される。**日付・会場・開催状況を HTML や i18n に直書きしないこと。**
日程確定時は `tbd: false` にし、`date`・`startTime`/`endTime`・`venue`・`connpassUrl` を設定する。曜日・季節アイコン・「○月」表記は `date` から自動計算される。任意項目（`label`・`kind`・`audience`・`capacity`・`fee`・`deadline`/`deadlineTime`・`summary`）は、値があれば自動表示・無ければ自動で省略される。

### UI テキストの唯一のソースは i18n/*.json
翻訳対象テキストはすべて `i18n/<lang>.json` で言語ごとに管理（`ja`・`en`・`pt`・`vi`・`es`・`zh`・`id`）。  
HTML に `data-i18n` / `data-i18n-html` 属性を追加したら、**全7言語**のファイルに同じキーのエントリを追加すること。  
HTML 要素のテキストは `i18n/ja.json` の値と完全一致させる（編集後フックで自動検証）。

### i18n チェックを手動実行する方法
```bash
python3 scripts/check-i18n.py
```
正常時の出力: `i18n check: OK — all keys present and ja defaults match`

### venue.html と news.html はHTML直書き部分あり
- `venue.html` — 地図 iframe の src（住所は i18n 管理。キー `venue-dd-address`）
- `news.html` — 各記事の本文（新規記事は多言語化対象外。直接編集する）

これらは HTML ファイルを直接編集する。ただし**例外**として開催場所の住所は `venue.html` ではなく全7言語の `i18n/*.json`（`venue-dd-address`）を編集する。

### 開催情報は data-ev 連動（日付の直書き禁止）
`index.html`・`contact.html`・`venue.html`・`news.html` の「次回開催」ボックスは、日付・時刻・会場・開催状況を `events.js` から `data-ev`（`status-line`・`date-short`・`date-text`・`deadline`・`audience` など）で表示している。HTML 側のテキストは JS 無効時のフォールバックにすぎない。変更は **ページではなく `events.js`** を編集すること。

## 対応言語

| コード | 言語 |
|--------|------|
| ja | 日本語（デフォルト）|
| en | 英語 |
| pt | ポルトガル語 |
| vi | ベトナム語 |
| es | スペイン語 |
| zh | 中国語（簡体字）|
| id | インドネシア語 |

## よくある作業

### 次回開催日を更新する
1. `events.js` を開く
2. `tbd: false` に変更し、`date`（`YYYY-MM-DD`）・`startTime`/`endTime`・`venue`・`connpassUrl` を設定（曜日・季節は自動。必要に応じて `label`・`audience`・`deadline` などの任意項目も）

### お知らせ記事を追加する
`news.html` の `#newsList` 最上部に `<article class="news-card ...">` ブロックを追加。  
テンプレートは `運用方法.md` の §2 を参照。

### UI テキストを変更する
各 `i18n/<lang>.json` の該当キーを全7言語で編集。  
`python3 scripts/check-i18n.py` でエラーなしを確認。

### 開催場所の情報を更新する
- 住所：全7言語の `i18n/*.json` の `venue-dd-address` を編集し、i18n チェックを実行。
- 地図：`venue.html` の `<iframe src="...">` を直接編集。

## 自動チェックの仕組み

`.html`・`i18n.js`・`i18n/*.json` を Claude Code で編集すると、編集後（PostToolUse）に  
`hook-check-i18n.sh` が自動実行され、以下を検証する:
1. HTML 内の `data-i18n` / `data-i18n-html` キーが `i18n/*.json` 全言語ファイルに存在するか
2. HTML のデフォルトテキストと `i18n/ja.json` 値が一致しているか
