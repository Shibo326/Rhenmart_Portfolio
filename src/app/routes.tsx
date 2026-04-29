import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";

function NotFound() {
  return (
    <div className="bg-[#030303] min-h-screen flex flex-col items-center justify-center text-white gap-6">
      <span className="text-8xl font-black text-[#FF0000]">404</span>
      <p className="text-white/50 text-lg">Page not found.</p>
      <a href="/" className="px-6 py-3 bg-[#FF0000] text-white font-bold rounded-full hover:bg-red-700 transition-colors">
        Go Home
      </a>
    </div>
  );
}

function ErrorFallback() {
  return (
    <div className="bg-[#030303] min-h-screen flex flex-col items-center justify-center text-white gap-6 px-4">
      <span className="text-6xl font-black text-[#FF0000]">ERROR</span>
      <p className="text-white/50 text-lg text-center max-w-md">
        Something went wrong. The page encountered an unexpected error.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-[#FF0000] text-white font-bold rounded-full hover:bg-red-700 transition-colors"
      >
        Reload Page
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    errorElement: <ErrorFallback />,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
