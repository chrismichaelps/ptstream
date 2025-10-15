import { some, filter, orderBy, uniqBy } from 'lodash';
import { Effect } from 'effect';
import { StorageService } from '../../packages/services';

const STORAGE_CHAPTERS_WATCHED_KEY = 'chapters-watched';

// Helper function to create a string key for a chapter
const generateChapterKey = (item: { serieId: number; seasonId: number; episodeId: number }) => {
  return `${item.serieId}_${item.seasonId}_${item.episodeId}`;
};

// Retrieve the current list of watched chapters from local storage
const getChaptersWatchedItems = () => {
  return Effect.gen(function* () {
    const storageService = yield* StorageService;
    const watchedItems = yield* storageService.getItem(STORAGE_CHAPTERS_WATCHED_KEY);
    return watchedItems ? JSON.parse(watchedItems) : [];
  });
};

// Add a new chapter to the watched list
const addChapterWatchedItem = (item: { serieId: number; seasonId: number; episodeId: number }) => {
  return Effect.gen(function* () {
    const storageService = yield* StorageService;
    const watchedItems = yield* getChaptersWatchedItems();
    const chapterKey = generateChapterKey(item);

    // Use lodash `some` to check if the chapter is already watched
    if (!some(watchedItems, (watchedItem) => watchedItem.key === chapterKey)) {
      const updatedItems = uniqBy(
        [...watchedItems, { key: chapterKey, watchedAt: new Date().toISOString() }],
        'key'
      );

      yield* storageService.setItem(STORAGE_CHAPTERS_WATCHED_KEY, JSON.stringify(updatedItems));
    }
  });
};

// Remove a chapter from the watched list
const removeChapterWatchedItem = (item: { serieId: number; seasonId: number; episodeId: number }) => {
  return Effect.gen(function* () {
    const storageService = yield* StorageService;
    const watchedItems = yield* getChaptersWatchedItems();
    const chapterKey = generateChapterKey(item);

    // Use lodash `filter` to remove the chapter by key
    const updatedItems = filter(watchedItems, (watchedItem) => watchedItem.key !== chapterKey);

    yield* storageService.setItem(STORAGE_CHAPTERS_WATCHED_KEY, JSON.stringify(updatedItems));
  });
};

// Check if a chapter has been watched
const wasChapterSeen = (item: { serieId: number; seasonId: number; episodeId: number }) => {
  return Effect.gen(function* () {
    const watchedItems = yield* getChaptersWatchedItems();
    const chapterKey = generateChapterKey(item);

    // Use lodash `some` to check if the chapter exists in the watched list
    return some(watchedItems, (watchedItem) => watchedItem.key === chapterKey);
  });
};

// Get all watched chapters, ordered by the watch timestamp (most recent first)
const getAllChaptersWatchedItems = () => {
  return Effect.gen(function* () {
    const watchedItems = yield* getChaptersWatchedItems();

    // Use lodash `orderBy` to sort by watchedAt in descending order
    return orderBy(watchedItems, ['watchedAt'], ['desc']);
  });
};

export {
  addChapterWatchedItem,
  removeChapterWatchedItem,
  wasChapterSeen,
  getAllChaptersWatchedItems,
};
