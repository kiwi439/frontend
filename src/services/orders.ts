import { findKey, snakeCase } from 'lodash';
import { store } from 'redux_/store';

export const generateAddOrderPayload = () => {
  const {
    basket: { addedProducts },
    order: { clientDetails, delivery },
    user: { loggedUserId }
  } = store.getState();

  const deliveryMethod = snakeCase(findKey(delivery, (deliveryMethod_) => deliveryMethod_));
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
