import { Products } from 'types/product';
import { calculateProductsTotalPrice, formatPrice } from 'utils/pricing';

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
          vatRate: 0,
          __typename: 'ProductObject'
        }
      }
    ];

    expect(calculateProductsTotalPrice(products)).toBe(287.88);
  });
});

describe('formatPrice', () => {
  test('should format price correctly', () => {
    expect(formatPrice(123.99)).toBe('123,99');
  });
});
