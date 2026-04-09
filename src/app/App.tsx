import { RouterProvider } from 'react-router';
import { router } from './routes';
import '../styles/fonts.css';
import { useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      {!loading && <RouterProvider router={router} />}
    </>
  );
}
