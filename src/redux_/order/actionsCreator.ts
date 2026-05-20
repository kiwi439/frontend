import { createAction } from '@reduxjs/toolkit';
import { DeliveryMethods } from 'data/deliveryMethods';

export const setName = createAction<string>('setName');
export const setSurname = createAction<string>('setSurname');
export const setStreet = createAction<string>('setStreet');
export const setCity = createAction<string>('setCity');
export const setPostalCode = createAction<string>('setPostalCode');
export const setEmail = createAction<string>('setEmail');
export const setPhoneNumber = createAction<string>('setPhoneNumber');
export const setDeliveryMethod = createAction<DeliveryMethods>('setDeliveryMethod');
