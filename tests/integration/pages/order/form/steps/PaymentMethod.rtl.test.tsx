import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import renderWithProviders from 'tests/integration/helpers/renderWithProviders';
import PaymentMethod from 'pages/order/form/steps/PaymentMethod';
import { OrderContext } from 'contexts/contexts';

describe('PaymentMethod', () => {
  it('renders available payment options', () => {
    renderWithProviders(
      <OrderContext.Provider value={{ step: 1, setStep: () => {} }}>
        <PaymentMethod />
      </OrderContext.Provider>
    );

    expect(screen.getByTestId('stripe-payment-checkbox')).toBeInTheDocument();
    expect(screen.getByText('Płatność Stripe')).toBeInTheDocument();
    expect(screen.getByText('Dalej')).toBeInTheDocument();
  });

  it('sets next step after click in submit button', () => {
    const setStep = jest.fn();

    renderWithProviders(
      <OrderContext.Provider value={{ step: 2, setStep }}>
        <PaymentMethod />
      </OrderContext.Provider>
    );

    fireEvent.mouseDown(screen.getByText('Dalej'));

    expect(setStep).toHaveBeenCalledWith(3);
  });
});
