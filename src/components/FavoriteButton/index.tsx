import { useState, useEffect } from "react";
import { Effect } from "effect";
import { Heart, HeartCrack } from "lucide-react";
import { motion } from "framer-motion";
import { useEffectSync } from "../../contexts/EffectContext";
import { StorageServiceLive } from "../../services/StorageService";
import * as MyFavLocalStorage from "../../toolkit/MyFavLocalStorage";

type FavoriteButtonProps = {
  item: any;
};

const FavoriteButton = ({ item }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if the item is already liked when the component mounts
  useEffect(() => {
    const liked = useEffectSync(
      MyFavLocalStorage.isItemLiked(item.id).pipe(
        Effect.provide(StorageServiceLive)
      )
    );
    setIsFavorite(liked);
  }, [item.id]);

  const toggleFavorite = () => {
    if (isFavorite) {
      useEffectSync(
        MyFavLocalStorage.removeLikedItem(item.id).pipe(
          Effect.provide(StorageServiceLive)
        )
      );
    } else {
      useEffectSync(
        MyFavLocalStorage.addLikedItem(item).pipe(
          Effect.provide(StorageServiceLive)
        )
      );
    }

    setIsFavorite(!isFavorite);
  };

  return (
    <motion.button
      className={`fixed z-50 bottom-4 right-4 p-2 rounded-full ${
        isFavorite ? "bg-white border-red-500" : "bg-white border-black"
      } shadow-lg transition-colors duration-500 focus:outline-none`}
      onClick={toggleFavorite}
      initial={{ scale: 1 }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1, rotate: 10 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isFavorite ? 1.2 : 1 }}
        whileHover={{ scale: 1.3 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isFavorite ? (
          <Heart color="red" className="w-4 h-4 text-red-500" />
        ) : (
          <HeartCrack color="black" className="w-4 h-4 text-black" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default FavoriteButton;
