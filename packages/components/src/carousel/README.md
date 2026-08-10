# Carousel

A carousel that lands where the flick was aimed.

```tsx
import {
  Carousel,
  CarouselViewport,
  CarouselSlide,
  CarouselDots,
  CarouselPrevious,
  CarouselNext,
} from "@dinachi/components"

<Carousel label="Highlights">
  <CarouselViewport>
    {slides.map((slide) => (
      <CarouselSlide key={slide.id} label={slide.title}>
        {/* your card */}
      </CarouselSlide>
    ))}
  </CarouselViewport>

  <div className="flex items-center justify-between">
    <CarouselDots labels={slides.map((s) => s.title)} />
    <div className="flex gap-1.5">
      <CarouselPrevious />
      <CarouselNext />
    </div>
  </div>
</Carousel>
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## Snap-to-nearest is the wrong rule

It measures where the finger stopped, which on a quick flick is barely past the slide it
started on — so a decisive gesture bounces back and the carousel feels stuck.

Projecting the release velocity 200ms forward and snapping to whichever slide *that* lands
in gets the opposite behaviour: a flick advances, a slow drag that stops short does not, and
both match what the hand meant.

## Positions are measured, not calculated

The obvious shortcut is `viewport.width * 0.72 + gap`. It is wrong the moment the gap comes
from a class rather than a constant, or a slide is a different width, or the container has
padding. Asking the layout where the slides are costs one measurement per resize and cannot
drift — and a resize re-aligns the strip rather than leaving it sitting between two slides.

It also means slides of uneven width land as accurately as even ones, and the dots count
themselves off what was measured.

## Reduced motion swaps the mechanism

The drag goes and the viewport becomes an ordinary scroll-snap strip. That is not a
downgrade — a native scroller is a better carousel than a JS one for anyone who did not want
the momentum in the first place.

The dots and the arrows keep working either way. They just jump instead of animating.

## The dots are not tabs

A tab controls a panel that appears in its place. These move a strip that is already fully
present, and calling them tabs promises a `tabpanel` relationship that does not exist. They
are buttons that jump, in a group named "Choose a slide".

## Accessibility

- The root is `role="group"` with `aria-roledescription="carousel"` and your `label`.
- Each slide is a group with `aria-roledescription="slide"` and a name that includes its
  position: `2 of 4: Velocity handoff`.
- The current dot carries `aria-current`.
- Both ends are real edges, not wrap points — the arrow that would run off the set is
  disabled. A carousel that silently wraps loses the reader's place in a set they were
  counting through.
