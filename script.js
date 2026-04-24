/* ============================================
   CoderDojo 桃花台 — script.js
   ============================================ */

/* ── Time-of-day detection ───────────────────── */
function getTimeOfDay() {
  const h = new Date().getHours();
  if (h >= 5  && h < 10) return 'morning';
  if (h >= 10 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'evening';
  return 'night';
}

const TIME_OF_DAY = getTimeOfDay();

const TIME_CONFIG = {
  // 朝 (5〜10時): 日の出・暖かい夜明け
  morning: {
    heroGradient: 'linear-gradient(155deg,#FF7043 0%,#FFCA28 30%,#FFF9C4 60%,#E3F2FD 100%)',
    overlay:      'linear-gradient(to right,rgba(26,10,61,.38) 0%,rgba(26,10,61,.10) 55%,transparent 100%)',
    badgeEmoji:   '🌅',
    accentColor:  '#FFE082',
    stars: false, moon: false, sun: true,  sunClass: 'hero-sun--morning',
  },
  // 昼 (10〜17時): 季節テーマそのまま
  day: {
    heroGradient: null,
    overlay:      null,
    badgeEmoji:   null,
    accentColor:  '#FFE082',
    stars: false, moon: false, sun: true,  sunClass: 'hero-sun--day',
  },
  // 夕方 (17〜20時): 夕焼け・トワイライト
  evening: {
    heroGradient: 'linear-gradient(155deg,#311B92 0%,#C62828 30%,#E64A19 60%,#FF8A65 100%)',
    overlay:      'linear-gradient(to right,rgba(49,27,146,.62) 0%,rgba(49,27,146,.22) 55%,transparent 100%)',
    badgeEmoji:   '🌇',
    accentColor:  '#FFAB91',
    stars: false, moon: false, sun: true,  sunClass: 'hero-sun--evening',
  },
  // 夜 (20〜翌5時): 星空・月
  night: {
    heroGradient: 'linear-gradient(155deg,#050517 0%,#0D1B4A 35%,#0A2A5E 70%,#0D2840 100%)',
    overlay:      'linear-gradient(to right,rgba(0,0,20,.82) 0%,rgba(0,0,20,.42) 55%,transparent 100%)',
    badgeEmoji:   '🌙',
    accentColor:  '#90CAF9',
    stars: true,  moon: true,  sun: false, sunClass: '',
  },
};

function applyTimeTheme() {
  const tcfg = TIME_CONFIG[TIME_OF_DAY];

  // ヒーロー背景（昼は季節テーマを優先）
  if (tcfg.heroGradient) {
    const hero = document.getElementById('heroSection');
    if (hero) hero.style.background = tcfg.heroGradient;
  }

  // オーバーレイ
  if (tcfg.overlay) {
    const overlay = document.getElementById('heroOverlay');
    if (overlay) overlay.style.background = tcfg.overlay;
  }

  // バッジ絵文字（昼は季節バッジを優先）
  if (tcfg.badgeEmoji) {
    const badge = document.getElementById('heroBadge');
    if (badge) badge.textContent = tcfg.badgeEmoji + ' CoderDojo 桃花台 — Tokadai';
  }

  // h1 アクセントカラー
  const accentSpan = document.querySelector('.hero h1 span');
  if (accentSpan) accentSpan.style.color = tcfg.accentColor;

  // 星空（夜のみ）
  const starsWrap = document.getElementById('starsWrap');
  if (starsWrap) {
    if (tcfg.stars) {
      starsWrap.style.display = '';
      if (!starsWrap.children.length) {
        for (let i = 0; i < 90; i++) {
          const s  = document.createElement('div');
          const sz = Math.random() * 2.2 + 0.6;
          s.className = 'star';
          s.style.cssText = [
            `left:${(Math.random() * 100).toFixed(1)}%`,
            `top:${(Math.random() * 62).toFixed(1)}%`,
            `width:${sz.toFixed(1)}px`,
            `height:${sz.toFixed(1)}px`,
            `animation-duration:${(Math.random() * 3 + 2).toFixed(1)}s`,
            `animation-delay:${(Math.random() * 5).toFixed(1)}s`,
            `opacity:${(Math.random() * .45 + .25).toFixed(2)}`,
          ].join(';');
          starsWrap.appendChild(s);
        }
      }
    } else {
      starsWrap.style.display = 'none';
    }
  }

  // 月（夜のみ）
  const moon = document.getElementById('heroMoon');
  if (moon) moon.style.display = tcfg.moon ? '' : 'none';

  // 太陽（日照時間のみ）
  const sun = document.getElementById('heroSun');
  if (sun) {
    sun.style.display = tcfg.sun ? '' : 'none';
    sun.className = 'hero-sun' + (tcfg.sunClass ? ' ' + tcfg.sunClass : '');
  }
}

/* ── Season detection ────────────────────────── */
function getSeason() {
  const m = new Date().getMonth() + 1; // 1–12
  if (m >= 3 && m <= 5)  return 'spring';
  if (m >= 6 && m <= 8)  return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
}

const SEASON = getSeason();

const SEASON_CONFIG = {
  spring: {
    heroGradient:    'linear-gradient(155deg,#87CEEB 0%,#B8E4F0 30%,#FFD4C2 65%,#FF9A7B 100%)',
    badge:           '🌸 CoderDojo 桃花台 — Tokadai',
    petals: {
      colors:        ['#FFB6C1','#FFD4C2','#FFE4E1','#FFCCE4','#FFAAB5','#FFDDE4'],
      count:         22,
      borderRadius:  () => Math.random() > .5 ? '80% 0 80% 0' : '50% 0 50% 50%',
      extraClass:    '',
    },
    blossomColors:   ['#FF8FAB','#FFB3C6','#FF8FAB','#FFB3C6','#FF8FAB','#FFB3C6','#FFCCE4'],
    treeColors:      ['#388E3C','#4CAF50','#43A047','#66BB6A','#388E3C','#4CAF50','#43A047'],
    groundColor:     '#4CAF50',
    scatteredOpacity: 1,
    waterTower:      false,
    snow:            false,
  },
  summer: {
    heroGradient:    'linear-gradient(155deg,#1565C0 0%,#42A5F5 30%,#A5D6A7 65%,#4CAF50 100%)',
    badge:           '🌿 CoderDojo 桃花台 — Tokadai',
    petals: {
      colors:        ['rgba(255,255,200,.7)','rgba(255,230,100,.5)','rgba(200,255,200,.5)','rgba(255,255,255,.4)'],
      count:         14,
      borderRadius:  () => '50%',
      extraClass:    '',
    },
    blossomColors:   ['#2E7D32','#388E3C','#43A047','#2E7D32','#388E3C','#43A047','#1B5E20'],
    treeColors:      ['#1B5E20','#2E7D32','#33691E','#558B2F','#1B5E20','#2E7D32','#33691E'],
    groundColor:     '#2E7D32',
    scatteredOpacity: 0,
    waterTower:      false,
    snow:            false,
  },
  autumn: {
    heroGradient:    'linear-gradient(155deg,#263238 0%,#546E7A 30%,#BF360C 65%,#E65100 100%)',
    badge:           '🍂 CoderDojo 桃花台 — Tokadai',
    petals: {
      colors:        ['#FF6F00','#E65100','#BF360C','#D84315','#F57F17','#FF8F00'],
      count:         22,
      borderRadius:  () => Math.random() > .5 ? '80% 0 80% 0' : '30% 70% 70% 30% / 30% 30% 70% 70%',
      extraClass:    '',
    },
    blossomColors:   ['#D84315','#E64A19','#BF360C','#FF6D00','#E65100','#FF6F00','#FFCA28'],
    treeColors:      ['#BF360C','#E64A19','#E65100','#FF6D00','#BF360C','#E64A19','#E65100'],
    groundColor:     '#5D4037',
    scatteredOpacity: 0.8,
    waterTower:      false,
    snow:            false,
  },
  winter: {
    heroGradient:    'linear-gradient(155deg,#1A237E 0%,#3949AB 30%,#B3E5FC 65%,#E3F2FD 100%)',
    badge:           '❄️ CoderDojo 桃花台 — Tokadai',
    petals: {
      colors:        ['#FFFFFF','#E3F2FD','#BBDEFB','#E1F5FE','#F8FBFF'],
      count:         30,
      borderRadius:  () => '50%',
      extraClass:    'petal--snow',
    },
    blossomColors:   ['#90A4AE','#B0BEC5','#90A4AE','#B0BEC5','#90A4AE','#B0BEC5','#CFD8DC'],
    treeColors:      ['#4E342E','#5D4037','#6D4C41','#795548','#4E342E','#5D4037','#6D4C41'],
    groundColor:     '#B0BEC5',
    scatteredOpacity: 0,
    waterTower:      false,
    snow:            true,
  },
};

function showFormError(form, message) {
  let el = form.querySelector('.form-error-msg');
  if (!el) {
    el = document.createElement('p');
    el.className = 'form-error-msg';
    el.style.cssText = 'color:#e53e3e;font-size:.875rem;margin-top:.75rem;padding:.75rem 1rem;background:#fff5f5;border-radius:8px;border:1px solid #fed7d7;';
    form.appendChild(el);
  }
  el.textContent = '⚠️ ' + message;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function applySeasonalTheme() {
  const cfg = SEASON_CONFIG[SEASON];

  // ヒーロー背景グラデーション
  const hero = document.getElementById('heroSection');
  if (hero) hero.style.background = cfg.heroGradient;

  // バッジテキスト
  const badge = document.getElementById('heroBadge');
  if (badge) badge.textContent = cfg.badge;

  // 桜/花のクラスター色
  const blossoms = document.querySelectorAll('#blossomClusters circle');
  blossoms.forEach((c, i) => {
    c.setAttribute('fill', cfg.blossomColors[i] ?? cfg.blossomColors[0]);
  });

  // 空中に散る花びら/落葉の表示
  const scattered = document.getElementById('scatteredPetals');
  if (scattered) scattered.style.opacity = cfg.scatteredOpacity;

  // 緑の木々の葉色
  let ellipseIndex = 0;
  document.querySelectorAll('.tree-foliage').forEach(g => {
    g.querySelectorAll('ellipse').forEach(el => {
      el.setAttribute('fill', cfg.treeColors[ellipseIndex] ?? cfg.treeColors[0]);
      ellipseIndex++;
    });
  });

  // 地面の色
  const groundGroup = document.getElementById('groundGroup');
  if (groundGroup) {
    const rects = groundGroup.querySelectorAll('rect');
    if (rects[1]) rects[1].setAttribute('fill', cfg.groundColor);
  }


  // 積雪（冬のみ表示）
  const snowGroup = document.getElementById('snowGroup');
  if (snowGroup) snowGroup.style.display = cfg.snow ? '' : 'none';
}

/* ── フォーム送信エンドポイント ─────────────
   Formspree (https://formspree.io) でフォームを作成し、
   YOUR_FORM_ID を取得したIDに差し替えてください。
   例: 'https://formspree.io/f/xabcdefg'          */
const FORM_ENDPOINT = 'https://formspree.io/f/xyklekqz';

document.addEventListener('DOMContentLoaded', () => {

  /* ── 季節テーマ → 時間帯テーマの順で適用 ─── */
  applySeasonalTheme();
  applyTimeTheme();   // 時間帯が季節グラデーションを上書き（昼は除く）

  /* ── Mobile nav ──────────────────────────── */
  const toggle    = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    // Close on outside click
    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
        toggle.classList.remove('open');
        mobileNav.classList.remove('open');
      }
    });
  }

  /* ── Nav scroll shadow ───────────────────── */
  const nav = document.getElementById('mainNav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active nav link ─────────────────────── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* ── Scroll-reveal (fade-in) ─────────────── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* ── Floating petals / particles ─────────── */
  const wrap = document.getElementById('petalWrap');
  if (wrap) {
    const cfg = SEASON_CONFIG[SEASON].petals;
    for (let i = 0; i < cfg.count; i++) {
      const p  = document.createElement('div');
      const sz = Math.random() * 10 + 8;
      p.className = 'petal' + (cfg.extraClass ? ' ' + cfg.extraClass : '');
      p.style.cssText = [
        `left:${Math.random() * 110 - 5}vw`,
        `width:${sz}px`,
        `height:${sz}px`,
        `background:${cfg.colors[Math.floor(Math.random() * cfg.colors.length)]}`,
        `animation-duration:${Math.random() * 9 + 8}s`,
        `animation-delay:${Math.random() * 12}s`,
        `opacity:${(Math.random() * .5 + .25).toFixed(2)}`,
        `transform:rotate(${Math.floor(Math.random() * 360)}deg)`,
        `border-radius:${cfg.borderRadius()}`,
      ].join(';');
      wrap.appendChild(p);
    }
  }

  /* ── FAQ accordion ───────────────────────── */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item   = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Contact form ────────────────────────── */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form && success) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn          = form.querySelector('.form-submit');
      const originalText = btn.textContent;
      btn.textContent = '送信中…';
      btn.disabled    = true;

      try {
        const res = await fetch(FORM_ENDPOINT, {
          method:  'POST',
          body:    new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          form.style.display    = 'none';
          success.style.display = 'block';
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          const data = await res.json();
          const msg  = data.errors?.map(err => err.message).join('、')
                       ?? '送信に失敗しました。';
          showFormError(form, msg);
          btn.textContent = originalText;
          btn.disabled    = false;
        }
      } catch {
        showFormError(form, '通信エラーが発生しました。インターネット接続を確認してから再試行してください。');
        btn.textContent = originalText;
        btn.disabled    = false;
      }
    });
  }

  /* ── Smooth anchor scroll ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── Subtle card tilt on home hero ──────── */
  const heroCard = document.querySelector('.about-card-big');
  if (heroCard) {
    heroCard.addEventListener('mousemove', e => {
      const r = heroCard.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - .5) * 10;
      const y = ((e.clientY - r.top)  / r.height - .5) * 10;
      heroCard.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-6px)`;
    });
    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transition = 'transform .4s ease';
      heroCard.style.transform  = 'none';
      setTimeout(() => { heroCard.style.transition = ''; }, 400);
    });
  }

});
