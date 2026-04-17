/* ============================================================
   CoderDojo 桃花台 — events.js  【開催予定 管理ファイル】

   ▼ 日程が決まったら
     1. tbd: false に変更
     2. date に 'YYYY-MM-DD' 形式で日付を設定
     3. dayOfWeek に曜日を設定（例: '日'）
     4. connpassUrl に connpass のイベント URL を設定

   ▼ 新しいイベントを追加するには
     EVENTS 配列の先頭に新しいオブジェクトを追加してください。

   ▼ seasonEmoji の目安
     春（3〜5月）: '🌸'  夏（6〜8月）: '🌿'
     秋（9〜11月）: '🍂'  冬（12〜2月）: '❄️'
   ============================================================ */

const EVENTS = [

  // ── ↓ ここから新しいイベントを追加 ──────────────────────── //

  {
    id:          24,
    tbd:         true,            // 日程未定: true / 日程確定: false
    date:        null,            // 確定したら 'YYYY-MM-DD' 形式で設定
    dayOfWeek:   null,            // 確定したら曜日を設定（例: '日'）
    startTime:   '13:00',
    endTime:     '16:00',
    seasonEmoji: '🌸',
    monthLabel:  '次回',
    venue:       '小牧市東部の公共施設（予定）',
    connpassUrl: null,            // 確定したら connpass URL を設定
    notes:       '',
  },

  // ── ↑ ここまで ───────────────────────────────────────────── //

];

/* ── 次回イベント取得 ──────────────────────── */
function getNextEvent() {
  if (!EVENTS.length) return null;
  // 未定イベントがあれば優先して返す
  const tbd = EVENTS.find(ev => ev.tbd);
  if (tbd) return tbd;
  // 今日以降で最も近い確定済みイベント
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = EVENTS
    .filter(ev => ev.date && new Date(ev.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  if (upcoming.length) return upcoming[0];
  // 未来のイベントがなければ最新の過去イベント
  return EVENTS.slice().sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}

/* ── 日付を日本語表記に変換 ─────────────────── */
function formatDateJa(ev) {
  const d = new Date(ev.date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${ev.dayOfWeek}）`;
}

/* ── ページ内の [data-ev] 要素を自動更新 ──────── */
function populateNextEvent() {
  const ev = getNextEvent();
  if (!ev) return;

  const isTbd   = ev.tbd || !ev.date;
  const dateStr = isTbd ? '日程未定' : formatDateJa(ev);
  const timeStr = isTbd ? '―'       : `${ev.startTime} 〜 ${ev.endTime}`;

  const fill = {
    'title':        `${ev.seasonEmoji} ${ev.monthLabel}のCoderDojo 桃花台`,
    'date':         isTbd ? '📅 日程未定'                      : `📅 ${dateStr}`,
    'time':         isTbd ? '🕐 ―'                             : `🕐 ${timeStr}`,
    'venue':        `📍 ${ev.venue}`,
    'date-short':   isTbd ? `${ev.seasonEmoji} 日程未定`       : `${ev.seasonEmoji} ${dateStr} ${timeStr}`,
    'venue-short':  ev.venue,
    'news-summary': isTbd ? `日程未定｜${ev.venue}`            : `${dateStr} ${timeStr}｜${ev.venue}`,
    'date-text':    dateStr,
    'time-text':    timeStr,
    'venue-text':   ev.venue,
  };

  Object.entries(fill).forEach(([key, text]) => {
    document.querySelectorAll(`[data-ev="${key}"]`).forEach(el => {
      el.textContent = text;
    });
  });

  // connpass リンク更新
  document.querySelectorAll('[data-ev="link"]').forEach(el => {
    if (ev.connpassUrl) {
      el.href                = ev.connpassUrl;
      el.style.opacity       = '';
      el.style.pointerEvents = '';
      el.style.cursor        = '';
    } else {
      el.removeAttribute('href');
      el.textContent         = '申込受付前';
      el.style.opacity       = '.55';
      el.style.pointerEvents = 'none';
      el.style.cursor        = 'default';
    }
  });
}

document.addEventListener('DOMContentLoaded', populateNextEvent);
