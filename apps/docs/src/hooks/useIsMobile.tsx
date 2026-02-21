import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const getIsMobile = React.useCallback(() => {
    if (typeof window === "undefined") return false
    return window.innerWidth < MOBILE_BREAKPOINT
  }, [])

  const [isMobile, setIsMobile] = React.useState<boolean>(getIsMobile)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }
    const mqlWithLegacyApi = mql as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void
    }

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange)
    } else {
      mqlWithLegacyApi.addListener?.(onChange)
    }

    window.addEventListener("resize", onChange)
    setIsMobile(getIsMobile())

    return () => {
      if (typeof mql.removeEventListener === "function") {
        mql.removeEventListener("change", onChange)
      } else {
        mqlWithLegacyApi.removeListener?.(onChange)
      }
      window.removeEventListener("resize", onChange)
    }
  }, [getIsMobile])

  return isMobile
}
