import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorModal from 'components/modals/ErrorModal';

describe('ErrorModal', () => {
  const mockClose = jest.fn();

  const setup = (props = {}) => {
    render(
      <ErrorModal
        isOpen
        handleOnClose={mockClose}
        body={<p>Something went wrong</p>}
        {...props}
      />
    );
  };

  it('renders when open and shows correct content', () => {
    setup();

    expect(screen.getByText(/Wystąpił niespodziewany problem/i)).toBeInTheDocument();
    expect(screen.getByText('Za utrudnienia przepraszamy')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('does not render anything when isOpen is false', () => {
    setup({ isOpen: false });

    expect(screen.queryByText(/Wystąpił niespodziewany problem/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Za utrudnienia przepraszamy')).not.toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('calls handleOnClose when modal backdrop is clicked or escape pressed', () => {
    setup();

    const modalBackdrop = screen.getByRole('presentation');
    fireEvent.keyDown(modalBackdrop, { key: 'Escape', code: 'Escape' });
    fireEvent.click(modalBackdrop);

    expect(mockClose).toHaveBeenCalled();
  });
});
