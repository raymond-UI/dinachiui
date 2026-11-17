"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectFieldLabel,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const regions = [
  { value: "fra", label: "Frankfurt" },
  { value: "lhr", label: "London" },
  { value: "iad", label: "Virginia" },
  { value: "pdx", label: "Oregon" },
  { value: "sin", label: "Singapore" },
  { value: "nrt", label: "Tokyo" },
]
const labelOf = (v: string) => regions.find((r) => r.value === v)?.label

export function ControlledSelectExample() {
  const [region, setRegion] = React.useState<string | null>("lhr")
  return (
    <div className="flex w-full max-w-[300px] flex-col gap-3">
      <div className="flex items-center gap-2">
        <Select items={regions} value={region} onValueChange={setRegion}>
          <SelectTrigger aria-label="Region">
            <SelectValue placeholder="Choose a region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((r) => (
              <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" onClick={() => setRegion(null)}>Clear</Button>
      </div>
      <code className="font-mono text-xs text-muted-foreground">region = {region ? `"${region}"` : "null"}</code>
    </div>
  )
}

export function MultipleSelectExample() {
  return (
    <div className="w-full max-w-[300px]">
      <Select items={regions} multiple defaultValue={["fra", "sin"]}>
        <SelectTrigger aria-label="Replica regions">
          <SelectValue>
            {(value: string[]) => (value.length ? value.map(labelOf).join(", ") : "No replicas")}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {regions.map((r) => (
            <SelectItem key={r.value} value={r.value} showIndicator>{r.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function SelectWithGroupsExample() {
  return (
    <Select>
      <SelectTrigger aria-label="Timezone" className="w-[240px]">
        <SelectValue placeholder="Choose a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern (EST)</SelectItem>
          <SelectItem value="cst">Central (CST)</SelectItem>
          <SelectItem value="pst">Pacific (PST)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">GMT</SelectItem>
          <SelectItem value="cet">Central European (CET)</SelectItem>
          <SelectItem value="eet">Eastern European (EET)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

const full = new Set(["pdx"])

export function DisabledItemSelectExample() {
  return (
    <div className="w-full max-w-[300px]">
      <Select items={regions}>
        <SelectTrigger aria-label="Region">
          <SelectValue placeholder="Choose a region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((r) => (
            <SelectItem key={r.value} value={r.value} disabled={full.has(r.value)}>
              {r.label}{full.has(r.value) && " (full)"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function FormSelectExample() {
  const [sent, setSent] = React.useState<string | null>(null)
  return (
    <form
      className="flex w-full max-w-[300px] flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        setSent(String(new FormData(e.currentTarget).get("region") ?? ""))
      }}
    >
      <Select items={regions} name="region" required>
        <SelectFieldLabel>Region</SelectFieldLabel>
        <SelectTrigger>
          <SelectValue placeholder="Choose a region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((r) => (
            <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center gap-3">
        <Button type="submit">Deploy</Button>
        {sent !== null && <code className="font-mono text-xs text-muted-foreground">region = &quot;{sent}&quot;</code>}
      </div>
    </form>
  )
}
