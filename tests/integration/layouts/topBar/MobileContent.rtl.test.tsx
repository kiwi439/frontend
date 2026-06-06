import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import MobileContent from 'layouts/topBar/MobileContent';
import renderWithProviders from 'tests/integration/helpers/renderWithProviders';
import { resizeWindow } from 'tests/helpers/domUtils';
import { WIDTH_BREAKPOINTS } from 'data/breakpoints';

describe('MobileContent', () => {
  beforeEach(() => {
    resizeWindow(WIDTH_BREAKPOINTS.lg - 1);
    renderWithProviders(<MobileContent />);
  });

  it('renders topBar in mobile mood correctly', () => {
    expect(screen.getByAltText('Budoman logo')).toBeInTheDocument();
    expect(screen.getByTestId('MenuIcon')).toBeInTheDocument();
    expect(screen.getByText(/Wersja testowa/)).toBeInTheDocument();
    expect(screen.queryByText('Logowanie')).not.toBeInTheDocument();
    expect(screen.queryByText('Rejestracja')).not.toBeInTheDocument();
    expect(screen.queryByText('Produkty')).not.toBeInTheDocument();
    expect(screen.queryByText('Opinie')).not.toBeInTheDocument();
  });

  it('togglesdrawer opening state', async () => {
    fireEvent.mouseDown(screen.getByTestId('MenuIcon'));

    expect(screen.getByText('Logowanie')).toBeInTheDocument();
    expect(screen.getByText('Rejestracja')).toBeInTheDocument();
    expect(screen.getByText('Produkty')).toBeInTheDocument();
    expect(screen.getByText('Opinie')).toBeInTheDocument();

    fireEvent.keyDown(screen.getByTestId('menu-drawer'), { key: 'Escape', code: 'Escape', keyCode: 27 });

    await waitFor(() => {
      expect(screen.queryByText('Logowanie')).not.toBeInTheDocument();
      expect(screen.queryByText('Rejestracja')).not.toBeInTheDocument();
      expect(screen.queryByText('Produkty')).not.toBeInTheDocument();
      expect(screen.queryByText('Opinie')).not.toBeInTheDocument();
    });
  });
});
