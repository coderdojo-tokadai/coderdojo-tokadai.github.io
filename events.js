/* ============================================================
   桃花台コードクラブ — events.js  【開催予定 管理ファイル】

   ★ 開催情報を更新するときは、基本ここ（先頭のイベント）だけ編集すればOK。
     各ページの「次回開催」表示は data-ev 属性経由で自動反映されます。

   ▼ 必須項目
     date / startTime / endTime / venue / connpassUrl
   ▼ 任意項目（あれば表示、無ければ自動で省略）
     label    … 回の名称（例: '第0回 準備会'）。無ければ「○月の桃花台コードクラブ」
     kind     … 'prep'（準備会） / 'regular'（通常回）
     audience … 対象（例: 'おとな（メンター・サポーター候補・保護者）'）
     capacity … 定員（例: '約7名'）
     fee      … 参加費（例: '無料'）
     deadline … 申込締切日 'YYYY-MM-DD'（+ deadlineTime）
     summary  … 一言紹介
   ▼ 自動計算（書かなくてよい）
     曜日 / 季節アイコン / 「○月」表記 は date から自動算出します。
     （明示したい場合は dayOfWeek / seasonEmoji / monthLabel を書けば上書きされます）
   ▼ 日程が未定のとき
     tbd: true にして date は null のままでOK。
   ============================================================ */

const EVENTS = [

  // ── ↓ 直近の開催（ここを編集） ───────────────────────────── //
  {
    id:          0,
    label:       '第0回 準備会',
    kind:        'prep',
    tbd:         false,
    date:        '2026-08-30',
    startTime:   '13:30',
    endTime:     '15:30',
    venue:       '小牧市東部市民センター2F 学習室',
    connpassUrl: 'https://tokadai-code-club.connpass.com/event/396549/',
    deadline:    '2026-08-29',
    deadlineTime:'17:00',
    audience:    'おとな（メンター・サポーター候補・保護者・学生・地域の方）、子ども（参加に興味がある小学生〜高校生）',
    capacity:    '約7名',
    fee:         '無料',
    summary:     '子どものためのプログラミング・クラブを一緒に立ち上げる準備会です。おとなも、参加に興味のある子どもも歓迎します。',
    notes:       '',
  },
  // ── ↑ ここまで ───────────────────────────────────────────── //

];

/* ── 日付ユーティリティ ─────────────────────────── */
const WEEKDAY_JA = ['日', '月', '火', '水', '木', '金', '土'];

function seasonEmojiFor(month) {
  if (month >= 3  && month <= 5)  return '🌸';
  if (month >= 6  && month <= 8)  return '🌿';
  if (month >= 9  && month <= 11) return '🍂';
  return '❄️';
}

function dateParts(dateStr) {
  const d = new Date(dateStr);
  return { y: d.getFullYear(), m: d.getMonth() + 1, day: d.getDate(), wd: WEEKDAY_JA[d.getDay()] };
}

function formatDateJa(dateStr, dayOfWeek) {
  const p = dateParts(dateStr);
  return `${p.y}年${p.m}月${p.day}日（${dayOfWeek || p.wd}）`;
}

/* 曜日・季節アイコン・月表記を date から補完（明示値があればそちら優先） */
function decorateEvent(ev) {
  if (!ev) return ev;
  if (!ev.date) {
    return { dayOfWeek: '', seasonEmoji: '🌸', monthLabel: '次回', ...ev };
  }
  const p = dateParts(ev.date);
  return {
    ...ev,
    dayOfWeek:   ev.dayOfWeek   || p.wd,
    seasonEmoji: ev.seasonEmoji || seasonEmojiFor(p.m),
    monthLabel:  ev.monthLabel  || `${p.m}月`,
  };
}

/* ── 次回イベント取得 ──────────────────────── */
function getNextEvent() {
  if (!EVENTS.length) return null;
  // 未定イベントがあれば優先して返す
  const tbd = EVENTS.find(ev => ev.tbd);
  if (tbd) return decorateEvent(tbd);
  // 今日以降で最も近い確定済みイベント
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = EVENTS
    .filter(ev => ev.date && new Date(ev.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  if (upcoming.length) return decorateEvent(upcoming[0]);
  // 未来のイベントがなければ最新の過去イベント
  return decorateEvent(EVENTS.slice().sort((a, b) => new Date(b.date) - new Date(a.date))[0]);
}

/* ── ページ内の [data-ev] 要素を自動更新 ──────── */
function populateNextEvent() {
  const ev = getNextEvent();
  if (!ev) return;

  const isTbd   = ev.tbd || !ev.date;
  const dateStr = isTbd ? '日程未定' : formatDateJa(ev.date, ev.dayOfWeek);
  const timeStr = isTbd ? '―'        : `${ev.startTime} 〜 ${ev.endTime}`;
  const heading = ev.label ? `${ev.seasonEmoji} ${ev.label}`
                           : `${ev.seasonEmoji} ${ev.monthLabel}の桃花台コードクラブ`;
  const deadlineStr = (!isTbd && ev.deadline)
    ? `${formatDateJa(ev.deadline)} ${ev.deadlineTime || ''}`.trim()
    : '';

  // 開催状況（ステータス）— 確定済みかどうかで自動切替
  const statusBadge = isTbd ? '🚀 準備中' : '🚀 開催決定';
  const statusLine  = isTbd
    ? '次回開催に向けて準備中です。'
    : `${heading} を ${dateStr} に開催します！`;

  const fill = {
    'title':         heading,
    'label':         ev.label || '',
    'date':          isTbd ? '📅 日程未定'                : `📅 ${dateStr}`,
    'time':          isTbd ? '🕐 ―'                       : `🕐 ${timeStr}`,
    'venue':         `📍 ${ev.venue}`,
    'date-short':    isTbd ? `${ev.seasonEmoji} 日程未定` : `${ev.seasonEmoji} ${dateStr} ${timeStr}`,
    'venue-short':   ev.venue,
    'news-summary':  isTbd ? `日程未定｜${ev.venue}`       : `${dateStr} ${timeStr}｜${ev.venue}`,
    'date-text':     dateStr,
    'time-text':     timeStr,
    'venue-text':    ev.venue,
    'audience':      ev.audience ? `👥 ${ev.audience}` : '',
    'audience-text': ev.audience || '',
    'capacity':      ev.capacity ? `🪑 定員 ${ev.capacity}` : '',
    'fee':           ev.fee ? `🎟 ${ev.fee}` : '',
    'deadline':      deadlineStr ? `📝 申込締切 ${deadlineStr}` : '',
    'deadline-text': deadlineStr,
    'summary':       ev.summary || '',
    'status-badge':  statusBadge,
    'status-line':   statusLine,
  };

  Object.entries(fill).forEach(([key, text]) => {
    if (text === '') return;  // 値が無い項目は HTML の初期テキストを残す
    document.querySelectorAll(`[data-ev="${key}"]`).forEach(el => {
      el.textContent = text;
    });
  });

  // connpass リンク更新（URL 未設定なら「申込受付前」で無効化）
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
