/**
 * A recording stand-in for the Web Animations API, which jsdom does not implement.
 *
 * Nothing here interpolates. The components that hand work to the compositor are tested
 * on what they hand over: keyframes, duration, direction, playback rate. That is the
 * whole of their contract with the browser, and reading it back through
 * `element.getAnimations()` keeps the tests on the public surface rather than on a spy.
 *
 * Opt-in rather than part of the shared setup, because Base UI waits on
 * `getAnimations()` before unmounting an overlay. Defining it globally would make every
 * dialog, drawer, and popover wait on animations that never finish.
 */
export function installWebAnimations() {
  // The DOM typings say this always exists. jsdom is where it does not.
  if (Object.prototype.hasOwnProperty.call(Element.prototype, 'animate')) {
    return () => {}
  }

  const animations = new WeakMap<Element, Animation[]>()

  class AnimationStub {
    currentTime: number | null = 0
    playbackRate = 1
    playState: AnimationPlayState = 'running'

    constructor(
      readonly keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
      readonly options: number | KeyframeAnimationOptions | undefined,
      private readonly target: Element
    ) {}

    play() {
      this.playState = 'running'
    }

    pause() {
      this.playState = 'paused'
    }

    finish() {
      this.playState = 'finished'
    }

    cancel() {
      this.playState = 'idle'
      const list = animations.get(this.target) ?? []
      animations.set(
        this.target,
        list.filter((entry) => entry !== (this as unknown as Animation))
      )
    }
  }

  Element.prototype.animate = function (this: Element, keyframes, options) {
    const animation = new AnimationStub(
      keyframes,
      options,
      this
    ) as unknown as Animation
    animations.set(this, [...(animations.get(this) ?? []), animation])
    return animation
  }

  Element.prototype.getAnimations = function (this: Element) {
    return animations.get(this) ?? []
  }

  return () => {
    Reflect.deleteProperty(Element.prototype, 'animate')
    Reflect.deleteProperty(Element.prototype, 'getAnimations')
  }
}

/** What `installWebAnimations` records for one call to `Element.animate`. */
export type RecordedAnimation = Animation & {
  keyframes: Keyframe[]
  options: KeyframeAnimationOptions
}
