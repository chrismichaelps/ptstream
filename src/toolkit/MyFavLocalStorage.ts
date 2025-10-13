import { has, omit, orderBy } from 'lodash';
import { Effect } from 'effect';
import { StorageService } from '../services/StorageService';

const STORAGE_KEY = 'my-favorites';

// Retrieve the current list of liked items from local storage
const getLikedItems = () => {
  return Effect.gen(function* () {
    const storageService = yield* StorageService;
    const likedItems = yield* storageService.getItem(STORAGE_KEY);
    return likedItems ? JSON.parse(likedItems) : {};
  });
};

// Add a new item to the list of liked items
const addLikedItem = (item: any) => {
  return Effect.gen(function* () {
    const storageService = yield* StorageService;
    const likedItems = yield* getLikedItems();

    // Preserve existing data and add the new item with a timestamp
    const updatedItems = {
      ...likedItems,
      [item.id]: {
        ...item,
        likedAt: new Date().toISOString()
      },
    };

    yield* storageService.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  });
};

// Remove an item from the list of liked items
const removeLikedItem = (itemId: number) => {
  return Effect.gen(function* () {
    const storageService = yield* StorageService;
    const likedItems = yield* getLikedItems();

    // Remove the item by its ID
    const updatedItems = omit(likedItems, itemId);

    yield* storageService.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  });
};

// Check if an item is already liked
const isItemLiked = (itemId: number) => {
  return Effect.gen(function* () {
    const likedItems = yield* getLikedItems();
    return has(likedItems, itemId);
  });
};

// Get all liked items ordered by the timestamp (most recent first)
const getAllLikedItems = () => {
  return Effect.gen(function* () {
    const likedItems = yield* getLikedItems();

    // Convert the object to an array and order by the likedAt timestamp
    const likedItemsArray = Object.values(likedItems);

    return orderBy(likedItemsArray, ['likedAt'], ['desc']);
  });
};

export { addLikedItem, removeLikedItem, isItemLiked, getAllLikedItems };
