import { Context, Effect, Layer } from "effect";
import { StorageService } from "./StorageService";

export interface LanguageService {
  readonly getLanguage: () => Effect.Effect<string, never, StorageService>;
  readonly setLanguage: (lang: string) => Effect.Effect<void, never, StorageService>;
  readonly getStoredLanguage: () => Effect.Effect<string, never, StorageService>;
}

export const LanguageService = Context.Tag("LanguageService")<LanguageService, LanguageService>();

const makeLanguageService = (): LanguageService => ({
  getLanguage: () => Effect.gen(function* () {
    const storageService = yield* StorageService;
    const stored = yield* storageService.getItem("appLang");
    return stored || "en";
  }),

  setLanguage: (lang: string) => Effect.gen(function* () {
    const storageService = yield* StorageService;
    yield* storageService.setItem("appLang", lang);
  }),

  getStoredLanguage: () => Effect.gen(function* () {
    const storageService = yield* StorageService;
    const stored = yield* storageService.getItem("appLang");
    return stored || "en";
  })
});

export const LanguageServiceLive = Layer.succeed(LanguageService, makeLanguageService());
