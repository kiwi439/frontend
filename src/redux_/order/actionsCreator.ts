import { createAction } from '@reduxjs/toolkit';

type SetDeliveryMethodPayload = { inPost: boolean, dpd: boolean, pickUpAtThePoint: boolean };

export const setName = createAction<string>('setName');
export const setSurname = createAction<string>('setSurname');
export const setStreet = createAction<string>('setStreet');
export const setCity = createAction<string>('setCity');
export const setPostalCode = createAction<string>('setPostalCode');
export const setEmail = createAction<string>('setEmail');
export const setPhoneNumber = createAction<string>('setPhoneNumber');
export const setDeliveryMethod = createAction<SetDeliveryMethodPayload>('setDeliveryMethod');
