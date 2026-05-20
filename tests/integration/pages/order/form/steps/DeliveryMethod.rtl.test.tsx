import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import renderWithProviders from 'tests/integration/helpers/renderWithProviders';
import DeliveryMethod from 'pages/order/form/steps/DeliveryMethod';
import { OrderContext } from 'contexts/contexts';

describe('DeliveryMethod', () => {
  it('renders available delivery options', () => {
    renderWithProviders(
      <OrderContext.Provider value={{ step: 1, setStep: () => {} }}>
        <DeliveryMethod />
      </OrderContext.Provider>
    );

    expect(screen.getByTestId('inpost-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('dpd-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('pickup-at-the-point-checkbox')).toBeInTheDocument();

    expect(screen.getByText('Inpost (13,52 zł)')).toBeInTheDocument();
    expect(screen.getByText('DPD (19,67 zł)')).toBeInTheDocument();
    expect(screen.getByText('Odbiór w punkcie (0,00 zł)')).toBeInTheDocument();

    expect(screen.getByText('Dalej')).toBeInTheDocument();
  });

  it('changes selected delivery method after checkbox change', () => {
    renderWithProviders(
      <OrderContext.Provider value={{ step: 1, setStep: () => {} }}>
        <DeliveryMethod />
      </OrderContext.Provider>
    );

    expect(screen.getByTestId('inpost-checkbox')).toBeChecked();

    fireEvent.click(screen.getByTestId('dpd-checkbox'));

    expect(screen.getByTestId('inpost-checkbox')).not.toBeChecked();
    expect(screen.getByTestId('dpd-checkbox')).toBeChecked();
    expect(screen.getByTestId('pickup-at-the-point-checkbox')).not.toBeChecked();
  });

  it('sets next step after click in submit button', () => {
    const setStep = jest.fn();

    renderWithProviders(
      <OrderContext.Provider value={{ step: 1, setStep }}>
        <DeliveryMethod />
      </OrderContext.Provider>
    );

    fireEvent.mouseDown(screen.getByText('Dalej'));

    expect(setStep).toHaveBeenCalledWith(2);
  });
});
