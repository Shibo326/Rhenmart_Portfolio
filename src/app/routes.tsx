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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
