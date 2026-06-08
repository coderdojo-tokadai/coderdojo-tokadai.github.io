#!/usr/bin/env python3
"""マスコット pico がムーンウォークする動画 (mp4) を生成する。

pico の SVG は index.html のインライン定義を流用。脚(ブーツ)を本体から分離し、
本体は左へ滑らかにグライド、両脚は半周期ずらした「滑り＋かかとポップ」で
ムーンウォーク特有のシャッフルを表現する。

依存: cairosvg, Pillow, imageio, imageio-ffmpeg
出力: pico-moonwalk.mp4
"""
import io
import math
import random

import cairosvg
import imageio.v2 as imageio
import numpy as np
from PIL import Image

# ── 出力設定 ───────────────────────────────────────────────
W, H = 720, 480
FPS = 30
DURATION = 20.0
N = int(FPS * DURATION)

# ── pico 配置 ─────────────────────────────────────────────
S = 1.65                      # マスコット拡大率 (native viewBox 140x188)
GY = H - 188 * S - 26         # 床に立つ Y 位置
GX_R, GX_L = 500, 70          # 右端 / 左端 (本体左上原点)

# ── 一往復タイムライン (秒) ───────────────────────────────
T_GO = 8.5                    # 右→左 へムーンウォーク
T_TURN = 1.5                  # 折り返し反転 (フリップ)
T_BACK = 8.5                  # 左→右 へ戻る
# 末尾の T_TURN で元の向きへ反転して終了 (合計 = 20.0)
HOP = 26.0                    # 反転時のジャンプ量(px)


def motion(t):
    """時刻 t での (gx, scaleX, hop) を返す。一往復＋両端で反転。"""
    if t < T_GO:                                   # 右→左
        p = smoothstep(t / T_GO)
        return GX_R + (GX_L - GX_R) * p, 1.0, 0.0
    t -= T_GO
    if t < T_TURN:                                 # 左端で反転 (+1→-1)
        p = t / T_TURN
        return GX_L, 1.0 - 2.0 * smoothstep(p), -HOP * math.sin(math.pi * p)
    t -= T_TURN
    if t < T_BACK:                                 # 左→右
        p = smoothstep(t / T_BACK)
        return GX_L + (GX_R - GX_L) * p, -1.0, 0.0
    t -= T_BACK                                    # 右端で反転 (-1→+1)
    p = min(1.0, t / T_TURN)
    return GX_R, -1.0 + 2.0 * smoothstep(p), -HOP * math.sin(math.pi * p)

# ── 脚アニメーション ──────────────────────────────────────
PC = 0.9                      # 1脚の周期(秒)
A = 9.0                       # 脚の前後振幅(マスコット単位)
SLIDE_FRAC = 0.62             # 周期のうち「べた足スライド」割合 / 残りがポップ復帰
POP_ROT = 24.0               # かかとポップの回転角(度)
POP_LIFT = 6.0               # ポップ時の持ち上げ(マスコット単位)

# 脚パーツ (index.html 由来)。回転中心はブーツ底。
LEFT_LEG = (
    '<ellipse cx="53" cy="180" rx="11" ry="5" fill="#FF8A65" opacity=".5"/>'
    '<rect x="43" y="156" width="22" height="23" rx="10" fill="#1565C0"/>'
    '<rect x="43" y="166" width="22" height="5" rx="2" fill="rgba(255,255,255,.25)"/>'
)
RIGHT_LEG = (
    '<ellipse cx="87" cy="180" rx="11" ry="5" fill="#FF8A65" opacity=".5"/>'
    '<rect x="75" y="156" width="22" height="23" rx="10" fill="#1565C0"/>'
    '<rect x="75" y="166" width="22" height="5" rx="2" fill="rgba(255,255,255,.25)"/>'
)
LEFT_PIVOT = (54, 179)
RIGHT_PIVOT = (86, 179)

