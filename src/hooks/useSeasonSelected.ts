import { useSeasonSelected as useSeasonSelectedHook, useStoreDispatch, setSeasonSelected, clearSeasonSelected } from "../../packages/store";

const useSeasonSelected = () => {
  const seasonSelected = useSeasonSelectedHook();
  const dispatch = useStoreDispatch();

  return {
    get: () => seasonSelected,
    set: (value: any) => dispatch(setSeasonSelected(value)),
    clear: () => dispatch(clearSeasonSelected())
  };
};

export default useSeasonSelected;
