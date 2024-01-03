import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom';

import FavoriteDrawer from './favorite-drawer';
import { useFavoritesContext } from '../contexts/FavoritesContext';
import { useSpaceXQuery } from '../utils/use-space-x';

jest.mock('../contexts/FavoritesContext', () => ({
	...jest.requireActual('../contexts/FavoritesContext'),
  useFavoritesContext: jest.fn()
}));

jest.mock('../utils/use-space-x', () => ({
  useSpaceXQuery: jest.fn()
}));

describe('FavoriteDrawer', () => {
  test('should render empty state and call to action buttons when there is no favorites', () => {
    useFavoritesContext.mockReturnValue({
      favoriteItems: {
        launches: [],
        pads: []
      }
    });

    render(<FavoriteDrawer isOpen={true} onClose={() => {}} btnRef={null} />, {wrapper: BrowserRouter});

    const emptyMessage = screen.getByText(/Empty list, how about adding to favorites?/i);
    const browseLaunchesButton = screen.getByRole('link', { name: /Browse Launches/i });
    const browsePadsButton = screen.getByRole('link', { name: /Browse Launch Pads/i });

    expect(emptyMessage).toBeInTheDocument();
    expect(browseLaunchesButton).toBeInTheDocument();
    expect(browsePadsButton).toBeInTheDocument();
  });

  test('should render favorite launches and pads when favorites exist', async () => {
    useFavoritesContext.mockReturnValue({
      favoriteItems: {
        launches: ['123'],
        pads: ['456']
      }
    });

    useSpaceXQuery.mockImplementation((type) => {
      if (type === 'launches') {
        return {
          data: { docs: [{ id: '123', name: 'Launch 123', date_utc: '2022-01-01T00:00:00Z', links: { flickr: { original: ['image-url'] }, patch: { small: 'patch-url' } } }] },
          error: null
        };
      } else if (type === 'launchpads') {
        return {
          data: { docs: [{ id: '456', full_name: 'Launch Pad 456', rockets: [{ name: 'Rocket 1' }] }] },
          error: null
        };
      }
    });

    render(<FavoriteDrawer isOpen={true} onClose={() => {}} btnRef={null} />, {wrapper: BrowserRouter});

    // Wait for data to be loaded
    await waitFor(() => {
      expect(screen.getByText(/Launches/i)).toBeInTheDocument();
      expect(screen.getByText(/Launch Pad 456/i)).toBeInTheDocument();
    });
  });

  test('should handle error from query', async () => {
    useFavoritesContext.mockReturnValue({
      favoriteItems: {
        launches: ['123'],
        pads: []
      }
    });

    useSpaceXQuery.mockImplementation(() => {
			return {
				data: null,
				error: new Error('')
			};
    });

    render(<FavoriteDrawer isOpen={true} onClose={() => {}} btnRef={null} />, {wrapper: BrowserRouter});

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Problems loading the data/i)).toBeInTheDocument();
    });
  });
});
