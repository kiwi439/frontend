import React from 'react';
import { screen } from '@testing-library/react';
import { generatePreloadedState } from 'tests/integration/helpers/preloadedState';
import renderWithProviders from 'tests/integration/helpers/renderWithProviders';
import Product from 'components/product/Product';

jest.mock('hooks/useFetchUrl', () => ({
  __esModule: true,
  default: () => 'https://example.com/mock-image.jpg'
}));

const product = {
  id: '088fc480-ce29-4d10-852a-971d60a01e59',
  name: 'Powłoka przeciwwilgociowa',
  pictureBucket: 'budoman-development',
  pictureKey: 'images/products/foundation_materials/powłoka_przeciwwilgociowa.jpeg',
  price: 599.99,
  vatRate: 23,
  availableQuantity: 3,
  __typename: 'ProductObject'
};

describe('Product', () => {
  it('renders component successfully is main mode', () => {
    renderWithProviders(<Product product={product} index={0} mode="main" />);

    expect(screen.getByAltText('Zdjęcie produktu')).toBeInTheDocument();
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText('737,99 zł')).toBeInTheDocument();
    expect(screen.getByText(/Lorem ipsum, dolor/)).toBeInTheDocument();
    expect(screen.getByText('Dodaj do koszyka')).toBeInTheDocument();
  });

  it('renders component successfully is basket mode', () => {
    const preloadedState = generatePreloadedState({
      basketStatePresent: true,
      basketState: { addedProducts: [{ id: product.id, quantity: 222, attributes: { ...product } }] }
    });

    renderWithProviders(<Product product={product} index={0} mode="basket" />, { preloadedState });

    expect(screen.getByAltText('Zdjęcie produktu')).toBeInTheDocument();
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText('737,99 zł')).toBeInTheDocument();
    expect(screen.getByText(/Lorem ipsum, dolor/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(222)).toBeInTheDocument();
  });

  it('renders product not available when available quantity is zero', () => {
    renderWithProviders(<Product product={{ ...product, availableQuantity: 0 }} index={0} mode="main" />);
    expect(screen.getByText('Produkt niedostępny')).toBeInTheDocument();
  });
});
