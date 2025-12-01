import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { useNavigate } from "@tanstack/react-router";
import { House, Search, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { Effect, pipe } from "effect";

import {
  useStoreDispatch,
  resetSearchState,
  clearSearchQuery,
} from "../../../packages/store";

type Key = "home" | "search" | "myFavorites";

export interface NavBarRef {
  navigateTo: (key: Key) => void;
  getCurrentTab: () => Key;
  resetSearch: () => void;
  clearSearch: () => void;
}

const NAVIGATION_MAP: Record<Key, string> = {
  home: "/",
  search: "/search",
  myFavorites: "/myFavorites",
};

const translationKeys: Record<Key, string> = {
  home: "Navigation_Home",
  search: "Navigation_Search",
  myFavorites: "Navigation_MyFavorites",
};

const translateKeys = (t: TFunction<"translation", undefined>, key: Key) => {
  return t(translationKeys[key]);
};

const NavBar = forwardRef<NavBarRef, {}>((_, ref) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selected, setSelected] = useState<Key>("home");

  const dispatch = useStoreDispatch();

  useEffect(() => {
    pipe(
      Effect.sync(() => NAVIGATION_MAP[selected]),
      Effect.tap((path) => Effect.sync(() => navigate({ to: path }))),
      Effect.runSync
    );
  }, [selected, navigate]);

  const handleSelectionChange = (key: Key) =>
    pipe(
      Effect.sync(() => key),
      Effect.tap((k) => Effect.sync(() => setSelected(k))),
      Effect.tap(() =>
        Effect.sync(() => {
          dispatch(resetSearchState());
          dispatch(clearSearchQuery());
        })
      ),
      Effect.runSync
    );

  const navigateTo = (key: Key) => {
    setSelected(key);
    navigate({ to: NAVIGATION_MAP[key] });
  };

  const getCurrentTab = () => selected;

  const resetSearch = () => {
    dispatch(resetSearchState());
  };

  const clearSearch = () => {
    dispatch(clearSearchQuery());
  };

  useImperativeHandle(
    ref,
    () => ({
      navigateTo,
      getCurrentTab,
      resetSearch,
      clearSearch,
    }),
    [selected, navigate, dispatch]
  );

  return (
    <div className="flex flex-col w-full">
      <Tabs
        selectedKey={selected}
        onSelectionChange={handleSelectionChange}
        color="default"
        variant="bordered"
      >
        {Object.entries(NAVIGATION_MAP).map(([key]) => (
          <Tab
            key={key}
            title={
              <div className="flex items-center space-x-2">
                {key === "home" ? (
                  <House className="w-4 h-4" />
                ) : key === "search" ? (
                  <Search className="w-4 h-4" />
                ) : (
                  <Heart className="w-4 h-4" />
                )}
                <span>{translateKeys(t, key as Key)}</span>
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
});

NavBar.displayName = "NavBar";

export default NavBar;
