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

/** A billing period's value, such as "monthly". */
export type ComparisonBilling = string

/** One choice on the billing toggle. Plans key their `price` and `per` by `value`. */
export interface ComparisonPeriod {
  value: ComparisonBilling
  label: string
}

/** One node for every period, or one node for each period by its value. */
export type ComparisonByPeriod = React.ReactNode | Partial<Record<ComparisonBilling, React.ReactNode>>

/** `true` is included, `false` or nothing is not, and text is shown as it is. */
export type ComparisonCellValue = boolean | string | number | null | undefined

export interface ComparisonPlan {
  id: string
  name: string
  /** The price, the same for every period, or keyed by period value. */
  price: ComparisonByPeriod
  /** The line under the price, such as "a month". Leave a plan's out to keep it blank. */
  per?: ComparisonByPeriod
  /**
   * The plan's button. The label defaults to "Choose {name}"; a label without the plan's
   * name is read with it. `href` renders a link, and `false` leaves the plan without one.
   */
  cta?: { label?: React.ReactNode; href?: string; onClick?: (event: React.MouseEvent) => void } | false
  /** Tints the plan's column, fills its button and badges it "Recommended". One plan at most. */
  highlighted?: boolean
  /** A label over the plan's name, read with its header and button. Defaults to "Recommended" when highlighted. */
  badge?: string
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

const BILLING: ComparisonPeriod[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
]

const WIDE = "(min-width: 768px)"

const byPeriod = (v: ComparisonByPeriod): v is Partial<Record<ComparisonBilling, React.ReactNode>> =>
  v != null &&
  typeof v === "object" &&
  !React.isValidElement(v) &&
  !(Symbol.iterator in v) &&
  typeof (v as { then?: unknown }).then !== "function"

const forPeriod = (v: ComparisonByPeriod, period: ComparisonBilling | undefined): React.ReactNode =>
  byPeriod(v) ? (period == null ? undefined : v[period]) : v

const badgeOf = (plan: ComparisonPlan) => plan.badge ?? (plan.highlighted ? "Recommended" : undefined)

// A missing value and `false` both mean not included, so they count as the same.
const norm = (v: ComparisonCellValue) => (v == null || v === false ? false : v === true ? true : String(v))

/** Whether the plans disagree on a feature. */
export function featureDiffers(feature: ComparisonFeature, planIds: string[]): boolean {
  return planIds.some((id) => norm(feature.values[id]) !== norm(feature.values[planIds[0]]))
}

const badgeClass =
  "inline-block rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium leading-4 text-primary-foreground"

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
  /** The toggle's periods. Defaults to Monthly and Yearly; `false` or fewer than two drops the toggle. */
  billingPeriods?: ComparisonPeriod[] | false
  /** Names the toggle, for people and agents. */
  billingLabel?: string
  billing?: ComparisonBilling
  /** Defaults to the first period. */
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
    billingPeriods = BILLING,
    billingLabel = "Billing",
    billing: billingProp,
    defaultBilling,
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
  const periods = billingPeriods || []
  const toggle = periods.length > 1
  const [billing, changeBilling] = useAgentState<ComparisonBilling, ComparisonChangeDetails>(
    billingProp,
    defaultBilling ?? periods[0]?.value ?? "",
    onBillingChange
  )
  const period = periods.length ? billing : undefined
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
  useAgentControl(() =>
    toggle
      ? {
          kind: "toggle-group",
          element: seg.current,
          label: billingLabel,
          value: periods.find((b) => b.value === billing)?.label ?? billing,
          items: periods.map((b) => b.label),
          disabled,
          actions: {
            setValue: (wanted: unknown) => {
              const match = matchAgentChoice(periods, wanted)
              if (typeof match === "string") return match
              return match.value === billing ? undefined : changeAsAgent(changeBilling, match.value)
            },
          },
        }
      : null
  )

  const nameId = (i: number) => `${id}-n${i}`
  const badgeId = (i: number) => `${id}-b${i}`

  const cta = (plan: ComparisonPlan, at: number, badge: string | undefined, className?: string) => {
    if (plan.cta === false) return null
    const custom = plan.cta?.label
    const label = custom ?? `Choose ${plan.name}`
    const named = typeof label === "string" && label.includes(plan.name)
    const describedBy = [typeof label !== "string" && nameId(at), badge && badgeId(at)].filter(Boolean).join(" ")
    return (
      <Button
        data-slot="comparison-table-cta"
        variant={plan.highlighted ? "default" : "outline"}
        disabled={disabled}
        onClick={plan.cta?.onClick}
        render={plan.cta?.href ? <a href={plan.cta.href} /> : undefined}
        // Base UI names a non-button element a button; a link keeps its own role.
        {...(plan.cta?.href ? { role: undefined } : {})}
        aria-label={typeof label === "string" && !named ? `${label}, ${plan.name}` : undefined}
        aria-describedby={describedBy || undefined}
        className={cn("w-full px-3 text-[13px]", className)}
      >
        {label}
      </Button>
    )
  }

