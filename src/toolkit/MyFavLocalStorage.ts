import { Effect } from "effect";

import { StorageService } from "../../packages/services";
import { STORAGE_KEYS } from "../../packages/constants";
import { FavoriteItem, SearchMediaItem } from "../types";

/** Emitted on `window` whenever the favorites storage changes in this renderer. */
export const FAVORITES_CHANGED_EVENT = "favorites:changed";

type FavoritesById = Record<string, FavoriteItem>;

const notifyFavoritesChanged = () =>
  Effect.sync(() => {
    window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
  });

// Retrieve the current list of liked items from local storage
const getLikedItems = (): Effect.Effect<
  FavoritesById,
  never,
  StorageService
> =>
  Effect.gen(function* () {
    const storageService = yield* StorageService;
    const likedItems = yield* storageService.getItem(STORAGE_KEYS.FAVORITES);
    return likedItems ? (JSON.parse(likedItems) as FavoritesById) : {};
  });

// Add a new item to the list of liked items
const addLikedItem = (item: SearchMediaItem) =>
  Effect.gen(function* () {
    const storageService = yield* StorageService;
    const likedItems = yield* getLikedItems();

    // Preserve existing data and add the new item with a timestamp
    const updatedItems: FavoritesById = {
      ...likedItems,
      [item.id]: {
        ...item,
        likedAt: new Date().toISOString(),
      },
    };

    yield* storageService.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(updatedItems)
    );
    yield* notifyFavoritesChanged();
  });

// Remove an item from the list of liked items
const removeLikedItem = (itemId: number) =>
  Effect.gen(function* () {
    const storageService = yield* StorageService;
    const likedItems = yield* getLikedItems();

    const updatedItems = { ...likedItems };
    delete updatedItems[String(itemId)];

    yield* storageService.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(updatedItems)
    );
    yield* notifyFavoritesChanged();
  });

// Check if an item is already liked
const isItemLiked = (itemId: number) =>
  Effect.map(getLikedItems(), (likedItems) => String(itemId) in likedItems);

// Get all liked items ordered by the timestamp (most recent first)
const getAllLikedItems = () =>
  Effect.map(getLikedItems(), (likedItems) =>
    Object.values(likedItems).sort((a, b) => b.likedAt.localeCompare(a.likedAt))
  );

export { addLikedItem, removeLikedItem, isItemLiked, getAllLikedItems };
