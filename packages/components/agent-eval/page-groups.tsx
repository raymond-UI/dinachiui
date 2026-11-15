import * as React from "react"
import { AgentProvider, createAgent, type Agent, type AgentOptions } from "../src/agent"
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "../src/accordion"
import { Checkbox } from "../src/checkbox"
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "../src/combobox"
import { Menu, MenuCheckboxItem, MenuContent, MenuItem, MenuTrigger } from "../src/menu"
import { Meter, MeterLabel, MeterTrack, MeterIndicator } from "../src/meter"
import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput } from "../src/number-field"
import { Progress, ProgressLabel, ProgressTrack, ProgressIndicator } from "../src/progress"
import { Radio, RadioGroup } from "../src/radio"
import { Slider, SliderControl, SliderLabel, SliderRange, SliderThumb, SliderTrack } from "../src/slider"
import { Sortable, SortableHandle, SortableItem } from "../src/sortable"
import { Switch, SwitchThumb } from "../src/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../src/tabs"
import { Textarea } from "../src/textarea"
import { Toast, useToastManager } from "../src/toast"

/** One page with a control from each group the bridge covers. */
export interface GroupsState {
  description: string
  seats: number | null
  volume: number
  alerts: boolean
  plan: string
  terms: boolean
  fruit: string | null
  pinned: boolean
  duplicated: boolean
  faq: string[]
  tab: string
  chapters: string[]
}

const fruits = ["Apple", "Banana", "Cherry"]

function Notify() {
  const manager = useToastManager()
  const added = React.useRef(false)
  React.useEffect(() => {
    if (added.current) return
    added.current = true
    manager.add({ title: "Export ready", description: "Your report finished exporting", type: "success", timeout: 0 })
  }, [manager])
  return null
}

function Page({ state }: { state: GroupsState }) {
  const [, rerender] = React.useReducer((n: number) => n + 1, 0)
  const update = (fn: (s: GroupsState) => void) => {
    fn(state)
    rerender()
  }
  return (
    <main>
      <h1>Mission settings</h1>

      <Textarea aria-label="Description" value={state.description} onValueChange={(v) => update((s) => (s.description = v))} />
      <NumberField value={state.seats} min={1} max={50} onValueChange={(v) => update((s) => (s.seats = v))}>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput aria-label="Seats" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <Slider value={state.volume} step={5} onValueChange={(v) => update((s) => (s.volume = v as number))}>
        <SliderLabel>Volume</SliderLabel>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>

      <Switch aria-label="Email alerts" checked={state.alerts} onCheckedChange={(v) => update((s) => (s.alerts = v))}>
        <SwitchThumb />
      </Switch>
      <RadioGroup aria-label="Plan" value={state.plan} onValueChange={(v) => update((s) => (s.plan = v as string))}>
        <Radio aria-label="Free" value="free" />
        <Radio aria-label="Pro" value="pro" />
        <Radio aria-label="Team" value="team" />
      </RadioGroup>
      <Checkbox aria-label="Accept terms" checked={state.terms} onCheckedChange={(v) => update((s) => (s.terms = v))} />
      <Combobox items={fruits} value={state.fruit} onValueChange={(v) => update((s) => (s.fruit = v as string | null))}>
        <ComboboxInput aria-label="Snack" />
        <ComboboxContent>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem onClick={() => update((s) => (s.duplicated = true))}>Duplicate</MenuItem>
          <MenuCheckboxItem checked={state.pinned} onCheckedChange={(v) => update((s) => (s.pinned = v))}>
            Pinned
          </MenuCheckboxItem>
        </MenuContent>
      </Menu>
      <Accordion aria-label="FAQ" value={state.faq} onValueChange={(v) => update((s) => (s.faq = v as string[]))}>
        {["Shipping", "Returns", "Billing"].map((name) => (
          <AccordionItem key={name} value={name.toLowerCase()}>
            <AccordionHeader>
              <AccordionTrigger>{name}</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>{name} answer</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <Tabs aria-label="Sections" value={state.tab} onValueChange={(v) => update((s) => (s.tab = v as string))}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="general">General settings</TabsContent>
        <TabsContent value="billing">Billing settings</TabsContent>
      </Tabs>
      <Sortable aria-label="Chapters" value={state.chapters} onValueChange={(next) => update((s) => (s.chapters = next))}>
        {state.chapters.map((id) => (
          <SortableItem key={id} id={id} label={id}>
            <SortableHandle />
            <span>{id}</span>
          </SortableItem>
        ))}
      </Sortable>

      <Progress value={55}>
        <ProgressLabel>Upload</ProgressLabel>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
      <Meter value={40} min={0} max={100}>
        <MeterLabel>Storage</MeterLabel>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
      <Notify />
    </main>
  )
}

export function mountGroups(options: AgentOptions = {}): { agent: Agent; state: GroupsState; element: React.ReactElement } {
  const state: GroupsState = {
    description: "",
    seats: 4,
    volume: 50,
    alerts: false,
    plan: "free",
    terms: false,
    fruit: null,
    pinned: false,
    duplicated: false,
    faq: [],
    tab: "general",
    chapters: ["Overview", "Installation", "Components"],
  }
  const agent = createAgent(options)
  const element = (
    <AgentProvider agent={agent}>
      <Toast>
        <Page state={state} />
      </Toast>
    </AgentProvider>
  )
  return { agent, state, element }
}