  const hasCta = plans.some((p) => p.cta !== false)
  const phoneBadges = phone.some((planId) => {
    const plan = plans.find((p) => p.id === planId)
    return plan ? badgeOf(plan) : false
  })

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
        {toggle && (
          <ToggleGroupPrimitive
            ref={seg}
            data-slot="comparison-table-billing"
            aria-label={billingLabel}
            value={[billing]}
            disabled={disabled}
            onValueChange={(value, details) => {
              const next = value[0] as ComparisonBilling | undefined
              // Pressing the chosen period again would leave none chosen.
              if (next && next !== billing) changeBilling(next, details as ComparisonChangeDetails)
            }}
            className="ms-auto inline-flex rounded-full border p-0.5 max-md:order-first max-md:ms-0 max-md:grid max-md:w-full max-md:auto-cols-fr max-md:grid-flow-col"
          >
            {periods.map((b) => (
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
        )}
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
            {/* Names, prices and buttons are a row each, so each lines up however the names wrap. */}
            <TableHeader className="sticky top-[var(--comparison-table-top,0px)] z-10">
              <TableRow>
                <TableHead
                  rowSpan={hasCta ? 3 : 2}
                  className="h-auto whitespace-normal bg-card px-4 pb-3.5 pt-4 align-top text-xs font-normal"
                >
                  {note ?? <span className="sr-only">Feature</span>}
                </TableHead>
                {plans.map((plan, i) => {
                  const badge = badgeOf(plan)
                  return (
                    <TableHead
                      key={plan.id}
                      data-highlighted={plan.highlighted || undefined}
                      className={cn(
                        "h-auto whitespace-normal border-b-0 bg-card px-4 pt-4 align-bottom font-normal text-foreground",
                        plan.highlighted && tint
                      )}
                    >
                      {badge && (
                        <span id={badgeId(i)} data-slot="comparison-table-badge" className={cn(badgeClass, "mb-1.5")}>
                          {badge}
                        </span>
                      )}{" "}
                      <div id={nameId(i)} className="text-sm font-semibold">
                        {plan.name}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
              <TableRow>
                {plans.map((plan) => (
                  <TableCell
                    key={plan.id}
                    className={cn(
                      "h-auto whitespace-normal bg-card px-4 pt-1.5 align-top",
                      hasCta ? "pb-0" : "border-b pb-3.5",
                      plan.highlighted && tint
                    )}
                  >
                    <div data-slot="comparison-table-price">
                      <div className="mb-0.5 text-[26px] font-semibold leading-tight tracking-[-0.02em] tabular-nums">
                        {forPeriod(plan.price, period)}
                      </div>
                      <div className="min-h-[18px] text-xs leading-[18px] text-muted-foreground">
                        {forPeriod(plan.per, period)}
                      </div>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
              {hasCta && (
                <TableRow>
                  {plans.map((plan, i) => (
                    <TableCell
                      key={plan.id}
                      className={cn("h-auto border-b bg-card px-4 pb-3.5 pt-3 align-bottom", plan.highlighted && tint)}
                    >
                      {cta(plan, i, badgeOf(plan), "h-9")}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableHeader>
            {groups.map((group, gi) => {
              const shown = group.features.map((f, fi) => [f, fi] as const).filter(([f]) => !only || featureDiffers(f, allIds))
              if (!shown.length) return null
              return (
                <TableBody key={gi} data-slot="comparison-table-group">
                  <TableRow className="hover:bg-transparent">
                    <TableHead
                      scope="colgroup"
                      colSpan={plans.length + 1}
                      className="h-auto px-4 pb-2.5 pt-[22px] text-xs font-semibold text-muted-foreground"
                    >
                      {group.label}
                    </TableHead>
                  </TableRow>
                  {shown.map(([feature, fi]) => (
                    <TableRow key={fi} data-slot="comparison-table-feature">
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
              const at = plans.findIndex((p) => p.id === planId)
              const plan = plans[at]
              if (!plan) return null
              const badge = badgeOf(plan)
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
                      aria-describedby={badge ? badgeId(at) : undefined}
                      // Names wrap to two lines rather than cut to a letter in a narrow column.
                      className="h-auto min-h-9 gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-[15px] font-semibold leading-tight [&>span]:line-clamp-2"
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
                  {phoneBadges && (
                    <div className="mx-0.5 mt-1.5 min-h-5">
                      {badge && (
                        <span aria-hidden data-slot="comparison-table-badge" className={badgeClass}>
                          {badge}
                        </span>
                      )}
                    </div>
                  )}
                  <div data-slot="comparison-table-price" className="mx-0.5 mt-1.5 flex flex-wrap items-baseline gap-x-1.5">
                    <span className="text-lg font-semibold tabular-nums">{forPeriod(plan.price, period)}</span>
                    <span className="text-[13px] text-muted-foreground">{forPeriod(plan.per, period)}</span>
                  </div>
                </div>
              )
            })}
          </div>
          {/* The buttons scroll away; the plan and its price stay. */}
          {phone.some((planId) => plans.find((p) => p.id === planId)?.cta !== false) && (
            <div className="grid grid-cols-2 gap-2.5 pt-3">
              {phone.map((planId, i) => {
                const at = plans.findIndex((p) => p.id === planId)
                const plan = plans[at]
                return plan ? <div key={i}>{cta(plan, at, badgeOf(plan), "h-10 w-full rounded-xl")}</div> : null
              })}
            </div>
          )}
          {groups.map((group, gi) => {
            const shown = group.features.map((f, fi) => [f, fi] as const).filter(([f]) => !only || featureDiffers(f, phone))
            if (!shown.length) return null
            return (
              <div key={gi} data-slot="comparison-table-group">
                <h3 className="pb-1.5 pt-5 text-[13px] font-semibold text-muted-foreground">{group.label}</h3>
                <dl>
                  {shown.map(([feature, fi]) => (
                    <div
                      key={fi}
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
              </div>
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
