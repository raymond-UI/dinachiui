import * as React from "react"

const MOBILE_BREAKPOINT = 768

const query = (breakpoint: number) => `(max-width: ${breakpoint - 1}px)`

export function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query(breakpoint))
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    [breakpoint]
  )
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query(breakpoint)).matches,
    () => false
  )
}
