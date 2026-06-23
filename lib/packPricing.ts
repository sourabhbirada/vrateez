export interface PackOption {
  units: number;
  label?: string;
  discountPercent: number;
}

export interface PackPricingProduct {
  price: number;
  packOptions?: PackOption[];
}

export function getPackOptionForQuantity(product: PackPricingProduct, quantity: number) {
  if (!product.packOptions?.length) return null;
  return product.packOptions.find((pack) => pack.units === quantity) || null;
}

export function getEffectiveUnitPrice(product: PackPricingProduct, quantity: number) {
  const basePrice = product.price;
  const pack = getPackOptionForQuantity(product, quantity);
  if (!pack?.discountPercent) return basePrice;
  const discounted = basePrice * (1 - pack.discountPercent / 100);
  return Math.round(discounted * 100) / 100;
}

export function getPackTotal(product: PackPricingProduct, units: number) {
  return Math.round(getEffectiveUnitPrice(product, units) * units * 100) / 100;
}

export function getPackLabel(pack: PackOption) {
  return pack.label?.trim() || `Pack of ${pack.units}`;
}
