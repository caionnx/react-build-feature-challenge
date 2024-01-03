import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export const LOCAL_STORAGE_KEY = 'space_rockets_favorites';

export const FAVORITES_TYPES = {
  LAUNCHES: 'launches',
  PADS: 'pads'
};

export const defaultFavoritesContextValue = {
  favoriteItems: {
    [FAVORITES_TYPES.LAUNCHES]: [],
    [FAVORITES_TYPES.PADS]: [],
  },
  addFavoriteItem: () => null,
  removeFavoriteItem: () => null,
};

export const FavoritesContext = createContext(defaultFavoritesContextValue);

export function FavoritesProvider({ children }) {
  const [favoriteItems, setFavoriteItems] = useState(defaultFavoritesContextValue.favoriteItems);

  const addFavorite = useCallback((type, id) => {
    if (!favoriteItems[type]) {
      console.error('Failed to add unkown type of favorite item');
      return;
    }

    setFavoriteItems(currentState => {
      const manipulatedState = {
        ...currentState,
        [type]: [...currentState[type], id],
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(manipulatedState));

      return manipulatedState
    });
  }, [favoriteItems]);

  const removeFavorite = useCallback((type, id) => {
    if (!favoriteItems[type]) {
      console.error('Failed to remove unkown type of favorite item');
      return;
    }

    setFavoriteItems(currentState => {
      const manipulatedState = {
        ...currentState,
        [type]: currentState[type].filter(itemId => itemId !== id),
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(manipulatedState));

      return manipulatedState;
    });
  }, [favoriteItems]);

  useEffect(() => {
    const localStorageState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

    if (!localStorageState) {
      return;
    };

    if (!Object.keys(defaultFavoritesContextValue.favoriteItems).every((defaultKey) => localStorageState.hasOwnProperty(defaultKey))) {
      console.error('Failed initialize the favorites from local storage: unkown keys on localstorage');
      return;
    }

    setFavoriteItems(localStorageState);
    
  }, []);

  const contextValue = {
    favoriteItems,
    addFavoriteItem: addFavorite,
    removeFavoriteItem: removeFavorite
  };

  return <FavoritesContext.Provider value={contextValue}>{children}</FavoritesContext.Provider>;
};

export function useFavoritesContext() {
  return useContext(FavoritesContext);
};
