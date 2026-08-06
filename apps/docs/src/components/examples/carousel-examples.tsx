"use client";

import * as React from "react";
import {
  Carousel,
  CarouselViewport,
  CarouselSlide,
  CarouselDots,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const SLIDES = [
  { id: "1", title: "Projection", detail: "Where the flick was aimed", gradient: "from-primary/70 to-primary/20" },
  { id: "2", title: "Velocity handoff", detail: "No seam on release", gradient: "from-emerald-500/70 to-emerald-500/20" },
  { id: "3", title: "Elastic edges", detail: "The end of the set, felt", gradient: "from-amber-500/70 to-amber-500/20" },
  { id: "4", title: "Reduced motion", detail: "Becomes a scroll-snap strip", gradient: "from-sky-500/70 to-sky-500/20" },
];

function Card({ slide }: { slide: (typeof SLIDES)[number] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <div className={`h-24 bg-gradient-to-br ${slide.gradient}`} />
      <div className="p-3">
        <p className="text-sm font-medium text-foreground">{slide.title}</p>
        <p className="text-xs text-muted-foreground">{slide.detail}</p>
      </div>
    </div>
  );
}

export function DefaultCarouselExample() {
  return (
    <div className="w-full space-y-3">
      <Carousel label="Gesture techniques">
        <CarouselViewport>
          {SLIDES.map((slide) => (
            <CarouselSlide key={slide.id} label={slide.title}>
              <Card slide={slide} />
            </CarouselSlide>
          ))}
        </CarouselViewport>

        <div className="flex items-center justify-between">
          <CarouselDots labels={SLIDES.map((s) => s.title)} />
          <div className="flex gap-1.5">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </div>
      </Carousel>

      <p className="text-xs text-muted-foreground">
        Slide positions are measured from the DOM, so resizing the window keeps the strip
        aligned instead of leaving it between two slides.
      </p>
    </div>
  );
}

export function CarouselUnevenExample() {
  const widths = ["w-[45%]", "w-[70%]", "w-[35%]", "w-[60%]"];

  return (
    <div className="w-full space-y-3">
      <Carousel label="Uneven slides">
        <CarouselViewport>
          {SLIDES.map((slide, i) => (
            <CarouselSlide key={slide.id} label={slide.title} className={widths[i]}>
              <Card slide={slide} />
            </CarouselSlide>
          ))}
        </CarouselViewport>
        <CarouselDots labels={SLIDES.map((s) => s.title)} />
      </Carousel>

      <p className="text-xs text-muted-foreground">
        Nothing here assumes a slide width. Each one lands on its own measured position.
      </p>
    </div>
  );
}

export function CarouselControlledExample() {
  const [index, setIndex] = React.useState(0);

  return (
    <div className="w-full space-y-3">
      <Carousel label="Controlled carousel" index={index} onIndexChange={setIndex}>
        <CarouselViewport>
          {SLIDES.map((slide) => (
            <CarouselSlide key={slide.id} label={slide.title}>
              <Card slide={slide} />
            </CarouselSlide>
          ))}
        </CarouselViewport>

        <div className="flex items-center justify-between">
          <CarouselDots labels={SLIDES.map((s) => s.title)} />
          <div className="flex gap-1.5">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </div>
      </Carousel>

      <p className="text-xs text-muted-foreground">
        Slide {index + 1} of {SLIDES.length}: {SLIDES[index].title}
      </p>
    </div>
  );
}
