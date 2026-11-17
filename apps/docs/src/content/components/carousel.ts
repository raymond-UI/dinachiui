import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "carousel",
  description: "A draggable strip of slides that snaps where the flick was aimed.",
  usage: `import {
  Carousel,
  CarouselDots,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselViewport,
} from "@/components/ui/carousel"

const slides = [
  { id: "1", title: "Projection" },
  { id: "2", title: "Velocity handoff" },
  { id: "3", title: "Elastic edges" },
]

export function Highlights() {
  return (
    <Carousel label="Highlights">
      <CarouselViewport>
        {slides.map((slide) => (
          <CarouselSlide key={slide.id} label={slide.title}>
            <div className="h-40 rounded-lg border p-4">{slide.title}</div>
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
  )
}`,
  anatomy: `<Carousel>
  <CarouselViewport>
    <CarouselSlide />
  </CarouselViewport>
  <CarouselDots />
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`,

  examples: ["carousel-default", "carousel-uneven", "carousel-controlled"],

  parts: [
    {
      name: "Carousel",
      summary: "Holds the current slide and names the set.",
      props: [
        {
          name: "label",
          type: "string",
          default: '"Carousel"',
          description: "Names the carousel for screen readers and the agent.",
          agent: true,
        },
        { name: "index", type: "number", description: "Controlled current slide, from 0." },
        { name: "defaultIndex", type: "number", default: "0", description: "Starting slide when uncontrolled." },
        {
          name: "onIndexChange",
          type: "(index, details) => void",
          description: "Runs for people and agents. `details.reason` says why, and `details.cancel()` keeps the current slide.",
          agent: true,
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Turns off the drag, the arrows and the dots, and blocks agents.",
          agent: true,
        },
      ],
    },
    {
      name: "CarouselViewport",
      summary: "The window the strip moves in.",
      props: [{ name: "children", type: "ReactNode", description: "CarouselSlide elements, placed directly inside." }],
    },
    {
      name: "CarouselSlide",
      summary: "One slide, 72% of the viewport by default.",
      props: [
        {
          name: "label",
          type: "string",
          description: "Names the slide; falls back to its position. Agents pick slides by it.",
          agent: true,
        },
        { name: "className", type: "string", description: "Set the width here. Uneven widths are fine." },
      ],
    },
    {
      name: "CarouselDots",
      summary: "One button per measured slide.",
      props: [
        { name: "labels", type: "string[]", description: "Slide names, in order, used in each dot's accessible name." },
        { name: "dotClassName", type: "string", description: "Class applied to every dot." },
      ],
    },
    {
      name: "CarouselPrevious",
      summary: "Moves back one slide. Disabled on the first.",
      props: [{ name: "children", type: "ReactNode", default: "chevron icon", description: "Replaces the icon. The button keeps its aria-label." }],
    },
    {
      name: "CarouselNext",
      summary: "Moves forward one slide. Disabled on the last.",
      props: [{ name: "children", type: "ReactNode", default: "chevron icon", description: "Replaces the icon. The button keeps its aria-label." }],
    },
  ],

  notes: [
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
    {
      title: "Snapping",
      body: "On release, the velocity is projected 200ms forward from the strip's position and the strip snaps to the slide that lands in. A flick advances; a slow drag that stops short does not.",
    },
    {
      title: "Slide sizes",
      body: "Slide positions are measured from layout, so gaps set by class, uneven widths and container padding all work. A resize re-aligns the strip to the current slide. The dots count the measured slides.",
    },
    {
      title: "Reduced motion",
      body: "The drag is replaced by a native scroll-snap strip. Dots and arrows jump instead of animating. Honours the OS setting and an app-level `<MotionConfig reducedMotion>`.",
    },
    {
      title: "When to use it",
      body: "- A short set viewed one at a time: highlights, screenshots, testimonials. Suits touch-first surfaces.\n- For content to compare side by side, use a grid.\n- Do not hide content that matters; off-screen slides read as optional.",
    },
  ],

  agent: {
    kind: "carousel",
    reads: [
      { field: "label", means: "The Carousel's label." },
      { field: "value", means: "The current slide's label, or its number when unnamed." },
      { field: "items", means: "Every slide's label, in order." },
      { field: "disabled", means: "True when the carousel is disabled." },
    ],
    actions: [
      { call: 'goTo("Velocity handoff")', does: "Moves by label, or by number from 1. A miss lists the slides." },
    ],
    refusal:
      "An agent's move runs through onIndexChange like a drag or dot press. isAgentChange(details) is true for it; details.cancel() refuses it and the agent is told the app refused. A disabled carousel refuses on its own. The dots and arrows are not listed separately.",
    example: `await agent.act({
  steps: [{ ref: "Gesture techniques", action: "goTo", args: ["Velocity handoff"] }],
})`,
  },

  keyboard: [
    { keys: ["Tab"], does: "Moves between the dots and the arrows" },
    { keys: ["Enter", "Space"], does: "On a dot or an arrow, moves to that slide" },
  ],

  accessibility: [
    'The root is role="group" with aria-roledescription="carousel" and your label.',
    'Each slide is a group with aria-roledescription="slide", named with its position: "2 of 4: Velocity handoff".',
    'The dots are buttons in a group named "Choose a slide"; the current one has aria-current.',
    "The set does not wrap. The arrow at either end is disabled.",
    "The strip has no arrow-key handling. Keyboard users move with the dots and arrows.",
  ],
} satisfies ComponentDoc;
