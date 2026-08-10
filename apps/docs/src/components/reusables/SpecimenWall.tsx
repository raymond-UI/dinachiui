"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Meter, MeterIndicator, MeterTrack } from "@/components/ui/meter";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import {
  Slider,
  SliderControl,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { StaggerList, StaggerListItem } from "@/components/ui/stagger-list";
import { Switch, SwitchThumb } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { components } from "@/lib/component-metadata";
import { STAGGER } from "@/lib/motion";
import { AlignCenter, AlignLeft, AlignRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

/**
 * Twelve of the real components, imported the same way a reader's project imports
 * them. A screenshot would be easier to lay out and would prove nothing.
 */
const SPECIMENS: { name: string; slug: string; demo: React.ReactNode }[] = [
  {
    name: "Button",
    slug: "button",
    demo: (
      <>
        <Button size="sm">Get started</Button>
        <Button size="sm" variant="outline">
          Docs
        </Button>
      </>
    ),
  },
  {
    name: "Switch",
    slug: "switch",
    demo: (
      <>
        <Switch defaultChecked aria-label="On">
          <SwitchThumb />
        </Switch>
        <Switch aria-label="Off">
          <SwitchThumb />
        </Switch>
      </>
    ),
  },
  {
    name: "Badge",
    slug: "badge",
    demo: (
      <>
        <Badge variant="secondary">Default</Badge>
        <Badge variant="success">Shipped</Badge>
        <Badge variant="warning">Beta</Badge>
      </>
    ),
  },
  {
    name: "Avatar",
    slug: "avatar",
    demo: (
      <div className="flex">
        {["RA", "DC", "JL", "+9"].map((initials) => (
          <Avatar
            key={initials}
            size="sm"
            className="ring-background -ml-2 ring-2 first:ml-0"
          >
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    ),
  },
  {
    name: "Slider",
    slug: "slider",
    demo: (
      <Slider defaultValue={62} aria-label="Slider specimen" className="w-full">
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
    ),
  },
  {
    name: "Input",
    slug: "input",
    demo: (
      <Input
        placeholder="you@example.com"
        aria-label="Input specimen"
        className="h-9"
      />
    ),
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    demo: (
      <>
        <Checkbox defaultChecked aria-label="Checked" />
        <Checkbox aria-label="Unchecked" />
        <Checkbox defaultChecked aria-label="Also checked" />
      </>
    ),
  },
  {
    name: "Progress",
    slug: "progress",
    demo: (
      <Progress value={64} aria-label="Progress specimen" className="w-full">
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    ),
  },
  {
    name: "Tabs",
    slug: "tabs",
    demo: (
      <Tabs defaultValue="preview" className="w-auto">
        <TabsList className="h-9 bg-muted">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
      </Tabs>
    ),
  },
  {
    name: "Toggle group",
    slug: "toggle-group",
    demo: (
      <ToggleGroup defaultValue={["center"]}>
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeft className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenter className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRight className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    ),
  },
  {
    name: "Meter",
    slug: "meter",
    demo: (
      <Meter value={72} aria-label="Meter specimen" className="w-full">
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    ),
  },
  {
    name: "Number ticker",
    slug: "number-ticker",
    demo: (
      <NumberTicker
        value={components.length}
        startOnView
        once
        className="text-2xl font-medium tracking-tight"
      />
    ),
  },
];

export function SpecimenWall() {
  return (
    // `-mr-px` with the overflow clipped drops the last column's rule off the edge, so
    // the grid does not close itself with a frame the page does not have anywhere else.
    <div className="overflow-hidden">
      <StaggerList
        variant="rise"
        stagger={0.04}
        delay={STAGGER * 3}
        distance={8}
        className="border-border -mr-px grid grid-cols-2 border-t md:grid-cols-3 lg:grid-cols-4"
      >
        {SPECIMENS.map((specimen) => (
          <StaggerListItem
            key={specimen.slug}
            className="border-border group flex min-h-30 flex-col gap-4 border-b border-r px-5 py-4 sm:px-6 sm:py-5"
          >
            {/*
              Only the name is a link. The specimens are live — a switch that flips and
              a slider that drags — and burying working controls inside an anchor would
              be both invalid markup and a worse demonstration.
            */}
            <Link
              href={`/docs/components/${specimen.slug}`}
              className="text-muted-foreground/50 hover:text-foreground flex w-fit items-center gap-1 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors duration-150"
            >
              {specimen.name}
              <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
            </Link>
            <div className="flex flex-1 flex-wrap items-center gap-2">
              {specimen.demo}
            </div>
          </StaggerListItem>
        ))}
      </StaggerList>
    </div>
  );
}
