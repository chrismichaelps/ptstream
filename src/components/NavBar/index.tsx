import { useEffect, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { House, Search, Heart } from "lucide-react"; // Import the Heart icon for favorites

type Key = "home" | "search" | "myFavorites";

const NAVIGATION_MAP: Record<Key, string> = {
  home: "/",
  search: "/search",
  myFavorites: "/myFavorites",
};

export default function NavBar() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Key>("home");

  useEffect(() => {
    navigate(NAVIGATION_MAP[selected]);
  }, [selected]);

  const handleSelectionChange = (key: Key) => {
    setSelected(key);
  };

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
                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
}
