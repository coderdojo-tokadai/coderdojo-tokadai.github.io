# CoderDojo 桃花台 (Tokadai)

桃花台 周辺エリア（小牧市東部・春日井市・高蔵寺）の子どもたちのための無料プログラミングクラブ、**CoderDojo 桃花台**の公式ウェブサイトです。

## 概要

| 項目 | 内容 |
|------|------|
| 対象 | 7〜17歳のお子さん |
| 参加費 | 無料 |
| 開催日 | 月1回、いずれかの日曜日 |
| 時間 | 13:30 〜 15:30（2時間） |
| 場所 | 小牧市東部の公共施設（2026年夏以降開始予定） |
| 開催エリア | 桃花台 周辺（小牧市東部・春日井市・高蔵寺） |

## 技術仕様

- 静的 HTML / CSS / JavaScript（フレームワーク不使用）
- 多言語対応：日本語・英語・ポルトガル語・ベトナム語・スペイン語・中国語（簡体字）
- 季節別ヒーロービジュアル（春・夏・秋・冬で自動切替）

## ファイル構成

```
index.html      トップページ
news.html       お知らせ一覧
venue.html      開催場所・アクセス
contact.html    お問い合わせ・参加申込み
mentor.html     メンター募集
style.css       スタイルシート
script.js       動作スクリプト
events.js       開催予定管理（定期更新）
i18n.js         多言語テキスト管理
運用方法.txt    運用マニュアル
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
  venue:       '小牧市東部の公共施設',
  connpassUrl: 'https://connpass.com/event/xxxxxxx/',
  notes:       '',
},
```

詳しくは `運用方法.txt` を参照してください。

## ローカル開発

```bash
# 静的ファイルなのでブラウザで直接開くだけで動作します
open index.html

# または任意の HTTP サーバーで確認
npx serve .
python3 -m http.server 8000
```

## i18n チェック

HTML と `i18n.js` の整合性を確認します。

```bash
python3 scripts/check-i18n.py
```

## Claude Code を使う場合

`CLAUDE.md`（英語）または `CLAUDE.ja.md`（日本語）を参照してください。  
`.html` または `i18n.js` を編集すると i18n チェックが自動実行されます。

## リンク

- [CoderDojo 公式](https://coderdojo.com)
- [CoderDojo Japan](https://coderdojo.jp)

## ライセンス

© 2026 CoderDojo 桃花台 (Tokadai). Powered by volunteers. 🌸
