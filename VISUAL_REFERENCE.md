# 🎨 SliceUp — Visual Reference & Scroll Flow

## Визуальные референсы

### Creamberries (основной)
- Монохромный фон под цвет продукта
- Продукт в центре, крупно
- Большая типографика ЗА продуктом
- Летающие ингредиенты вокруг
- Минимальный UI

### Apple Product Pages
- Scroll-driven анимации
- Видео-скрабинг по скроллу
- Секции "залипают" (pin)
- Минимализм, много воздуха

### drinkcharlies.com
- Premium food бренд
- Immersive visual storytelling
- Тёмные тона, драматичный свет

---

## Scroll Flow (сверху вниз)

```
┌─────────────────────────────────────────┐
│                                         │
│  SliceUp                    Menu  Shop  │  ← Floating nav (fixed)
│                                         │
│              M A N G O                  │  ← Huge bg text (opacity 0.08)
│                                         │
│  Tropical        ┌──────────┐           │
│  Collection      │  VIDEO   │   €14.50  │  ← Product video center
│                  │  (blend) │           │
│  Mango           │  mode:   │           │
│  Chips           │  screen  │           │
│                  └──────────┘           │
│  Premium dried                          │
│  mango slices... │ 🥭 🍎 🍌 🍍 │  15   │  ← Thumbnails
│                                         │
│  [ Shop Now ]         ↓ Scroll          │
│                                         │
├─────────────────────────────────────────┤  ← Scroll trigger
│                                         │
│         "Nature, Sliced to              │
│          Perfection"                    │  ← Philosophy section
│                                         │  (fade in on scroll)
│    We believe in pure ingredients,      │
│    zero additives, maximum flavor.      │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐   │
│  │ 🥭  │  │ 🍎  │  │ 🍌  │  │ 🍍  │   │  ← Horizontal scroll
│  │Mango│  │Apple│  │Banan│  │Pinea│   │     catalog
│  │€14  │  │€12  │  │€11  │  │€16  │   │
│  └─────┘  └─────┘  └─────┘  └─────┘   │
│                                         │
│           → scroll for more             │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         How It Works                    │
│                                         │
│    01 ── Choose your favorites          │  ← Steps section
│    02 ── Add to cart                    │     (pin + scrub)
│    03 ── Checkout with Stripe           │
│    04 ── Delivered to your door         │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         Get in Touch                    │
│                                         │
│    hello@sliceup.cy                     │  ← Contact (minimal)
│    Limassol, Cyprus                     │
│                                         │
│    Instagram  ·  WhatsApp               │
│                                         │
└─────────────────────────────────────────┘

┌───┐
│ 🛒│  ← Floating cart button (fixed, bottom-right)
│ 2 │     Opens CartDrawer on click
└───┘
```

---

## Переключение продуктов — что меняется

При клике на thumbnail или свайпе, одновременно анимируются:

| Element | Animation | Duration |
|---------|-----------|----------|
| Background color | CSS transition | 600ms |
| Product video | Crossfade (opacity) | 400ms |
| Background text | Fade out → change → fade in | 500ms |
| Product title | Slide down + fade | 400ms |
| Product description | Slide down + fade (delayed 100ms) | 400ms |
| Price | Slide up + fade | 300ms |
| Floating particles | Color tint change | 600ms |

---

## Ключевые анимации

### 1. Page Load Sequence
```
0.0s  — Background color appears
0.3s  — Nav fades in
0.5s  — Background text fades in
0.7s  — Video starts playing + scales up from 0.9
0.9s  — Product subtitle appears (fadeUp)
1.1s  — Product title appears (fadeUp)  
1.3s  — Description appears (fadeUp)
1.5s  — Shop Now button appears (fadeUp)
1.7s  — Price appears (fadeUp)
1.9s  — Thumbnails appear (fadeUp)
2.1s  — Scroll indicator pulses
```

### 2. Mouse Parallax (desktop only)
```
Video:       translateX(±15px) translateY(±10px)
BG text:     translateX(∓30px) translateY(∓20px)  ← opposite direction
Particles:   translateX(±8-40px) translateY(±8-40px)  ← per particle speed
Glow:        translateX(±5px) translateY(±5px)  ← subtle
```

### 3. Scroll-triggered (sections below hero)
```
Philosophy:  Text words appear one by one (scrub: true)
Catalog:     Horizontal scroll (pin hero, scrub horizontal)
Steps:       Each step pins and reveals next (sequential pin)
Contact:     Simple fadeUp
```
