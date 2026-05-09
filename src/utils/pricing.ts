import { Products } from 'types/product';
import type { DeliveryMethodConfig } from 'data/deliveryMethods';

export const formatPrice = (price: number) => price.toFixed(2).toString().replace('.', ',');

export const calculateGrossPrice = (netPrice: number, vatRatePercent: number): number => {
  const vatMultiplier = (1 + vatRatePercent / 100);
  const grossPrice = netPrice * vatMultiplier;

  return Number(grossPrice.toFixed(2));
};

export const calculateProductsTotalPrice = (products: Products) => products.reduce((prev, { quantity, attributes }) => {
  const grossPrice = calculateGrossPrice(attributes.price, attributes.vatRate);

  return prev + (grossPrice * quantity);
}, 0);

export const calculateOrderTotalPrice = (products: Products, delivery: DeliveryMethodConfig) => {
  const productsGross = calculateProductsTotalPrice(products);
  const deliveryGross = calculateGrossPrice(delivery.price, delivery.vatRate);

  return productsGross + deliveryGross;
};
