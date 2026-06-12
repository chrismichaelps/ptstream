import { Effect } from "effect";

import { StorageService } from "../../packages/services";
import { STORAGE_KEYS } from "../../packages/constants";

export type ChapterRef = {
  readonly serieId: number;
  readonly seasonId: number;
  readonly episodeId: number;
};

type WatchedChapter = {
  readonly key: string;
  readonly watchedAt: string;
};

// Helper function to create a string key for a chapter
const generateChapterKey = (item: ChapterRef) =>
  `${item.serieId}_${item.seasonId}_${item.episodeId}`;

// Retrieve the current list of watched chapters from local storage
const getChaptersWatchedItems = (): Effect.Effect<
  ReadonlyArray<WatchedChapter>,
  never,
  StorageService
> =>
  Effect.gen(function* () {
    const storageService = yield* StorageService;
    const watchedItems = yield* storageService.getItem(
      STORAGE_KEYS.CHAPTERS_WATCHED
    );
    return watchedItems ? (JSON.parse(watchedItems) as WatchedChapter[]) : [];
  });

// Add a new chapter to the watched list
const addChapterWatchedItem = (item: ChapterRef) =>
  Effect.gen(function* () {
    const storageService = yield* StorageService;
    const watchedItems = yield* getChaptersWatchedItems();
    const chapterKey = generateChapterKey(item);

    if (watchedItems.some((watched) => watched.key === chapterKey)) {
      return;
    }

    const updatedItems = [
      ...watchedItems,
      { key: chapterKey, watchedAt: new Date().toISOString() },
    ];

    yield* storageService.setItem(
      STORAGE_KEYS.CHAPTERS_WATCHED,
      JSON.stringify(updatedItems)
    );
  });

// Remove a chapter from the watched list
const removeChapterWatchedItem = (item: ChapterRef) =>
  Effect.gen(function* () {
    const storageService = yield* StorageService;
    const watchedItems = yield* getChaptersWatchedItems();
    const chapterKey = generateChapterKey(item);

    const updatedItems = watchedItems.filter(
      (watched) => watched.key !== chapterKey
    );

    yield* storageService.setItem(
      STORAGE_KEYS.CHAPTERS_WATCHED,
      JSON.stringify(updatedItems)
    );
  });

// Check if a chapter has been watched
const wasChapterSeen = (item: ChapterRef) =>
  Effect.map(getChaptersWatchedItems(), (watchedItems) =>
    watchedItems.some((watched) => watched.key === generateChapterKey(item))
  );

// Get all watched chapters, ordered by the watch timestamp (most recent first)
const getAllChaptersWatchedItems = () =>
  Effect.map(getChaptersWatchedItems(), (watchedItems) =>
    [...watchedItems].sort((a, b) => b.watchedAt.localeCompare(a.watchedAt))
  );

export {
  addChapterWatchedItem,
  removeChapterWatchedItem,
  wasChapterSeen,
  getAllChaptersWatchedItems,
};
