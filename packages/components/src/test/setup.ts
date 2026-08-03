import '@testing-library/jest-dom'

/**
 * jsdom implements neither of these, and the motion tier reaches for both: `useInView`
 * constructs an `IntersectionObserver` on mount, and `useReducedMotion` reads
 * `matchMedia`. Without them those components throw before rendering anything.
 *
 * Both stubs give the permissive answer — on screen, and no reduced-motion preference —
 * so a test sees the tree a user with default settings would. Anything that needs the
 * other branch drives it explicitly through `<MotionConfig>`.
 */

if (!('IntersectionObserver' in globalThis)) {
  class IntersectionObserverStub implements IntersectionObserver {
    readonly root: Element | Document | null = null
    readonly rootMargin: string = '0px'
    readonly scrollMargin: string = '0px'
    readonly thresholds: ReadonlyArray<number> = [0]

    constructor(private readonly callback: IntersectionObserverCallback) {}

    observe(target: Element) {
      // Reported synchronously rather than on a later tick: a component that only
      // animates once in view should be settled by the time an assertion runs, and a
      // deferred callback would make every such test a race.
      const rect = target.getBoundingClientRect()
      this.callback(
        [
          {
            target,
            isIntersecting: true,
            intersectionRatio: 1,
            boundingClientRect: rect,
            intersectionRect: rect,
            rootBounds: null,
            time: 0,
          } as IntersectionObserverEntry,
        ],
        this
      )
    }

    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }

  globalThis.IntersectionObserver =
    IntersectionObserverStub as unknown as typeof IntersectionObserver
}

if (!globalThis.matchMedia) {
  globalThis.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof globalThis.matchMedia
}

/**
 * jsdom performs no layout, so a `ResizeObserver` here can only report the sizes a test
 * has stubbed. Firing on `observe` is what makes that useful: the component reads its
 * measurement during mount rather than a tick later.
 */
if (!('ResizeObserver' in globalThis)) {
  class ResizeObserverStub implements ResizeObserver {
    constructor(private readonly callback: ResizeObserverCallback) {}

    observe(target: Element) {
      const node = target as HTMLElement
      // The full entry shape, not just the target. A component that reads
      // `borderBoxSize` has no fallback to fall back to, so a partial entry crashes it
      // rather than measuring zero.
      const size = {
        inlineSize: node.offsetWidth ?? 0,
        blockSize: node.offsetHeight ?? 0,
      }
      this.callback(
        [
          {
            target,
            borderBoxSize: [size],
            contentBoxSize: [size],
            devicePixelContentBoxSize: [size],
            contentRect: target.getBoundingClientRect(),
          } as unknown as ResizeObserverEntry,
        ],
        this
      )
    }

    unobserve() {}
    disconnect() {}
  }

  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
}

