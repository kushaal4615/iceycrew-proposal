import { useReducedMotion as useFramerReduced } from 'framer-motion'

/** True when the visitor asked for less motion. Every animation in the page checks it. */
export function useReducedMotion(): boolean {
  return useFramerReduced() ?? false
}
