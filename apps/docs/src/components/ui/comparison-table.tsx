"use client"

import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch, SwitchThumb } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { changeAsAgent, matchAgentChoice, useAgentControl, useAgentState, useHasAgent, useMergedRef } from "@/components/ui/agent"

export type ComparisonBilling = "monthly" | "yearly"

/** `true` is included, `false` or nothing is not, and text is shown as it is. */
export type ComparisonCellValue = boolean | string | number | null | undefined

export interface ComparisonPlan {
  id: string
  name: string
  price: Record<ComparisonBilling, React.ReactNode>
  /** The line under the price, such as "a month". Leave a plan's out to keep it blank. */
  per?: Partial<Record<ComparisonBilling, React.ReactNode>>
  /** The plan's button. The label defaults to "Choose {name}"; `href` renders a link. */
  cta?: { label?: React.ReactNode; href?: string; onClick?: (event: React.MouseEvent) => void }
  /** Tints the plan's column and fills its button. One plan at most. */
  highlighted?: boolean
}

export interface ComparisonFeature {
  label: string
  /** Each plan's value, by plan id. */
  values: Record<string, ComparisonCellValue>
}

export interface ComparisonGroup {
  label: string
  features: ComparisonFeature[]
}

/** Base UI's change details, which the agent's changes also carry. */
export interface ComparisonChangeDetails {
  reason: string
  event?: Event
  isCanceled: boolean
  cancel(): void
}

const BILLING: { value: ComparisonBilling; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
]

const WIDE = "(min-width: 768px)"

// A missing value and `false` both mean not included, so they count as the same.
const norm = (v: ComparisonCellValue) => (v == null || v === false ? false : v === true ? true : String(v))

/** Whether the plans disagree on a feature. */
export function featureDiffers(feature: ComparisonFeature, planIds: string[]): boolean {
  return planIds.some((id) => norm(feature.values[id]) !== norm(feature.values[planIds[0]]))
}

const tint = "bg-[color:color-mix(in_oklab,var(--secondary)_55%,var(--card))]"

export interface ComparisonValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: ComparisonCellValue
}

/** One plan's value for a feature: a tick read as Included, a dash read as Not included, or text. */
const ComparisonValue = React.forwardRef<HTMLSpanElement, ComparisonValueProps>(({ value, className, ...props }, ref) => {
  const v = norm(value)
  return (
    <span
      ref={ref}
      data-slot="comparison-value"
      role={typeof v === "boolean" ? "img" : undefined}
      aria-label={v === true ? "Included" : v === false ? "Not included" : undefined}
      className={cn("inline-flex items-center", v === false && "text-muted-foreground", className)}
      {...props}
    >
      {v === true ? <Check aria-hidden className="h-4 w-4" strokeWidth={2.25} /> : v === false ? <span aria-hidden>–</span> : v}
    </span>
  )
})
ComparisonValue.displayName = "ComparisonValue"

export interface ComparisonTableProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  plans: ComparisonPlan[]
  groups: ComparisonGroup[]
  billing?: ComparisonBilling
  defaultBilling?: ComparisonBilling
  /** Runs on every change, for people and agents. `details.cancel()` refuses it. */
  onBillingChange?: (billing: ComparisonBilling, details: ComparisonChangeDetails) => void
  /** Hides every feature the plans agree on. */
  onlyDifferences?: boolean
  defaultOnlyDifferences?: boolean
  onOnlyDifferencesChange?: (onlyDifferences: boolean, details: ComparisonChangeDetails) => void
  /** Small text over the feature names, such as "Prices per seat, ex. VAT". */
  note?: React.ReactNode
  /** The two plans a phone compares, by id. Defaults to the highlighted plan and the one after it. */
  defaultPhonePlans?: [string, string]
  /** Caps the height, so the features scroll under the plan row. Without it the plan row sticks to the page. */
  maxHeight?: number | string
  disabled?: boolean
}

/**
 * Plans as columns and features as rows, grouped. The plan row sticks with each price and
 * button. Below 768px it becomes two plan pickers with each feature's values under its name.
 */
