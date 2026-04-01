// src/data/products.ts
// SliceUp — Full Product Catalog (15 SKUs)
// Theme colors are used for dynamic background transitions

export interface ProductTheme {
  background: string;
  backgroundDark: string;
  accent: string;
}

export interface ProductVideo {
  webm: string;
  mp4: string;
}

export interface ProductImages {
  pack: string;           // Package photo (transparent PNG)
  ingredients: string[];  // Individual ingredient PNGs for floating effect
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;          // EUR cents (1450 = €14.50)
  compareAtPrice?: number;
  weight: string;
  category: 'fruit' | 'vegetable' | 'mix' | 'soup';
  theme: ProductTheme;
  video: ProductVideo;
  images: ProductImages;
  inStock: boolean;
  emoji: string;          // For placeholder thumbnails
  stripeProductId: string;
  stripePriceId: string;
}

export const products: Product[] = [
  {
    id: 'mango-chips',
    slug: 'mango-chips',
    name: 'Mango',
    subtitle: 'Tropical Collection',
    description: 'Premium dehydrated mango slices. Intense tropical sweetness preserved at peak ripeness. No sugar added, just pure sun-dried mango.',
    price: 1450,
    compareAtPrice: 2000,
    weight: '100g',
    category: 'fruit',
    theme: {
      background: '#E8940A',
      backgroundDark: '#C47D08',
      accent: '#FFF3D6',
    },
    video: { webm: '/videos/mango.webm', mp4: '/videos/mango.mp4' },
    images: { pack: '/images/products/mango-pack.png', ingredients: ['/images/ingredients/mango-1.png', '/images/ingredients/mango-2.png', '/images/ingredients/mango-3.png'] },
    inStock: true,
    emoji: '🥭',
    stripeProductId: '',
    stripePriceId: '',
  },
  {
    id: 'apple-chips',
    slug: 'apple-chips',
    name: 'Apple',
    subtitle: 'Classic Collection',
    description: 'Crispy apple chips with no added sugar. The perfect crunch, the pure taste of orchard-fresh apples. Light, healthy, addictive.',
    price: 1200,
    compareAtPrice: 1600,
    weight: '80g',
    category: 'fruit',
    theme: {
      background: '#8B3A3A',
      backgroundDark: '#6E2E2E',
      accent: '#FFD4D4',
    },
    video: { webm: '/videos/apple.webm', mp4: '/videos/apple.mp4' },
    images: { pack: '/images/products/apple-pack.png', ingredients: ['/images/ingredients/apple-1.png', '/images/ingredients/apple-2.png'] },
    inStock: true,
    emoji: '🍎',
    stripeProductId: '',
    stripePriceId: '',
  },
  {
    id: 'banana-chips',
    slug: 'banana-chips',
    name: 'Banana',
    subtitle: 'Tropical Collection',
    description: 'Naturally sweet banana chips, slow-dried to golden perfection. Your everyday energy companion. Crunchy, satisfying, guilt-free.',
    price: 1100,
    compareAtPrice: 1500,
    weight: '100g',
    category: 'fruit',
    theme: {
      background: '#C4960C',
      backgroundDark: '#A37D0A',
      accent: '#FFF8E1',
    },
    video: { webm: '/videos/banana.webm', mp4: '/videos/banana.mp4' },
    images: { pack: '/images/products/banana-pack.png', ingredients: ['/images/ingredients/banana-1.png', '/images/ingredients/banana-2.png'] },
    inStock: true,
    emoji: '🍌',
    stripeProductId: '',
    stripePriceId: '',
  },
  {
    id: 'pineapple-rings',
    slug: 'pineapple-rings',
    name: 'Pineapple',
    subtitle: 'Tropical Collection',
    description: 'Sun-dried pineapple rings with a perfect balance of sweet and tangy. A tropical escape in every bite.',
    price: 1600,
    compareAtPrice: 2200,
    weight: '90g',
    category: 'fruit',
    theme: {
      background: '#D4A017',
      backgroundDark: '#B58814',
      accent: '#FFF9E0',
    },
    video: { webm: '/videos/pineapple.webm', mp4: '/videos/pineapple.mp4' },
    images: { pack: '/images/products/pineapple-pack.png', ingredients: ['/images/ingredients/pineapple-1.png', '/images/ingredients/pineapple-2.png'] },
    inStock: true,
    emoji: '🍍',
    stripeProductId: '',
    stripePriceId: '',
  },
  {
    id: 'strawberry-slices',
    slug: 'strawberry-slices',
    name: 'Strawberry',
    subtitle: 'Berry Collection',
    description: 'Delicate strawberry slices, freeze-dried to preserve vibrant color and intense berry flavor. Light as air, bold in taste.',
    price: 1800,
    compareAtPrice: 2400,
    weight: '60g',
    category: 'fruit',
    theme: {
      background: '#C41E3A',
      backgroundDark: '#9E1830',
      accent: '#FFE0E6',
    },
    video: { webm: '/videos/strawberry.webm', mp4: '/videos/strawberry.mp4' },
    images: { pack: '/images/products/strawberry-pack.png', ingredients: ['/images/ingredients/strawberry-1.png', '/images/ingredients/strawberry-2.png'] },
    inStock: true,
    emoji: '🍓',
    stripeProductId: '',
    stripePriceId: '',
  },
  {
    id: 'kiwi-chips',
    slug: 'kiwi-chips',
    name: 'Kiwi',
    subtitle: 'Exotic Collection',
    description: 'Tangy kiwi chips packed with vitamin C. A zesty, refreshing snack that brightens any moment of your day.',
    price: 1500,
    compareAtPrice: 2000,
    weight: '70g',
    category: 'fruit',
    theme: {
      background: '#5B8C2A',
      backgroundDark: '#4A7322',
      accent: '#E8F5D6',
    },
    video: { webm: '/videos/kiwi.webm', mp4: '/videos/kiwi.mp4' },
    images: { pack: '/images/products/kiwi-pack.png', ingredients: ['/images/ingredients/kiwi-1.png', '/images/ingredients/kiwi-2.png'] },
    inStock: true,
    emoji: '🥝',
    stripeProductId: '',
    stripePriceId: '',
  },
  {
    id: 'orange-chips',
    slug: 'orange-chips',
    name: 'Orange',
    subtitle: 'Citrus Collection',
    description: 'Thin-sliced orange chips with a bittersweet citrus punch. Perfect for snacking, cocktail garnish, or gourmet plating.',
    price: 1300,
    compareAtPrice: 1800,
    weight: '80g',
    category: 'fruit',
    theme: {
      background: '#E36812',
      backgroundDark: '#C45810',
      accent: '#FFF0DD',
    },
    video: { webm: '/videos/orange.webm', mp4: '/videos/orange.mp4' },
    images: { pack: '/images/products/orange-pack.png', ingredients: ['/images/ingredients/orange-1.png', '/images/ingredients/orange-2.png'] },
    inStock: true,
    emoji: '🍊',
    stripeProductId: '',
    stripePriceId: '',
  },
  {
    id: 'pear-chips',
    slug: 'pear-chips',
    name: 'Pear',
    subtitle: 'Classic Collection',
    description: 'Gently dried pear slices with a honey-like sweetness. A refined, elegant snack that melts on your tongue.',
    price: 1400,
    compareAtPrice: 1900,
    weight: '80g',
    category: 'fruit',
    theme: {
      background: '#8B7D3C',
      backgroundDark: '#736732',
      accent: '#F5F0D6',
    },
    video: { webm: '/videos/pear.webm', mp4: '/videos/pear.mp4' },
    images: { pack: '/images/products/pear-pack.png', ingredients: ['/images/ingredients/pear-1.png', '/images/ingredients/pear-2.png'] },
    inStock: true,
    emoji: '🍐',
    stripeProductId: '',
    stripePriceId: '',
  },
  {
    id: 'beetroot-chips',
    slug: 'beetroot-chips',
    name: 'Beetroot',
    subtitle: 'Veggie Collection',
    description: 'Vibrant beetroot chips — earthy, crunchy, and packed with antioxidants. A superfood snack with stunning natural color.',
    price: 1200,
    compareAtPrice: 1600,
    weight: '80g',
    category: 'vegetable',
    theme: {
      background: '#6B1D3B',
      backgroundDark: '#561830',
      accent: '#F5D6E3',
    },
    video: { webm: '/videos/beetroot.webm', mp4: '/videos/beetroot.mp4' },
    images: { pack: '/images/products/beetroot-pack.png', ingredients: ['/images/ingredients/beetroot-1.png', '/images/ingredients/beetroot-2.png'] },
    inStock: true,
    emoji: '🫒',
    stripeProductId: '',
    stripePriceId: '',
  },
  {
    id: 'carrot-chips',
    slug: 'carrot-chips',
    name: 'Carrot',
    subtitle: 'Veggie Collection',
    description: 'Sweet carrot chips, naturally rich in beta-carotene. A crunchy, healthy alternative to traditional snacks.',
    price: 1100,
    compareAtPrice: 1500,
    weight: '90g',
    category: 'vegetable',
    theme: {
      background: '#D4650A',
      backgroundDark: '#B35508',
      accent: '#FFE4CC',
    },
    video: { webm: '/videos/carrot.webm', mp4: '/videos/carrot.mp4' },
    images: { pack: '/images/products/carrot-pack.png', ingredients: ['/images/ingredients/carrot-1.png', '/images/ingredients/carrot-2.png'] },
    inStock: true,
    emoji: '🥕',
    stripeProductId: '',
    stripePriceId: '',
  },
  {
    id: 'zucchini-chips',
    slug: 'zucchini-chips',
    name: 'Zucchini',
    subtitle: 'Veggie Collection',
    description: 'Light and crispy zucchini chips with a subtle, savory flavor. The perfect low-calorie crunch for health-conscious snackers.',
    price: 1100,
    compareAtPrice: 1500,
    weight: '70g',
    category: 'vegetable',
    theme: {
      background: '#4A7C3F',
      backgroundDark: '#3D6634',
      accent: '#E0F0D6',
    },
    video: { webm: '/videos/zucchini.webm', mp4: '/videos/zucchini.mp4' },
    images: { pack: '/images/products/zucchini-pack.png', ingredients: ['/images/ingredients/zucchini-1.png', '/images/ingredients/zucchini-2.png'] },
    inStock: true,
    emoji: '🥒',
    stripeProductId: '',
    stripePriceId: '',
  },
  {
    id: 'tomato-chips',
    slug: 'tomato-chips',
    name: 'Tomato',
    subtitle: 'Veggie Collection',
    description: 'Intense sun-dried tomato chips with a rich, umami depth. A Mediterranean-inspired snack full of concentrated flavor.',
    price: 1200,
    compareAtPrice: 1700,
    weight: '80g',
    category: 'vegetable',
    theme: {
      background: '#B22222',
      backgroundDark: '#8B1A1A',
      accent: '#FFD4D4',
    },
    video: { webm: '/videos/tomato.webm', mp4: '/videos/tomato.mp4' },
    images: { pack: '/images/products/tomato-pack.png', ingredients: ['/images/ingredients/tomato-1.png', '/images/ingredients/tomato-2.png'] },
    inStock: true,
    emoji: '🍅',
    stripeProductId: '',
    stripePriceId: '',
  },
  {
    id: 'tropical-mix',
    slug: 'tropical-mix',
    name: 'Tropical Mix',
    subtitle: 'Mix Collection',
    description: 'A curated blend of mango, pineapple, banana and coconut. The ultimate tropical escape — one bag, four destinations.',
    price: 1800,
    compareAtPrice: 2500,
    weight: '120g',
    category: 'mix',
    theme: {
      background: '#D4820A',
      backgroundDark: '#B36E08',
      accent: '#FFE8C2',
    },
    video: { webm: '/videos/tropical-mix.webm', mp4: '/videos/tropical-mix.mp4' },
    images: { pack: '/images/products/tropical-mix-pack.png', ingredients: ['/images/ingredients/tropical-1.png', '/images/ingredients/tropical-2.png', '/images/ingredients/tropical-3.png'] },
    inStock: true,
    emoji: '🌴',
    stripeProductId: '',
    stripePriceId: '',
  },
  {
    id: 'veggie-mix',
    slug: 'veggie-mix',
    name: 'Veggie Mix',
    subtitle: 'Mix Collection',
    description: 'A colorful assortment of beetroot, carrot, zucchini and tomato chips. Garden-fresh crunch, beautifully balanced.',
    price: 1600,
    compareAtPrice: 2200,
    weight: '120g',
    category: 'mix',
    theme: {
      background: '#3D6B3D',
      backgroundDark: '#2E522E',
      accent: '#D6F0D6',
    },
    video: { webm: '/videos/veggie-mix.webm', mp4: '/videos/veggie-mix.mp4' },
    images: { pack: '/images/products/veggie-mix-pack.png', ingredients: ['/images/ingredients/veggie-1.png', '/images/ingredients/veggie-2.png', '/images/ingredients/veggie-3.png'] },
    inStock: true,
    emoji: '🥗',
    stripeProductId: '',
    stripePriceId: '',
  },
  {
    id: 'pumpkin-soup-mix',
    slug: 'pumpkin-soup-mix',
    name: 'Pumpkin Soup',
    subtitle: 'Soup Collection',
    description: 'Velvety pumpkin cream soup mix — just add water. Rich in vitamins, bursting with natural flavor. Comfort in a cup.',
    price: 1450,
    compareAtPrice: 2000,
    weight: '150g',
    category: 'soup',
    theme: {
      background: '#D4820A',
      backgroundDark: '#B36E08',
      accent: '#FFE8C2',
    },
    video: { webm: '/videos/pumpkin-soup.webm', mp4: '/videos/pumpkin-soup.mp4' },
    images: { pack: '/images/products/pumpkin-soup-pack.png', ingredients: ['/images/ingredients/pumpkin-1.png', '/images/ingredients/pumpkin-2.png'] },
    inStock: true,
    emoji: '🎃',
    stripeProductId: '',
    stripePriceId: '',
  },
];

// Helper: format price from cents
export function formatPrice(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}

// Helper: get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

// Helper: get products by category
export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter(p => p.category === category);
}
