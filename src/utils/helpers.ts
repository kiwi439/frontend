import { Products } from 'types/product';
import { DELIVERY_METHODS_CONFIGURATION, DeliveryMethods } from 'data/deliveryMethods';

export const countProductsTotalPrice = (products: Products) => {
  const initialValue = 0;

  return products.reduce((prev, { quantity, attributes: { price } }) => (
    (quantity * price) + prev
  ), initialValue);
};

export const countOrderTotalPrice = (products: Products, deliveryMethod: DeliveryMethods) => {
  const productsPrice = countProductsTotalPrice(products);
  const deliveryPrice = DELIVERY_METHODS_CONFIGURATION[deliveryMethod].price;

  return (productsPrice + deliveryPrice);
};

export const formatPhoneNumber = (phoneNumber: string) => {
  const phoneNumberToArray = phoneNumber.split('');
  const initialValue = '';

  return phoneNumberToArray.reduce((prev, next, index) => {
    const isSpaceNeeded = index !== 0 && index % 3 === 0;
    const separator = isSpaceNeeded ? ' ' : '';

    return `${prev}${separator}${next}`;
  }, initialValue);
};

export const cutAfterNChars = (text: string, charsQuantity: number) => {
  const stringLength = text.length;
  const narrowContent = text.slice(0, charsQuantity);
  const restOfContent = text.slice(charsQuantity, stringLength);

  return { narrowContent, restOfContent };
};

export const scrollIntoElement = (elementSelector: string) => {
  const htmlElement = document.querySelector(elementSelector);

  if (htmlElement) {
    htmlElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export const formatPrice = (price: number) => price.toFixed(2).toString().replace('.', ',');
export const isTextLonger = (text: string, charsQuantity: number) => text.length > charsQuantity;
export const formatTimestamp = (timeStamp: string) => (
  new Date(timeStamp).toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
);
export const validateByRegexp = (regexp: RegExp, subject: string) => regexp.test(subject);
export const areTheSame = (val1: string, val2: string) => val1 === val2;