# 本体 (脚以外すべて)。antenna の星はプレースホルダで揺らす。
BODY = """
  <rect x="37" y="104" width="66" height="55" rx="20" fill="url(#pico-suit)"/>
  <rect x="37" y="118" width="11" height="27" rx="5" fill="rgba(255,255,255,.18)"/>
  <rect x="92" y="118" width="11" height="27" rx="5" fill="rgba(255,255,255,.18)"/>
  <circle cx="70" cy="129" r="14" fill="rgba(255,255,255,.22)"/>
  <text x="70" y="134" font-family="monospace" font-size="12" font-weight="900" fill="white" text-anchor="middle">&lt;/&gt;</text>
  <g transform="translate(42,110) rotate({arm_l})">
    <rect x="-9" y="-32" width="18" height="32" rx="9" fill="url(#pico-suit)"/>
    <circle cx="0" cy="-32" r="10" fill="#1565C0"/>
  </g>
  <g transform="translate(97,110) rotate({arm_r})">
    <rect x="0" y="0" width="28" height="18" rx="9" fill="url(#pico-suit)"/>
    <circle cx="31" cy="9" r="10" fill="#1565C0"/>
  </g>
  <circle cx="70" cy="68" r="46" fill="rgba(91,192,235,.18)" stroke="rgba(255,255,255,.55)" stroke-width="2.5"/>
  <circle cx="70" cy="68" r="39" fill="url(#pico-helm)"/>
  <ellipse cx="87" cy="44" rx="15" ry="9" fill="white" opacity=".22" transform="rotate(-20,87,44)"/>
  <circle cx="55" cy="65" r="8" fill="#1A0A3D"/><circle cx="85" cy="65" r="8" fill="#1A0A3D"/>
  <circle cx="57.5" cy="62.5" r="3" fill="white"/><circle cx="87.5" cy="62.5" r="3" fill="white"/>
  <circle cx="56.5" cy="63.5" r="1.3" fill="#5BC0EB"/><circle cx="86.5" cy="63.5" r="1.3" fill="#5BC0EB"/>
  <ellipse cx="43" cy="78" rx="8" ry="5" fill="#FFB3C6" opacity=".55"/>
  <ellipse cx="97" cy="78" rx="8" ry="5" fill="#FFB3C6" opacity=".55"/>
  <path d="M 53 82 Q 70 96 87 82" stroke="#1A0A3D" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <g transform="translate(70,16) rotate({ant})">
    <line x1="0" y1="7" x2="0" y2="-6" stroke="#6B3FA0" stroke-width="3" stroke-linecap="round"/>
    <polygon points="0,-13 2,-7 8,-7 3,-3.5 5,2.5 0,-1 -5,2.5 -3,-3.5 -8,-7 -2,-7" fill="#FFE082"/>
  </g>
"""


def smoothstep(x):
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


def leg_transform(t, phase, pivot):
    """脚の (dx_local, lift_local, rot) を返す。dx は本体相対の前後位置。"""
    u = t / PC + phase
    f = u - math.floor(u)
    if f < SLIDE_FRAC:
        # べた足スライド: 前(+A)→後(-A) へ滑らかに後退 (ムーンウォークの滑り)
        s = smoothstep(f / SLIDE_FRAC)
        relx = A - 2 * A * s
        lift = 0.0
        rot = 0.0
    else:
        # かかとポップ復帰: 後(-A)→前(+A) へ素早く、かかとを上げて持ち上げ
        s = smoothstep((f - SLIDE_FRAC) / (1 - SLIDE_FRAC))
        relx = -A + 2 * A * s
        bump = math.sin(math.pi * s)
        lift = POP_LIFT * bump
        rot = -POP_ROT * bump      # かかとを上げる
    return relx, lift, rot


# ── 背景 (固定の星・月面) ─────────────────────────────────
random.seed(7)
stars = []
for _ in range(70):
    sx = random.uniform(0, W)
    sy = random.uniform(0, H * 0.72)
    r = random.uniform(0.6, 1.8)
    op = random.uniform(0.35, 0.95)
    stars.append(f'<circle cx="{sx:.1f}" cy="{sy:.1f}" r="{r:.1f}" fill="#FFF" opacity="{op:.2f}"/>')
STARS = "".join(stars)

# 月面 (ゆるい起伏) とクレーター
GROUND_Y = H - 60
MOON = (
    f'<path d="M0 {GROUND_Y+18} '
    f'C {W*0.2} {GROUND_Y-10}, {W*0.4} {GROUND_Y+8}, {W*0.6} {GROUND_Y-6} '
    f'S {W*0.95} {GROUND_Y+6}, {W} {GROUND_Y-4} L {W} {H} L 0 {H} Z" '
    f'fill="#3a3550"/>'
    f'<ellipse cx="{W*0.3:.0f}" cy="{GROUND_Y+24}" rx="34" ry="9" fill="#2e2a44" opacity=".7"/>'
    f'<ellipse cx="{W*0.72:.0f}" cy="{GROUND_Y+30}" rx="46" ry="11" fill="#2e2a44" opacity=".7"/>'
)
# 大きな月
BIGMOON = (
    f'<circle cx="{W-110}" cy="100" r="62" fill="#FFF6D8" opacity=".95"/>'
    f'<circle cx="{W-90}" cy="86" r="11" fill="#EFE3B8" opacity=".7"/>'
    f'<circle cx="{W-128}" cy="120" r="8" fill="#EFE3B8" opacity=".7"/>'
    f'<circle cx="{W-100}" cy="124" r="6" fill="#EFE3B8" opacity=".6"/>'
)

