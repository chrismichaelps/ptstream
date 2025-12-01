import { createFileRoute } from '@tanstack/react-router';
import { SceneProvider, useScene } from '../contexts/SceneContext';
import SceneLoader from '../components/SceneLoader';

function SceneConsumer() {
  const currentScene = useScene();
  return <SceneLoader scene={currentScene} />;
}

function IndexPage() {
  return (
    <SceneProvider>
      <SceneConsumer />
    </SceneProvider>
  );
}

export const Route = createFileRoute('/')({
  component: IndexPage,
});
