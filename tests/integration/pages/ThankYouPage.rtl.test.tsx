import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import renderWithProviders from 'tests/integration/helpers/renderWithProviders';
import { generatePreloadedState } from 'tests/integration/helpers/preloadedState';
import { GET_ORDER } from 'graphql/queries/order';
import ThankYouPage from 'pages/ThankYouPage';
import fetchFileOnLocalFileSystem from 'services/fetchFileOnLocalFileSystem';

jest.mock('services/fetchFileOnLocalFileSystem', () => jest.fn());

describe('ThankYouPage', () => {
  const orderId = 'da97aa73-f0e4-4a17-9157-9f17454c73f3';
  const preloadedState = generatePreloadedState({ userStatePresent: true });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('success path', () => {
    it('renders paid order details and allows invoice download', async () => {
      const mocks = [
        {
          request: {
            query: GET_ORDER,
            variables: { id: orderId }
          },
          result: {
            data: {
              order: {
                paid: true,
                latestPayment: {
                  id: 'c79576b2-702f-4259-bc20-ab5aa6ea3dac',
                  status: 'succeeded',
                  amountCents: 13698,
                  provider: 'stripe'
                }
              }
            }
          }
        }
      ];

      renderWithProviders(<ThankYouPage />, {
        preloadedState,
        mocks,
        initialEntries: [`/thank-you-page?order_id=${orderId}`]
      });

      expect(screen.getByText('Pobieramy status zamówienia i płatności…')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Płatność została opłacona.')).toBeInTheDocument();
      });

      expect(screen.getByText('Provider')).toBeInTheDocument();
      expect(screen.getByText('STRIPE')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Opłacono')).toBeInTheDocument();
      expect(screen.getByText('Kwota')).toBeInTheDocument();
      expect(screen.getByText('136.98 zł')).toBeInTheDocument();

      fireEvent.mouseDown(screen.getByText('Pobierz fakturę w formacie PDF'));

      expect(fetchFileOnLocalFileSystem).toHaveBeenCalledWith(
        `users/0c1069c7-8e77-4749-bc4b-e308c6679d1c/invoices/${orderId}.pdf`,
        `Faktura za zamówienie: ${orderId}`
      );
    });
  });

  describe('failure path', () => {
    it('renders failure summary with support details', async () => {
      const mocks = [
        {
          request: {
            query: GET_ORDER,
            variables: { id: orderId }
          },
          result: {
            data: {
              order: {
                paid: false,
                latestPayment: {
                  id: 'c79576b2-702f-4259-bc20-ab5aa6ea3dac',
                  status: 'expired',
                  amountCents: 13698,
                  provider: 'stripe'
                }
              }
            }
          }
        }
      ];

      renderWithProviders(<ThankYouPage />, {
        preloadedState,
        mocks,
        initialEntries: [`/thank-you-page?order_id=${orderId}`]
      });

      expect(screen.getByText('Pobieramy status zamówienia i płatności…')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Niestety płatność nie została zrealizowana.')).toBeInTheDocument();
      });

      expect(screen.getByText('Wygasło')).toBeInTheDocument();
      expect(screen.getByText('ID płatności')).toBeInTheDocument();
      expect(screen.getByText('c79576b2-702f-4259-bc20-ab5aa6ea3dac')).toBeInTheDocument();
      expect(screen.getByText('Kontakt')).toBeInTheDocument();
      expect(screen.getByText('724 131 140')).toBeInTheDocument();
      expect(screen.getByText('siwiec.michal724@gmail.com')).toBeInTheDocument();
      expect(screen.queryByText('Pobierz fakturę w formacie PDF')).not.toBeInTheDocument();
    });
  });
});
