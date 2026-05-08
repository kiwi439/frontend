import { store } from 'redux_/store';

export const generateAddOrderPayload = () => {
  const {
    basket: { addedProducts },
    order: { clientDetails, deliveryMethod },
    user: { loggedUserId }
  } = store.getState();

  const paymentMethod = 'stripe_payment';
  const productsOrder = addedProducts.map(({ id, quantity }) => ({ productId: id, productQuantity: quantity }));

  return {
    ...clientDetails,
    deliveryMethod,
    paymentMethod,
    userId: loggedUserId,
    productsOrder
  };
};
