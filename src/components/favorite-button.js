import { Star } from "react-feather";
import { Button } from "@chakra-ui/react";
import { useFavoritesContext } from "../contexts/FavoritesContext";
import { useMemo, useCallback } from "react";

export default function FavoriteButton({ type, id, width = '1.2em' }) {
  const { favoriteItems, addFavoriteItem, removeFavoriteItem } = useFavoritesContext();

  const isIdFavorited = useMemo(() => favoriteItems[type].find(itemId => itemId === id), [favoriteItems, id, type]);

  const onClick = useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();

    if (isIdFavorited) {
      removeFavoriteItem(type, id);
    } else {
      addFavoriteItem(type, id);
    }
  }, [isIdFavorited, removeFavoriteItem, addFavoriteItem, id, type ]);

  return <Button
    onClick={onClick}
    title={isIdFavorited ? 'Remove from favorites' : 'Add to favorites'}
    data-testid="favorite-button"
    bg="transparent"
    _hover={{ bg: 'transparent' }}
    _focusVisible={{
      outline: '2px solid var(--chakra-colors-blue-400)'
    }}
    _focus={{
      bg: 'transparent',
      outline: 'none',
      boxShadow: 'none'
    }}
    _active={{
      bg: 'transparent',
      outline: 'none',
      boxShadow: 'none'
    }}>
    <Star data-testid="favorite-icon" width={width} fill={isIdFavorited ? 'yellow' : 'none'} />
  </Button>
};
