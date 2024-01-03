import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FavoriteButton from './favorite-button';
import { useFavoritesContext } from '../contexts/FavoritesContext';

jest.mock('../contexts/FavoritesContext', () => ({
  useFavoritesContext: jest.fn()
}));

describe('FavoriteButton', () => {
  test('should render and call remove from favorites', () => {
    const removeFavoriteItem = jest.fn();

    useFavoritesContext.mockReturnValue({
      favoriteItems: {
        launches: ['123'],
        pads: []
      },
      addFavoriteItem: jest.fn(),
      removeFavoriteItem
    });

    render(<FavoriteButton type="launches" id="123" />);

    const button = screen.getByTestId('favorite-button');
    const starIcon = screen.getByTestId('favorite-icon');

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Remove from favorites');
    expect(starIcon).toHaveAttribute('fill', 'yellow'); // icon is visibly favorited

    fireEvent.click(button);

    expect(removeFavoriteItem).toHaveBeenCalledWith('launches', '123');
  });

  test('should render and add to favorites', () => {
    const addFavoriteItem = jest.fn();

    useFavoritesContext.mockReturnValue({
      favoriteItems: {
        launches: [],
        pads: ['777']
      },
      addFavoriteItem,
      removeFavoriteItem: jest.fn(),
    });

    render(<FavoriteButton type="launches" id="123" />);

    const button = screen.getByTestId('favorite-button');
    const starIcon = screen.getByTestId('favorite-icon');

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Add to favorites');
    expect(starIcon).toHaveAttribute('fill', 'none'); // icon is not visibly favorited

    fireEvent.click(button);

    expect(addFavoriteItem).toHaveBeenCalledWith('launches', '123');
  });
});
