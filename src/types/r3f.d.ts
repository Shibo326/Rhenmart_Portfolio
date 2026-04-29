// Augment React.JSX.IntrinsicElements with @react-three/fiber's ThreeElements.
// Required because "jsx": "react-jsx" routes JSX to React.JSX, not the global
// JSX namespace — so R3F's own `declare global { namespace JSX }` is ignored.
import type { ThreeElements } from "@react-three/fiber";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
