import { Product, Products } from 'types/product';

export const generateAddedProductPayload = (product: Product['attributes'], selectedQuantity: number) => ({
  id: product.id,
  quantity: selectedQuantity,
  attributes: product
});

export const generatePossibleProductQuantity = (productID: string, productsInBasket: Products , availableQuantity: number) => {
  const productQuantityInBasket = productsInBasket.find(({ id }) => id === productID)?.quantity || 0;

  return availableQuantity - productQuantityInBasket;
};
