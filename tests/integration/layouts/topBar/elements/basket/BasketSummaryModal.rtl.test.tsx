import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import renderWithProviders from 'tests/integration/helpers/renderWithProviders';
import { generatePreloadedState } from 'tests/integration/helpers/preloadedState';
import BasketSummaryModal from 'layouts/topBar/elements/basket/BasketSummaryModal';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('BasketSummaryModal', () => {
  const preloadedState = generatePreloadedState({
    basketStatePresent: true,
    basketState: {
      addedProducts: [
        {
          id: 'da97aa73-f0e4-4a17-9157-9f17454c73f3',
          quantity: 3,
          attributes: {
            id: 'da97aa73-f0e4-4a17-9157-9f17454c73f3',
            name: 'Bloczek Termalika',
            price: 124.99,
            availableQuantity: 1000,
            pictureKey: 'images/products/foundation_materials/bloczke_termalika.jpeg',
            pictureBucket: 'budoman-development',
            __typename: 'ProductObject'
          }
        }
      ]
    }
  });

  it('renders basket correctly', () => {
    renderWithProviders(<BasketSummaryModal open handleOnClose={() => {}} />, { preloadedState });

    expect(screen.getByText('Kontynuuj zakupy')).toBeInTheDocument();
    expect(screen.getByText('Bloczek Termalika')).toBeInTheDocument();
  });

  it('navigates to /order and calls handleOnClose when clicking "Kontynuuj zakupy"', () => {
    const handleOnClose = jest.fn();

    renderWithProviders(<BasketSummaryModal open handleOnClose={handleOnClose} />, { preloadedState });

    const button = screen.getByText('Kontynuuj zakupy');
    fireEvent.mouseDown(button);

    expect(handleOnClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/order');
  });
});
