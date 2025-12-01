import { createFileRoute } from '@tanstack/react-router';
import SearchScene from '../components/scenes/Search';

export const Route = createFileRoute('/search')({
  component: SearchScene,
});
