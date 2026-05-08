import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { setName, setSurname, setStreet, setCity, setPostalCode, setEmail, setPhoneNumber, setDeliveryMethod } from './actionsCreator';

const persistConfig = { key: 'order', storage };
const initialState = {
  clientDetails: { name: '', surname: '', street: '', city: '', postalCode: '', email: '', phoneNumber: '' },
  deliveryMethod: 'in_post',
  payment: { stripePayment: true }
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setName, (state, { payload }) => {
      state.clientDetails.name = payload;
    })
    .addCase(setSurname, (state, { payload }) => {
      state.clientDetails.surname = payload;
    })
    .addCase(setStreet, (state, { payload }) => {
      state.clientDetails.street = payload;
    })
    .addCase(setCity, (state, { payload }) => {
      state.clientDetails.city = payload;
    })
    .addCase(setPostalCode, (state, { payload }) => {
      state.clientDetails.postalCode = payload;
    })
    .addCase(setEmail, (state, { payload }) => {
      state.clientDetails.email = payload;
    })
    .addCase(setPhoneNumber, (state, { payload }) => {
      state.clientDetails.phoneNumber = payload;
    })
    .addCase(setDeliveryMethod, (state, { payload }) => {
      state.deliveryMethod = payload;
    });
});

export default persistReducer(persistConfig, reducer);
