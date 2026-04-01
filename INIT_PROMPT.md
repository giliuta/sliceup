# 🚀 SliceUp — Init Prompt for Claude Code

Скопируй этот промпт в Claude Code для старта проекта:

---

```
Прочитай CLAUDE.md и src/data/products.ts. 

Инициализируй проект SliceUp:

1. `pnpm create next-app@latest sliceup --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` 

2. Установи зависимости:
   `pnpm add gsap @gsap/react framer-motion zustand stripe @stripe/stripe-js lucide-react`

3. Настрой tailwind.config.ts:
   - Добавь кастомные цвета из CLAUDE.md
   - Добавь fontFamily: Playfair Display + DM Sans
   - Добавь кастомные анимации (fadeUp, float, scrollPulse)

4. Настрой src/app/globals.css:
   - Google Fonts import
   - CSS-переменные для динамической темы
   - Базовые утилиты (mix-blend-mode: screen для видео)
   - Плавные скроллы

5. Создай src/app/layout.tsx:
   - Метаданные: title "SliceUp — Premium Dried Fruits", description
   - Open Graph теги
   - Шрифты через next/font/google

6. Скопируй src/data/products.ts из предоставленного файла.

7. Создай базовую структуру компонентов (пустые файлы с TODO):
   - src/components/Nav.tsx
   - src/components/HeroSection.tsx
   - src/components/ProductVideo.tsx
   - src/components/CartDrawer.tsx
   - src/hooks/useParallax.ts
   - src/hooks/useCart.ts
   - src/stores/cartStore.ts
   - src/types/index.ts

8. Проверь: `pnpm build` должен пройти без ошибок.

9. Коммит: `git init && git add . && git commit -m "chore: init SliceUp project"`

НЕ делай ничего сверх этого — только инициализация и каркас.
```

---

## После инициализации — порядок разработки:

### Фаза 1: Hero (MVP)
```
Прочитай CLAUDE.md. Реализуй HeroSection:
- Полноэкранная секция 100vh
- Фоновый текст с названием продукта (Playfair Display, огромный, opacity 0.08)  
- Видео по центру с mix-blend-mode: screen
- Информация о продукте слева (название, описание, кнопка Shop Now)
- Цена справа
- Минимальный Nav сверху (логотип + 3 ссылки)
- CSS transitions для смены цвета фона
- Параллакс на движение мыши (видео, текст, частицы)
- Анимации появления при загрузке (staggered fadeUp)
- Адаптив для мобилок
```

### Фаза 2: Product Switcher
```
Добавь переключатель продуктов:
- Thumbnails внизу экрана
- Клик → плавная смена: фон, видео, текст, цена
- Keyboard arrows для навигации
- Swipe на мобилках
```

### Фаза 3: Scroll Sections  
```
Добавь scroll-секции ниже hero:
- "Our Story" — philosophy секция с анимацией по скроллу
- "Catalog" — все 15 продуктов в immersive scroll
- "How to Order" — шаги заказа
- Contact — минимальная форма
Используй GSAP ScrollTrigger для pin и scrub анимаций.
```

### Фаза 4: E-commerce
```
Реализуй корзину и оплату:
- Zustand store для корзины (persist в localStorage)
- CartDrawer — боковая панель
- POST /api/checkout — создание Stripe Checkout Session
- POST /api/webhook — обработка webhook от Stripe
- Success/Cancel страницы
```

### Фаза 5: Polish
```
Финальная полировка:
- Loading state / skeleton
- 404 страница
- SEO метаданные
- Favicon + OG image
- Lighthouse optimization
- Финальный деплой на Vercel
```
