import {
  useSeasonSelected as useSeasonSelectedHook,
  useStoreDispatch,
  setSeasonSelected,
  clearSeasonSelected,
} from "../../packages/store";
import { UniqueSerieSeason } from "../types";

const useSeasonSelected = () => {
  const seasonSelected = useSeasonSelectedHook();
  const dispatch = useStoreDispatch();

  return {
    get: (): UniqueSerieSeason | null => seasonSelected,
    set: (value: UniqueSerieSeason) => dispatch(setSeasonSelected(value)),
    clear: () => dispatch(clearSeasonSelected()),
  };
};

export default useSeasonSelected;
