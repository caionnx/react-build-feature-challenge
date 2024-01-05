import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { FavoritesProvider, useFavoritesContext, FAVORITES_TYPES, LOCAL_STORAGE_KEY } from './favorites-context';

const originalConsoleError = console.error;

describe('FavoritesProvider', () => {
  beforeAll(() => {
    console.error = jest.fn(); // suppress the error on jest console to avoid noise
  });
  
  afterEach(() => {
    localStorage.clear();

  });
  
  afterAll(() => {
    console.error = originalConsoleError;
  });

  test('should add item on favorites list', () => {
    const Dummy = () => {
      const { favoriteItems, addFavoriteItem } = useFavoritesContext();

      return (
        <div>
          <div data-testid="launches">{favoriteItems[FAVORITES_TYPES.LAUNCHES].join(',')}</div>
          <div data-testid="pads">{favoriteItems[FAVORITES_TYPES.PADS].join(',')}</div>
          <button data-testid="add-launch" onClick={() => addFavoriteItem(FAVORITES_TYPES.LAUNCHES, '123')}>Add Launch</button>
          <button data-testid="add-pad" onClick={() => addFavoriteItem(FAVORITES_TYPES.PADS, '456')}>Add Pad</button>
        </div>
      );
    };

    render(
      <FavoritesProvider>
        <Dummy />
      </FavoritesProvider>
    );

    const launchesTextElement = screen.getByTestId('launches');
    const padsTextElement = screen.getByTestId('pads');
    const addLaunchButton = screen.getByTestId('add-launch');
    const addPadButton = screen.getByTestId('add-pad');

    // Initial default state
    expect(launchesTextElement.textContent).toBe('');
    expect(padsTextElement.textContent).toBe('');

    // Add launch and pad
    act(() => {
      fireEvent.click(addLaunchButton);
      fireEvent.click(addPadButton);
    });

    expect(launchesTextElement.textContent).toBe('123');
    expect(padsTextElement.textContent).toBe('456');
  });

  test('should not add nor remove item of unexpected type', () => {
    const Dummy = () => {
      const { favoriteItems, removeFavoriteItem, addFavoriteItem } = useFavoritesContext();

      return (
        <div>
          <div data-testid="launches">{favoriteItems[FAVORITES_TYPES.LAUNCHES].join(',')}</div>
          <div data-testid="pads">{favoriteItems[FAVORITES_TYPES.PADS].join(',')}</div>
          <button data-testid="add-invalid" onClick={() => addFavoriteItem('invalid_type', '123')}>Add Invalid Type</button>
          <button data-testid="remove-invalid" onClick={() => removeFavoriteItem('invalid_type', '123')}>Remove Invalid Type</button>
        </div>
      );
    };

    render(
      <FavoritesProvider>
        <Dummy />
      </FavoritesProvider>
    );

    const launchesTextElement = screen.getByTestId('launches');
    const padsTextElement = screen.getByTestId('pads');
    const addInvalidButton = screen.getByTestId('add-invalid');
    const removeInvalidButton = screen.getByTestId('remove-invalid');

    // Add invalid
    act(() => {
      fireEvent.click(addInvalidButton);
    });

    expect(launchesTextElement.textContent).toBe('');
    expect(padsTextElement.textContent).toBe('');
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toEqual(null); // localstorage should not be modified

    // Remove invalid
    act(() => {
      fireEvent.click(removeInvalidButton);
    });

    expect(launchesTextElement.textContent).toBe('');
    expect(padsTextElement.textContent).toBe('');
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toEqual(null); // localstorage should not be modified
  });

  test('should start with items from local storage then remove them', () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      [FAVORITES_TYPES.LAUNCHES]: ['123'],
      [FAVORITES_TYPES.PADS]: ['456'],
      [FAVORITES_TYPES.ROCKETS]: [''],
    }));
    
    const TestComponent = () => {
      const { favoriteItems, removeFavoriteItem } = useFavoritesContext();

      return (
        <div>
          <div data-testid="launches">{favoriteItems[FAVORITES_TYPES.LAUNCHES].join(',')}</div>
          <div data-testid="pads">{favoriteItems[FAVORITES_TYPES.PADS].join(',')}</div>
          <button data-testid="remove-launch" onClick={() => removeFavoriteItem(FAVORITES_TYPES.LAUNCHES, '123')}>Remove Launch</button>
          <button data-testid="remove-pad" onClick={() => removeFavoriteItem(FAVORITES_TYPES.PADS, '456')}>Remove Pad</button>
        </div>
      );
    };


    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    const launchesElement = screen.getByTestId('launches');
    const padsElement = screen.getByTestId('pads');
    const removeLaunchButton = screen.getByTestId('remove-launch');
    const removePadButton = screen.getByTestId('remove-pad');

    // Initial state
    expect(launchesElement.textContent).toBe('123');
    expect(padsElement.textContent).toBe('456');

    // Remove launch and pad
    act(() => {
      fireEvent.click(removeLaunchButton);
      fireEvent.click(removePadButton);
    });

    expect(launchesElement.textContent).toBe('');
    expect(padsElement.textContent).toBe('');
  });

  test('should not start with items from local storage if local storage has wrong shape', () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      notValid: true
    }));

    const TestComponent = () => {
      const { favoriteItems } = useFavoritesContext();

      return (
        <div>
          <div data-testid="launches">{favoriteItems[FAVORITES_TYPES.LAUNCHES].join(',')}</div>
          <div data-testid="pads">{favoriteItems[FAVORITES_TYPES.PADS].join(',')}</div>
        </div>
      );
    };

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    const launchesElement = screen.getByTestId('launches');
    const padsElement = screen.getByTestId('pads');

    // Initial state
    expect(launchesElement.textContent).toBe('');
    expect(padsElement.textContent).toBe('');
  });
});
