import { createFileRoute } from '@tanstack/react-router';
import MyFavoritesScene from '../components/scenes/MyFavorites';

export const Route = createFileRoute('/myFavorites')({
  component: MyFavoritesScene,
});
