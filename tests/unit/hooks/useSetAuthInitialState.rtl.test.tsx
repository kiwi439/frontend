// @ts-nocheck
import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import createProvidersWrapper from 'tests/unit/helpers/createProvidersWrapper';
import useSetAuthInitialState from 'hooks/useSetAuthInitialState';
import { useQuery } from '@apollo/client';

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn()
}));

describe('useSetAuthInitialState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves user id to store when user is present in API response', async () => {
    useQuery.mockImplementation((_query, { onCompleted }) => {
      const result = { auth: { id: '82e785e4-93d5-42f4-aea1-8196b26a4f49' } };
      onCompleted?.(result);

      return { loading: false, error: undefined, data: result };
    });

    const { wrapper, store } = createProvidersWrapper();
    renderHook(() => useSetAuthInitialState(), { wrapper });

    await waitFor(() => {
      expect(store.getState().user.loggedUserId).toBe('82e785e4-93d5-42f4-aea1-8196b26a4f49');
    });
  });

  it('saves user id as null to store when something goes wrong', async () => {
    useQuery.mockImplementation((_query, { onError }) => {
      onError();
      return { loading: false, error: new Error('Something went wrong!') };
    });

    const { wrapper, store } = createProvidersWrapper();
    renderHook(() => useSetAuthInitialState(), { wrapper });

    await waitFor(() => {
      expect(store.getState().user.loggedUserId).toBe(null);
    });
  });
});
