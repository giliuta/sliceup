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
  pack: string;
  ingredients: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  weight: string;
  category: "fruit" | "vegetable" | "mix" | "soup";
  theme: ProductTheme;
  video: ProductVideo;
  images: ProductImages;
  inStock: boolean;
  emoji: string;
  stripeProductId: string;
  stripePriceId: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
