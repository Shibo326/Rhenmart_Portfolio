import { RouterProvider } from 'react-router';
import { router } from './routes';
import '../styles/fonts.css';
import { useState, useCallback } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const handleComplete = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading ? (
        <LoadingScreen onComplete={handleComplete} />
      ) : (
        <RouterProvider router={router} />
      )}
      <Analytics />
    </>
  );
}
