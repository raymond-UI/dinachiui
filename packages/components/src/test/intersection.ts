/**
 * A driveable `IntersectionObserver`, for the tests that need the un-revealed state.
 *
 * The shared stub in `setup.ts` answers "on screen" to everything, which is the right
 * default: a component that only animates once in view should be settled by the time an
 * assertion runs. Testing what it looks like *before* that needs the other answer, so
 * this replaces the stub for the file that installs it.
 */
export function installIntersectionObserver(initial = { intersecting: true }) {
  const original = globalThis.IntersectionObserver
  let intersecting = initial.intersecting

  const live = new Set<{
    callback: IntersectionObserverCallback
    targets: Set<Element>
    instance: IntersectionObserver
  }>()

  function report(
    entry: { callback: IntersectionObserverCallback; targets: Set<Element>; instance: IntersectionObserver }
  ) {
    if (entry.targets.size === 0) return
    entry.callback(
      [...entry.targets].map(
        (target) =>
          ({
            target,
            isIntersecting: intersecting,
            intersectionRatio: intersecting ? 1 : 0,
            boundingClientRect: target.getBoundingClientRect(),
            intersectionRect: target.getBoundingClientRect(),
            rootBounds: null,
            time: 0,
          }) as IntersectionObserverEntry
      ),
      entry.instance
    )
  }

  class ControlledObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null
    readonly rootMargin: string = '0px'
    readonly scrollMargin: string = '0px'
    readonly thresholds: ReadonlyArray<number> = [0]

    private readonly entry: {
      callback: IntersectionObserverCallback
      targets: Set<Element>
      instance: IntersectionObserver
    }

    constructor(callback: IntersectionObserverCallback) {
      this.entry = { callback, targets: new Set(), instance: this }
      live.add(this.entry)
    }

    observe(target: Element) {
      this.entry.targets.add(target)
      // Re-registered rather than assumed live: Motion caches one observer per set of
      // viewport options and hands the same instance to the next component that asks
      // for it, so an observer that has been disconnected can still come back.
      live.add(this.entry)
      report(this.entry)
    }

    unobserve(target: Element) {
      this.entry.targets.delete(target)
    }

    disconnect() {
      this.entry.targets.clear()
      live.delete(this.entry)
    }

    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }

  globalThis.IntersectionObserver =
    ControlledObserver as unknown as typeof IntersectionObserver

  return {
    /** Scrolls every observed element into or out of view. */
    setIntersecting(next: boolean) {
      intersecting = next
      live.forEach(report)
    },
    restore() {
      globalThis.IntersectionObserver = original
      live.clear()
    },
  }
}
