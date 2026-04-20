import { RouterProvider } from 'react-router';
import { router } from './routes';
import '../styles/fonts.css';
import { useState, useCallback } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { Analytics } from '@vercel/analytics/react';
import { AnimationProvider } from './context/AnimationContext';

export default function App() {
  const [loading, setLoading] = useState(true);
  const handleComplete = useCallback(() => setLoading(false), []);

  return (
    <AnimationProvider>
      {loading ? (
        <LoadingScreen onComplete={handleComplete} />
      ) : (
        <RouterProvider router={router} />
      )}
      <Analytics />
    </AnimationProvider>
  );
}
