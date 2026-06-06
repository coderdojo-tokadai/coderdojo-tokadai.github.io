# 桃花台コードクラブ (Tokadai)

桃花台 周辺エリア（小牧市東部・春日井市・高蔵寺）の子どもたちのための無料プログラミング・クラブ、**桃花台コードクラブ**の公式ウェブサイトです。

## 概要

| 項目 | 内容 |
|------|------|
| 対象 | 小学生〜高校生の子どもたち |
| 参加費 | 無料 |
| 開催日 | いずれかの日曜日（第0回 準備会は2026年8月30日） |
| 時間 | 13:30 〜 15:30（2時間） |
| 場所 | 小牧市東部市民センター 2F 学習室 |
| 開催エリア | 桃花台 周辺（小牧市東部・春日井市・高蔵寺） |

## 技術仕様

- 静的 HTML / CSS / JavaScript（フレームワーク不使用）
- 多言語対応：日本語・英語・ポルトガル語・ベトナム語・スペイン語・中国語（簡体字）・インドネシア語
- 季節別ヒーロービジュアル（春・夏・秋・冬で自動切替）

## ファイル構成

```
index.html        トップページ
news.html         お知らせ一覧
venue.html        開催場所・アクセス
contact.html      お問い合わせ・参加申込み
mentor.html       メンター募集
style.css         スタイルシート
script.js         動作スクリプト（アニメーション・季節演出・フォーム）
events.js         開催予定管理（定期更新）
i18n.js           多言語ランタイム（言語切替・適用）
i18n/             言語別テキスト（ja・en・pt・vi・es・zh・id の JSON）
favicon*/logo*    ページ別ファビコン・ロゴ（SVG / PNG）
scripts/          i18n チェック・フック
運用方法.md      運用マニュアル
```

## 開催予定の更新方法

`events.js` を編集するだけで、サイト全体の「次回開催」情報が自動更新されます。

```js
{
  id:          25,
  tbd:         false,           // 日程確定: false
  date:        '2026-09-06',    // YYYY-MM-DD
  dayOfWeek:   '日',
  startTime:   '13:30',
  endTime:     '15:30',
  seasonEmoji: '🌿',
  monthLabel:  '9月',
  venue:       '小牧市東部市民センター2F 学習室',
  connpassUrl: 'https://connpass.com/event/xxxxxxx/',
  notes:       '',
},
```

詳しくは `運用方法.md` を参照してください。

## ローカル開発

```bash
# 静的ファイルなのでブラウザで直接開くだけで動作します
open index.html

# または任意の HTTP サーバーで確認
npx serve .
python3 -m http.server 8000
```

## i18n チェック

HTML と `i18n/*.json`（`ja.json` を基準）の整合性を確認します。

```bash
python3 scripts/check-i18n.py
```

## Claude Code を使う場合

`CLAUDE.md`（英語）または `CLAUDE.ja.md`（日本語）を参照してください。  
`.html`・`i18n.js`・`i18n/*.json` を編集すると i18n チェックが自動実行されます。

## ライセンス

© 2026 桃花台コードクラブ (Tokadai). Powered by volunteers. 🌸
