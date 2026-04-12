import React from 'react';
import { screen, within } from '@testing-library/react';
import renderWithProviders from 'tests/integration/helpers/renderWithProviders';
import ProductNotAvailable from 'components/product/ProductNotAvailable';

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
  availableQuantity: 0,
  __typename: 'ProductObject'
};

describe('ProductNotAvailable', () => {
  it('renders properly component', () => {
    renderWithProviders(<ProductNotAvailable product={product} index={0} />);

    expect(screen.getByRole('img', { name: 'Zdjęcie produktu' })).toHaveAttribute('src', 'https://example.com/mock-image.jpg');
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText('599,99 zł')).toBeInTheDocument();
    expect(screen.getByText('Produkt niedostępny')).toBeInTheDocument();
    expect(screen.queryByText('Dodaj do koszyka')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Dodaj do koszyka' })).not.toBeInTheDocument();
  });
});
