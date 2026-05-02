import { generateAddedProductPayload, generatePossibleProductQuantity } from 'services/products';

describe('generateAddedProductPayload', () => {
  test('should return proper object with properties', () => {
    const productAttributes = {
      availableQuantity: 100,
      id: '9557c49d-97cb-4eb6-b9c5-8103153d94f9',
      name: 'Kratka zabezpieczająca przed ptactwem',
      pictureBucket: 'budoman-development',
      pictureKey: 'images/products/roof_ accessories/kratka_zabezpieczajaca_przed_ptactwem.jpeg',
      price: 199.99,
      __typename: 'ProductObject'
    };

    const response = generateAddedProductPayload(productAttributes, 4);

    expect(response).toEqual({
      id: '9557c49d-97cb-4eb6-b9c5-8103153d94f9',
      quantity: 4,
      attributes: productAttributes
    });
  });
});

describe('generatePossibleProductQuantity', () => {
  it('should subtract the quantity of the product already in the basket', () => {
    const productsInBasket = [
      {
        id: 'ee6ae609-e84c-4b7a-98f6-298001aa1bbe',
        quantity: 2,
        attributes: {
          availableQuantity: 100,
          id: 'ee6ae609-e84c-4b7a-98f6-298001aa1bbe',
          name: 'Kratka zabezpieczająca przed ptactwem',
          pictureBucket: 'budoman-development',
          pictureKey: 'images/products/roof_ accessories/kratka_zabezpieczajaca_przed_ptactwem.jpeg',
          price: 199.99,
          __typename: 'ProductObject'
        }
      },
      {
        id: '9cb9595d-9229-4563-85b2-724628beac78',
        quantity: 7,
        attributes: {
          availableQuantity: 38,
          id: '9cb9595d-9229-4563-85b2-724628beac78',
          name: 'Syropian fundamentowy 15 cm',
          pictureBucket: 'budoman-development',
          pictureKey: 'images/products/foundation_materials/styropian_fundamentowy_15cm.png',
          price: 34.99,
          __typename: 'ProductObject'
        }
      }
    ];

    const result = generatePossibleProductQuantity('ee6ae609-e84c-4b7a-98f6-298001aa1bbe', productsInBasket, 100);

    expect(result).toBe(98);
  });

  it('should return full available quantity if product is not in the basket', () => {
    const productsInBasket = [
      {
        id: 'ee6ae609-e84c-4b7a-98f6-298001aa1bbe',
        quantity: 2,
        attributes: {
          availableQuantity: 100,
          id: 'ee6ae609-e84c-4b7a-98f6-298001aa1bbe',
          name: 'Kratka zabezpieczająca przed ptactwem',
          pictureBucket: 'budoman-development',
          pictureKey: 'images/products/roof_ accessories/kratka_zabezpieczajaca_przed_ptactwem.jpeg',
          price: 199.99,
          __typename: 'ProductObject'
        }
      },
      {
        id: '9cb9595d-9229-4563-85b2-724628beac78',
        quantity: 7,
        attributes: {
          availableQuantity: 38,
          id: '9cb9595d-9229-4563-85b2-724628beac78',
          name: 'Syropian fundamentowy 15 cm',
          pictureBucket: 'budoman-development',
          pictureKey: 'images/products/foundation_materials/styropian_fundamentowy_15cm.png',
          price: 34.99,
          __typename: 'ProductObject'
        }
      }
    ]

    const result = generatePossibleProductQuantity('9557c49d-97cb-4eb6-b9c5-8103153d94f9', productsInBasket, 12);

    expect(result).toBe(12);
  });
});