SVG_TMPL = """<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a0b3d"/>
      <stop offset="55%" stop-color="#2b1259"/>
      <stop offset="100%" stop-color="#3a1a5e"/>
    </linearGradient>
    <radialGradient id="pico-suit" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#D95E00"/><stop offset="100%" stop-color="#F5913A"/>
    </radialGradient>
    <radialGradient id="pico-helm" cx="36%" cy="32%" r="60%">
      <stop offset="0%" stop-color="#FFF5E6" stop-opacity=".97"/><stop offset="100%" stop-color="#FFDCB4" stop-opacity=".93"/>
    </radialGradient>
  </defs>
  <rect width="{W}" height="{H}" fill="url(#sky)"/>
  {STARS}
  {BIGMOON}
  {MOON}
  {bubble}
  <g transform="translate({gx:.2f},{gy:.2f}) scale({s}) rotate({lean:.2f},70,150)">
   <g transform="translate(70,0) scale({sx:.4f},1) translate(-70,0)">
    <g transform="translate({lx:.2f},{ly:.2f}) rotate({lrot:.2f},{lpx},{lpy})">{leftleg}</g>
    <g transform="translate({rx:.2f},{ry:.2f}) rotate({rrot:.2f},{rpx},{rpy})">{rightleg}</g>
    {body}
   </g>
  </g>
</svg>"""


def bubble_svg(gx, gy, t):
    """頭上の吹き出し『ムーンウォーク！🌙』。pico と一緒に動く。"""
    cx = gx + 70 * S
    cy = gy + 8 * S
    by = cy - 26 + math.sin(t * 2.2) * 3
    # 三日月 (絵文字非対応のため SVG で描画)
    crescent = (
        '<g transform="translate(58,-9)">'
        '<circle cx="0" cy="0" r="9" fill="#FFD54F"/>'
        '<circle cx="3.5" cy="-1.5" r="8" fill="#fff"/>'
        '</g>'
    )
    return (
        f'<g transform="translate({cx:.1f},{by:.1f})" text-anchor="middle">'
        f'<rect x="-86" y="-30" width="172" height="40" rx="20" fill="#fff" opacity=".95"/>'
        f'<polygon points="-8,8 8,8 0,22" fill="#fff" opacity=".95"/>'
        f'<text x="-8" y="-2" font-family="Noto Sans JP" font-size="17" font-weight="800" fill="#E91E63">'
        f'ムーンウォーク！</text>'
        f'{crescent}'
        f'</g>'
    )


frames = []
for i in range(N):
    t = i / FPS
    gx, sx, hop = motion(t)
    # 緩やかな上下バウンス & 進行方向と逆の傾き(ノリ) + 反転ジャンプ
    bob = math.sin(t * 2 * math.pi / PC * 2) * 2.2
    gy = GY + bob + hop
    lean = math.sin(t * 2 * math.pi / PC) * 3.5

    lrelx, llift, lrot = leg_transform(t, 0.0, LEFT_PIVOT)
    rrelx, rlift, rrot = leg_transform(t, 0.5, RIGHT_PIVOT)

    arm_l = -18 + math.sin(t * 2 * math.pi / PC) * 16
    arm_r = 18 + math.sin(t * 2 * math.pi / PC + math.pi) * 16
    ant = math.sin(t * 3.0) * 16

    svg = SVG_TMPL.format(
        W=W, H=H, STARS=STARS, BIGMOON=BIGMOON, MOON=MOON,
        bubble=bubble_svg(gx, gy, t),
        gx=gx, gy=gy, s=S, sx=sx, lean=lean,
        lx=lrelx, ly=-llift, lrot=lrot, lpx=LEFT_PIVOT[0], lpy=LEFT_PIVOT[1],
        rx=rrelx, ry=-rlift, rrot=rrot, rpx=RIGHT_PIVOT[0], rpy=RIGHT_PIVOT[1],
        leftleg=LEFT_LEG, rightleg=RIGHT_LEG,
        body=BODY.format(arm_l=arm_l, arm_r=arm_r, ant=ant),
    )
    png = cairosvg.svg2png(bytestring=svg.encode("utf-8"),
                           output_width=W, output_height=H)
    img = Image.open(io.BytesIO(png)).convert("RGB")
    frames.append(img)
    if i % 30 == 0:
        print(f"frame {i+1}/{N}")

print("encoding mp4...")
out = "pico-moonwalk.mp4"
writer = imageio.get_writer(out, fps=FPS, codec="libx264",
                            quality=8, macro_block_size=8,
                            ffmpeg_params=["-pix_fmt", "yuv420p"])
for img in frames:
    writer.append_data(np.asarray(img))
writer.close()
print("done:", out)
