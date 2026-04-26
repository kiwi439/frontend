import { store } from 'redux_/store';
import { withPersist } from 'tests/helpers/storeUtils';
import { generateAddOrderPayload } from 'services/orders';

describe('generateAddOrderPayload', () => {
  it('returns proper payload based on input', () => {
    jest.spyOn(store, 'getState').mockReturnValue({
      basket: withPersist({
        addedProducts: [
          {
            id: '99297ff9-e0f9-4d71-b3d4-461ac09e3eec',
            quantity: 2,
            attributes: {
              id: '99297ff9-e0f9-4d71-b3d4-461ac09e3eec',
              availableQuantity: 98,
              name: 'Grunt głęboko penetrujący',
              pictureBucket: 'budoman-development',
              pictureKey: 'images/products/constuction_chemicals/grunt_gleboko_penetrujacy.jpeg',
              price: 174.99,
              __typename: 'ProductObject'
            }
          },
          {
            id: 'a2e9ad84-8ad2-4a74-a511-b67b55aab6cc',
            quantity: 5,
            attributes: {
              id: 'a2e9ad84-8ad2-4a74-a511-b67b55aab6cc',
              availableQuantity: 95,
              name: 'Wspornik łaty kalenicowej',
              pictureBucket: 'budoman-development',
              pictureKey: 'images/products/roof_ accessories/wspornik_laty_kalenicowej.jpeg',
              price: 184.99,
              __typename: 'ProductObject'
            }
          }
        ]
      }),
      order: withPersist({
        clientDetails: {
          name: 'Michal',
          surname: 'Siwiec',
          city: 'Gliwice',
          postalCode: '44-100',
          street: 'Gruszczynskiego',
          email: 'siwiec.michal724@gmail.com',
          phoneNumber: '724131140'
        },
        delivery: {
          inPost: false,
          dpd: true,
          pickUpAtThePoint: false
        },
        payment: {
          cashPayment: true,
          traditionalTransfer: false
        },
        orderID: null,
        totalPrice: null,
        paymentMethod: null
      }),
      user: withPersist({
        loggedUserId: '2e785e4-93d5-42f4-aea1-8196b26a4f49',
        avatars: []
      })
    });

    const result = generateAddOrderPayload();

    expect(result).toEqual({
      name: 'Michal',
      surname: 'Siwiec',
      city: 'Gliwice',
      postalCode: '44-100',
      street: 'Gruszczynskiego',
      email: 'siwiec.michal724@gmail.com',
      phoneNumber: '724131140',
      deliveryMethod: 'dpd',
      paymentMethod: 'stripe_payment',
      userId: '2e785e4-93d5-42f4-aea1-8196b26a4f49',
      productsOrder: [
        { productId: '99297ff9-e0f9-4d71-b3d4-461ac09e3eec', productQuantity: 2 },
        { productId: 'a2e9ad84-8ad2-4a74-a511-b67b55aab6cc', productQuantity: 5 }
      ]
    });
  });
});
