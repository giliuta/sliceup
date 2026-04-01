export function formatPrice(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
