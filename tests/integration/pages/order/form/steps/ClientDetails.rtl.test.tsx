import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import renderWithProviders from 'tests/integration/helpers/renderWithProviders';
import { generatePreloadedState } from 'tests/integration/helpers/preloadedState';
import ClientDetails from 'pages/order/form/steps/ClientDetails';
import { OrderContext } from 'contexts/contexts';
import { USER_PERSONAL_DETAILS } from 'graphql/queries/user';

describe('ClientDetails', () => {
  it('renders all client details inputs and submit button', () => {
    const preloadedState = generatePreloadedState({
      userStatePresent: true,
      orderStatePresent: true,
      userState: { loggedUserId: null, avatars: [] }
    });

    renderWithProviders(
      <OrderContext.Provider value={{ step: 0, setStep: () => {} }}>
        <ClientDetails />
      </OrderContext.Provider>,
      { preloadedState }
    );

    expect(screen.getByPlaceholderText('Imię')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nazwisko')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ulica')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Miasto')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Kod pocztowy')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Adres email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Numer telefonu')).toBeInTheDocument();
    expect(screen.getByText('Dalej')).toBeInTheDocument();
  });

  it('sets next step when all client details are valid', () => {
    const setStep = jest.fn();
    const preloadedState = generatePreloadedState({
      userStatePresent: true,
      orderStatePresent: true,
      userState: { loggedUserId: null, avatars: [] }
    });

    renderWithProviders(
      <OrderContext.Provider value={{ step: 0, setStep }}>
        <ClientDetails />
      </OrderContext.Provider>,
      { preloadedState }
    );

    fireEvent.mouseDown(screen.getByText('Dalej'));

    expect(setStep).toHaveBeenCalledWith(1);
  });

  it('does not set next step when client details are invalid', () => {
    const setStep = jest.fn();
    const preloadedState = generatePreloadedState({
      userStatePresent: true,
      orderStatePresent: true,
      userState: { loggedUserId: null, avatars: [] },
      orderState: {
        clientDetails: {
          name: '',
          surname: '',
          street: '',
          city: '',
          postalCode: '',
          email: '',
          phoneNumber: ''
        },
        delivery: {
          inPost: true,
          dpd: false,
          pickUpAtThePoint: false
        },
        payment: {
          stripePayment: true
        },
        orderID: null,
        paymentMethod: null,
        totalPrice: null
      }
    });

    renderWithProviders(
      <OrderContext.Provider value={{ step: 0, setStep }}>
        <ClientDetails />
      </OrderContext.Provider>,
      { preloadedState }
    );

    fireEvent.mouseDown(screen.getByText('Dalej'));

    expect(setStep).not.toHaveBeenCalled();
  });

  it('fetches and sets default client details for logged user', async () => {
    const preloadedState = generatePreloadedState({
      userStatePresent: true,
      orderStatePresent: true,
      userState: { loggedUserId: '0c1069c7-8e77-4749-bc4b-e308c6679d1c', avatars: [] },
      orderState: {
        clientDetails: {
          name: '',
          surname: '',
          street: '',
          city: '',
          postalCode: '',
          email: '',
          phoneNumber: ''
        },
        delivery: {
          inPost: true,
          dpd: false,
          pickUpAtThePoint: false
        },
        payment: {
          stripePayment: true
        },
        orderID: null,
        paymentMethod: null,
        totalPrice: null
      }
    });

    const mocks = [
      {
        request: {
          query: USER_PERSONAL_DETAILS,
          variables: { userId: '0c1069c7-8e77-4749-bc4b-e308c6679d1c' }
        },
        result: {
          data: {
            user: {
              name: 'Jan',
              surname: 'Kowalski',
              street: 'Długa 15',
              city: 'Gliwice',
              postalCode: '44-100',
              email: 'jan.kowalski@example.com',
              phoneNumber: '600700800'
            }
          }
        }
      }
    ];

    renderWithProviders(
      <OrderContext.Provider value={{ step: 0, setStep: () => {} }}>
        <ClientDetails />
      </OrderContext.Provider>,
      { preloadedState, mocks }
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Imię')).toHaveValue('Jan');
      expect(screen.getByPlaceholderText('Nazwisko')).toHaveValue('Kowalski');
      expect(screen.getByPlaceholderText('Ulica')).toHaveValue('Długa 15');
      expect(screen.getByPlaceholderText('Miasto')).toHaveValue('Gliwice');
      expect(screen.getByPlaceholderText('Kod pocztowy')).toHaveValue('44-100');
      expect(screen.getByPlaceholderText('Adres email')).toHaveValue('jan.kowalski@example.com');
      expect(screen.getByPlaceholderText('Numer telefonu')).toHaveValue('600700800');
    });
  });
});
