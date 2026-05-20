import { RootState, WithoutPersist } from 'types/store';
import { withPersist } from 'tests/helpers/storeUtils';

const USER_EXAMPLE_STATE: WithoutPersist<RootState['user']> = { loggedUserId: '0c1069c7-8e77-4749-bc4b-e308c6679d1c', avatars: [] };
const BASKET_EXAMPLE_STATE: WithoutPersist<RootState['basket']> = { addedProducts: [] };
const ORDER_EXAMPLE_STATE = {
  clientDetails: {
    name: 'Michal',
    surname: 'Siwiec',
    street: 'Tadeusza Gruszczynskiego',
    city: 'Gliwice',
    postalCode: '44-100',
    email: 'siwiec.michal724@gmail.com',
    phoneNumber: '724131140'
  },
  delivery: {
    inPost: true,
    dpd: false,
    pickUpAtThePoint: false
  },
  payment: {
    stripePayment: true
  },
  orderID: 'da97aa73-f0e4-4a17-9157-9f17454c73f3',
  totalPrice: 199.99
}

export const  generatePreloadedState = ({
  userStatePresent = false,
  basketStatePresent = false,
  orderStatePresent = false,
  userState = USER_EXAMPLE_STATE,
  basketState = BASKET_EXAMPLE_STATE,
  orderState = ORDER_EXAMPLE_STATE
} = {}) => {
  const state: any = {}; // TODO

  if (userStatePresent) {
    state.user = withPersist(userState)
  };

  if (basketStatePresent) {
    state.basket = withPersist(basketState)
  }

  if (orderStatePresent) {
    state.order = withPersist(orderState)
  }

  return state;
}
