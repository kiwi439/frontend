import { Products } from 'types/product';
import { calculateGrossPrice, calculateProductsTotalPrice, formatPrice } from 'utils/pricing';

describe('calculateGrossPrice', () => {
  test('should return net price when vat rate is 0', () => {
    expect(calculateGrossPrice(23.99, 0)).toBe(23.99);
  });

  test('should return gross price with 23% vat', () => {
    expect(calculateGrossPrice(10.99, 23)).toBe(13.52);
    expect(calculateGrossPrice(124.99, 23)).toBe(153.74);
    expect(calculateGrossPrice(599.99, 23)).toBe(737.99);
  });
});

describe('calculateProductsTotalPrice', () => {
  test('should return 0 for empty products', () => {
    const products: Products = [];

    expect(calculateProductsTotalPrice(products)).toBe(0);
  });

  test('should return proper value for multiple products', () => {
    const products: Products = [
      {
        id: '088035a3-5061-4ea2-8f43-1cb3f038cb82',
        quantity: 12,
        attributes: {
          availableQuantity: 30,
          id: '088035a3-5061-4ea2-8f43-1cb3f038cb82',
          name: 'Powłoka przeciwwilgociowa',
          pictureBucket: 'budoman-development',
          pictureKey: 'images/products/foundation_materials/powłoka_przeciwwilgociowa.jpeg',
          price: 23.99,
          vatRate: 23,
          __typename: 'ProductObject'
        }
      }
    ];

    expect(calculateProductsTotalPrice(products)).toBe(354.12);
  });
});

describe('formatPrice', () => {
  test('should format price correctly', () => {
    expect(formatPrice(123.99)).toBe('123,99');
  });
});
