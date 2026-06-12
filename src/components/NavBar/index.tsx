import { useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { useNavigate } from "@tanstack/react-router";
import { House, Search, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  useStoreDispatch,
  resetSearchState,
  clearSearchQuery,
} from "../../../packages/store";

type NavKey = "home" | "search" | "myFavorites";

const NAVIGATION_MAP: Record<NavKey, string> = {
  home: "/",
  search: "/search",
  myFavorites: "/myFavorites",
};

const TRANSLATION_KEYS: Record<NavKey, string> = {
  home: "Navigation_Home",
  search: "Navigation_Search",
  myFavorites: "Navigation_MyFavorites",
};

const NAV_ICONS: Record<NavKey, typeof House> = {
  home: House,
  search: Search,
  myFavorites: Heart,
};

const NavBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selected, setSelected] = useState<NavKey>("home");

  const dispatch = useStoreDispatch();

  const handleSelectionChange = (key: React.Key) => {
    const navKey = key as NavKey;
    setSelected(navKey);
    dispatch(resetSearchState());
    dispatch(clearSearchQuery());
    navigate({ to: NAVIGATION_MAP[navKey] });
  };

  return (
    <div className="flex flex-col w-full">
      <Tabs
        selectedKey={selected}
        onSelectionChange={handleSelectionChange}
        color="default"
        variant="bordered"
      >
        {(Object.keys(NAVIGATION_MAP) as NavKey[]).map((key) => {
          const Icon = NAV_ICONS[key];
          return (
            <Tab
              key={key}
              title={
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{t(TRANSLATION_KEYS[key])}</span>
                </div>
              }
            />
          );
        })}
      </Tabs>
    </div>
  );
};

export default NavBar;