const ComparisonTable = React.forwardRef<HTMLDivElement, ComparisonTableProps>((props, ref) => {
  const {
    plans,
    groups,
    billing: billingProp,
    defaultBilling = "monthly",
    onBillingChange,
    onlyDifferences: diffProp,
    defaultOnlyDifferences = false,
    onOnlyDifferencesChange,
    note,
    defaultPhonePlans,
    maxHeight,
    disabled,
    className,
    ...rest
  } = props
  const hasAgent = useHasAgent()
  const [billing, changeBilling] = useAgentState<ComparisonBilling, ComparisonChangeDetails>(
    billingProp,
    defaultBilling,
    onBillingChange
  )
  const [only, changeOnly] = useAgentState<boolean, ComparisonChangeDetails>(diffProp, defaultOnlyDifferences, onOnlyDifferencesChange)
  const [picked, setPhone] = React.useState<[string, string]>(() => {
    if (defaultPhonePlans) return defaultPhonePlans
    const at = Math.max(0, plans.findIndex((p) => p.highlighted))
    const first = Math.min(at, Math.max(0, plans.length - 2))
    return [plans[first]?.id ?? "", plans[first + 1]?.id ?? plans[first]?.id ?? ""]
  })

  const root = React.useRef<HTMLDivElement | null>(null)
  const rootRef = useMergedRef(ref, root)
  const seg = React.useRef<HTMLDivElement | null>(null)
  const id = React.useId()

  const allIds = plans.map((p) => p.id)
  // A picked plan that is no longer in `plans` falls back to the plan in its place.
  const phone = picked.map((planId, i) => (allIds.includes(planId) ? planId : (allIds[i] ?? allIds[0] ?? ""))) as [
    string,
    string,
  ]
  const features = groups.flatMap((g) => g.features)
  const hiddenWide = only ? features.filter((f) => !featureDiffers(f, allIds)).length : 0
  const hiddenPhone = only ? features.filter((f) => !featureDiffers(f, phone)).length : 0

  // CSS hides the layout that does not fit, which the agent cannot see, so the hidden one is
  // marked for it directly. Outside AgentProvider nothing is marked and nothing re-renders.
  React.useEffect(() => {
    if (!hasAgent || !root.current) return
    const query = window.matchMedia?.(WIDE)
    const mark = () => {
      const wide = query?.matches ?? true
      const el = root.current
      el?.querySelector('[data-slot="comparison-table-plans"]')?.toggleAttribute("data-agent-hidden", !wide)
      el?.querySelector('[data-slot="comparison-table-phone"]')?.toggleAttribute("data-agent-hidden", wide)
    }
    mark()
    query?.addEventListener("change", mark)
    return () => query?.removeEventListener("change", mark)
  }, [hasAgent])

  /* ---- agent ---- */
  useAgentControl(() => ({
    kind: "toggle-group",
    element: seg.current,
    label: "Billing",
    value: BILLING.find((b) => b.value === billing)?.label ?? billing,
    items: BILLING.map((b) => b.label),
    disabled,
    actions: {
      setValue: (wanted: unknown) => {
        const match = matchAgentChoice(BILLING, wanted)
        if (typeof match === "string") return match
        return match.value === billing ? undefined : changeAsAgent(changeBilling, match.value)
      },
    },
  }))

  const cta = (plan: ComparisonPlan, className?: string) => {
    const label = plan.cta?.label ?? `Choose ${plan.name}`
    return (
      <Button
        data-slot="comparison-table-cta"
        variant={plan.highlighted ? "default" : "outline"}
        disabled={disabled}
        onClick={plan.cta?.onClick}
        render={plan.cta?.href ? <a href={plan.cta.href} /> : undefined}
        // Base UI names a non-button element a button; a link keeps its own role.
        {...(plan.cta?.href ? { role: undefined } : {})}
        className={cn("w-full px-3 text-[13px]", className)}
      >
        {label}
      </Button>
    )
  }

  const scroll = maxHeight != null

  return (
    <div
      ref={rootRef}
      data-slot="comparison-table"
      className={cn("w-full overflow-clip rounded-xl border bg-card text-card-foreground", className)}
      {...rest}
    >
      <div
        data-slot="comparison-table-toolbar"
        className="flex flex-wrap items-center gap-x-2.5 gap-y-2 border-b px-4 py-3 text-[13px] md:px-[18px] md:py-3.5"
      >
        <Switch
          aria-labelledby={`${id}-only`}
          checked={only}
          disabled={disabled}
          onCheckedChange={(next, details) => changeOnly(next, details as ComparisonChangeDetails)}
        >
          <SwitchThumb />
        </Switch>
        <span id={`${id}-only`}>
          Only differences
        </span>
        <span aria-live="polite" className="text-muted-foreground max-md:hidden">
          {hiddenWide > 0 ? `${hiddenWide} hidden` : ""}
        </span>
        <span aria-live="polite" className="text-muted-foreground md:hidden">
          {hiddenPhone > 0 ? `${hiddenPhone} hidden` : ""}
        </span>
        <ToggleGroupPrimitive
          ref={seg}
          data-slot="comparison-table-billing"
          aria-label="Billing"
          value={[billing]}
          disabled={disabled}
          onValueChange={(value, details) => {
            const next = value[0] as ComparisonBilling | undefined
            // Pressing the chosen period again would leave none chosen.
            if (next && next !== billing) changeBilling(next, details as ComparisonChangeDetails)
          }}
          className="ms-auto inline-flex rounded-full border p-0.5 max-md:order-first max-md:ms-0 max-md:grid max-md:w-full max-md:grid-cols-2"
        >
          {BILLING.map((b) => (
            <TogglePrimitive
              key={b.value}
              value={b.value}
              data-agent-part={hasAgent ? "" : undefined}
              className={cn(
                "h-7 cursor-pointer rounded-full px-3 text-[13px] text-muted-foreground transition-colors duration-100 motion-reduce:transition-none max-md:h-8",
                "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "data-[pressed]:bg-primary data-[pressed]:text-primary-foreground",
                "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
              )}
            >
              {b.label}
            </TogglePrimitive>
          ))}
        </ToggleGroupPrimitive>
      </div>

      <div
        data-slot="comparison-table-scroll"
        className={cn(scroll && "overflow-auto")}
        style={scroll ? { maxHeight } : undefined}
      >
        <div data-slot="comparison-table-plans" className="max-md:hidden">
          <Table containerClassName="overflow-visible" className="table-fixed">
            <colgroup>
              <col className="w-[34%]" />
              {plans.map((p) => (
                <col key={p.id} />
              ))}
            </colgroup>
            {/* The head sticks as one, so each button stays level however the lines above it wrap. */}
            <TableHeader className="sticky top-[var(--comparison-table-top,0px)] z-10">
              <TableRow>
                <TableHead
                  rowSpan={2}
                  className="h-auto whitespace-normal bg-card px-4 pb-3.5 pt-4 align-top text-xs font-normal"
                >
                  {note ?? <span className="sr-only">Feature</span>}
                </TableHead>
                {plans.map((plan) => (
                  <TableHead
                    key={plan.id}
                    data-highlighted={plan.highlighted || undefined}
                    className={cn(
                      "h-auto whitespace-normal border-b-0 bg-card px-4 pt-4 align-top font-normal text-foreground",
                      plan.highlighted && tint
                    )}
                  >
                    <div className="text-sm font-semibold">{plan.name}</div>
                    <div className="mb-0.5 mt-1.5 text-[26px] font-semibold leading-tight tracking-[-0.02em] tabular-nums">
                      {plan.price[billing]}
                    </div>
                    <div className="min-h-[18px] text-xs leading-[18px] text-muted-foreground">{plan.per?.[billing]}</div>
                  </TableHead>
                ))}
              </TableRow>
              <TableRow>
                {plans.map((plan) => (
                  <TableCell
                    key={plan.id}
                    className={cn("h-auto border-b bg-card px-4 pb-3.5 pt-3 align-bottom", plan.highlighted && tint)}
                  >
                    {cta(plan, "h-9")}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            {groups.map((group) => {
              const shown = group.features.filter((f) => !only || featureDiffers(f, allIds))
              if (!shown.length) return null
              return (
                <TableBody key={group.label} data-slot="comparison-table-group">
                  <TableRow className="hover:bg-transparent">
                    <TableHead
                      scope="colgroup"
                      colSpan={plans.length + 1}
                      className="h-auto px-4 pb-2.5 pt-[22px] text-xs font-semibold text-muted-foreground"
                    >
                      {group.label}
                    </TableHead>
                  </TableRow>
                  {shown.map((feature) => (
                    <TableRow key={feature.label} data-slot="comparison-table-feature">
                      <TableHead className="h-auto whitespace-normal px-4 py-[11px] font-normal">{feature.label}</TableHead>
                      {plans.map((plan) => (
                        <TableCell
                          key={plan.id}
                          className={cn("h-auto whitespace-normal px-4 py-[11px]", plan.highlighted && tint)}
                        >
                          <ComparisonValue value={feature.values[plan.id]} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              )
            })}
          </Table>
        </div>

        <div data-slot="comparison-table-phone" className="px-4 md:hidden">
          <div className="sticky top-[var(--comparison-table-top,0px)] z-10 grid grid-cols-2 gap-2.5 border-b bg-card py-2.5">
            {phone.map((planId, i) => {
              const plan = plans.find((p) => p.id === planId)
              if (!plan) return null
              return (
                <div key={i} className="min-w-0">
                  <Select
                    items={plans.map((p) => ({ value: p.id, label: p.name }))}
                    value={plan.id}
                    disabled={disabled}
                    onValueChange={(next) => {
                      if (typeof next !== "string") return
                      setPhone(i === 0 ? [next, phone[1]] : [phone[0], next])
                    }}
                  >
                    <SelectTrigger
                      aria-label={i === 0 ? "First plan" : "Second plan"}
                      className="h-9 rounded-lg px-2.5 text-[15px] font-semibold"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mx-0.5 mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-lg font-semibold tabular-nums">{plan.price[billing]}</span>
                    <span className="truncate text-[13px] text-muted-foreground">{plan.per?.[billing]}</span>
                  </div>
                </div>
              )
            })}
          </div>
          {/* The buttons scroll away; the plan and its price stay. */}
          <div className="grid grid-cols-2 gap-2.5 pt-3">
            {phone.map((planId, i) => {
              const plan = plans.find((p) => p.id === planId)
              return plan ? <div key={i}>{cta(plan, "h-10 w-full rounded-xl")}</div> : null
            })}
          </div>
          {groups.map((group) => {
            const shown = group.features.filter((f) => !only || featureDiffers(f, phone))
            if (!shown.length) return null
            return (
              <section key={group.label} aria-label={group.label} data-slot="comparison-table-group">
                <h3 className="pb-1.5 pt-5 text-[13px] font-semibold text-muted-foreground">{group.label}</h3>
                <dl>
                  {shown.map((feature) => (
                    <div
                      key={feature.label}
                      data-slot="comparison-table-feature"
                      className="grid grid-cols-2 gap-x-2.5 border-b py-2.5 text-[15px] last:border-b-0"
                    >
                      <dt className="col-span-2 mb-1 text-[13px] text-muted-foreground">{feature.label}</dt>
                      {phone.map((planId, i) => (
                        <dd key={i}>
                          <span className="sr-only">{plans.find((p) => p.id === planId)?.name}: </span>
                          <ComparisonValue value={feature.values[planId]} />
                        </dd>
                      ))}
                    </div>
                  ))}
                </dl>
              </section>
            )
          })}
          <div className="h-5" />
        </div>
      </div>
    </div>
  )
})
ComparisonTable.displayName = "ComparisonTable"

export { ComparisonTable, ComparisonValue }
