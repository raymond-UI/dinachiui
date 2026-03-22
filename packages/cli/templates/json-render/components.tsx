"use client";

import {
  useBoundProp,
  useFieldValidation,
  type SetState,
  type StateModel,
} from "@json-render/react";
import type { ReactNode } from "react";
import type { z } from "zod";

// DinachiUI component imports
import {
  Accordion as AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion";
import {
  AlertDialog as AlertDialogRoot,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Avatar as AvatarRoot,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Checkbox as DinachiCheckbox } from "@/components/ui/checkbox";
import {
  Collapsible as CollapsibleRoot,
  CollapsibleTrigger,
  CollapsiblePanel,
} from "@/components/ui/collapsible";
import {
  Dialog as DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer as DrawerRoot,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Fieldset as FieldsetRoot, FieldsetLegend } from "@/components/ui/fieldset";
import { Input } from "@/components/ui/input";
import {
  NumberField as NumberFieldRoot,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
} from "@/components/ui/number-field";
import {
  Popover as PopoverRoot,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Progress,
  ProgressTrack,
  ProgressIndicator,
} from "@/components/ui/progress";
import {
  RadioGroup,
  Radio,
  RadioIndicator,
} from "@/components/ui/radio";
import { ScrollArea as ScrollAreaComponent } from "@/components/ui/scroll-area";
import {
  Select as SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Slider as DinachiSlider,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from "@/components/ui/slider";
import { Switch as DinachiSwitch, SwitchThumb } from "@/components/ui/switch";
import {
  Tabs as TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { createToastManager } from "@/components/ui/toast";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup as ToggleGroupRoot, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  TooltipProvider,
  Tooltip as TooltipRoot,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { dinachiComponentDefinitions } from "./catalog";

// =============================================================================
// Toast Manager (singleton for action-based toast triggering)
// =============================================================================

export const toastManager = createToastManager();

// =============================================================================
// Component type helper
// =============================================================================

type Props<K extends keyof typeof dinachiComponentDefinitions> =
  z.infer<(typeof dinachiComponentDefinitions)[K]["props"]>;

interface Ctx<K extends keyof typeof dinachiComponentDefinitions> {
  props: Props<K>;
  children?: ReactNode;
  emit?: (event: string) => void;
  bindings?: Record<string, string>;
  loading?: boolean;
}

// =============================================================================
// Layout Components
// =============================================================================

const gapMap: Record<string, string> = {
  none: "gap-0", xs: "gap-1", sm: "gap-2", md: "gap-4", lg: "gap-6", xl: "gap-8",
};
const paddingMap: Record<string, string> = {
  none: "p-0", xs: "p-1", sm: "p-2", md: "p-4", lg: "p-6", xl: "p-8",
};
const alignMap: Record<string, string> = {
  start: "items-start", center: "items-center", end: "items-end",
  stretch: "items-stretch", baseline: "items-baseline",
};
const justifyMap: Record<string, string> = {
  start: "justify-start", center: "justify-center", end: "justify-end",
  between: "justify-between", around: "justify-around", evenly: "justify-evenly",
};

function BoxComponent({ props, children }: Ctx<"Box">) {
  const classes = [
    "flex",
    props.direction === "row" ? "flex-row" : "flex-col",
    gapMap[props.gap ?? "none"] ?? "",
    alignMap[props.align ?? "stretch"] ?? "",
    justifyMap[props.justify ?? "start"] ?? "",
    props.wrap ? "flex-wrap" : "",
    paddingMap[props.padding ?? "none"] ?? "",
  ].filter(Boolean).join(" ");

  return <div className={classes}>{children}</div>;
}

function TextComponent({ props }: Ctx<"Text">) {
  return <Text variant={props.variant ?? "p"}>{props.content}</Text>;
}

// =============================================================================
// Simple Components
// =============================================================================

function ButtonComponent({ props, emit }: Ctx<"Button">) {
  return (
    <Button
      variant={props.variant ?? "default"}
      size={props.size ?? "default"}
      disabled={props.disabled ?? false}
      onClick={() => emit?.("press")}
    >
      {props.label}
    </Button>
  );
}

function InputComponent({ props, bindings, emit }: Ctx<"Input">) {
  const [value, setValue] = useBoundProp<string>(props.value, bindings?.value);

  const hasValidation = !!(bindings?.value && props.checks?.length);
  const validateOn = props.validateOn ?? "blur";
  const { errors, validate } = useFieldValidation(
    bindings?.value ?? "",
    hasValidation ? { checks: props.checks, validateOn } : undefined,
  );

  return (
    <div className="space-y-2">
      {props.label && (
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {props.label}
        </label>
      )}
      <Input
        id={props.name ?? undefined}
        name={props.name ?? undefined}
        type={props.type ?? "text"}
        placeholder={props.placeholder ?? ""}
        value={value ?? ""}
        disabled={props.disabled ?? false}
        required={props.required ?? false}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setValue(e.target.value);
          if (hasValidation && validateOn === "change") validate();
          emit?.("change");
        }}
        onBlur={() => {
          if (hasValidation && validateOn === "blur") validate();
        }}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter") {
            if (hasValidation && validateOn === "submit") validate();
            emit?.("submit");
          }
        }}
      />
      {errors.length > 0 && (
        <p className="text-sm text-destructive">{errors[0]}</p>
      )}
    </div>
  );
}

function TextareaComponent({ props, bindings, emit }: Ctx<"Textarea">) {
  const [value, setValue] = useBoundProp<string>(props.value, bindings?.value);

  const hasValidation = !!(bindings?.value && props.checks?.length);
  const validateOn = props.validateOn ?? "blur";
  const { errors, validate } = useFieldValidation(
    bindings?.value ?? "",
    hasValidation ? { checks: props.checks, validateOn } : undefined,
  );

  return (
    <div className="space-y-2">
      {props.label && (
        <label className="block text-sm font-medium leading-none">
          {props.label}
        </label>
      )}
      <Textarea
        name={props.name ?? undefined}
        placeholder={props.placeholder ?? ""}
        rows={props.rows ?? 3}
        value={value ?? ""}
        disabled={props.disabled ?? false}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setValue(e.target.value);
          if (hasValidation && validateOn === "change") validate();
          emit?.("change");
        }}
        onBlur={() => {
          if (hasValidation && validateOn === "blur") validate();
        }}
      />
      {errors.length > 0 && (
        <p className="text-sm text-destructive">{errors[0]}</p>
      )}
    </div>
  );
}

function CheckboxComponent({ props, bindings, emit }: Ctx<"Checkbox">) {
  const [checked, setChecked] = useBoundProp<boolean>(props.checked, bindings?.checked);

  const hasValidation = !!(bindings?.checked && props.checks?.length);
  const validateOn = props.validateOn ?? "change";
  const { errors, validate } = useFieldValidation(
    bindings?.checked ?? "",
    hasValidation ? { checks: props.checks, validateOn } : undefined,
  );

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <DinachiCheckbox
          name={props.name ?? undefined}
          checked={checked ?? false}
          disabled={props.disabled ?? false}
          required={props.required ?? false}
          onCheckedChange={(val: boolean) => {
            setChecked(val);
            if (hasValidation && validateOn === "change") validate();
            emit?.("change");
          }}
        />
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {props.label}
        </label>
      </div>
      {errors.length > 0 && (
        <p className="text-sm text-destructive">{errors[0]}</p>
      )}
    </div>
  );
}

function SwitchComponent({ props, bindings, emit }: Ctx<"Switch">) {
  const [checked, setChecked] = useBoundProp<boolean>(props.checked, bindings?.checked);

  return (
    <div className="flex items-center gap-2">
      <DinachiSwitch
        name={props.name ?? undefined}
        checked={checked ?? false}
        disabled={props.disabled ?? false}
        onCheckedChange={(val: boolean) => {
          setChecked(val);
          emit?.("change");
        }}
      >
        <SwitchThumb />
      </DinachiSwitch>
      <label className="text-sm font-medium leading-none">
        {props.label}
      </label>
    </div>
  );
}

function RadioComponent({ props, bindings, emit }: Ctx<"Radio">) {
  const [value, setValue] = useBoundProp<string>(props.value, bindings?.value);
  const options = props.options ?? [];

  const hasValidation = !!(bindings?.value && props.checks?.length);
  const validateOn = props.validateOn ?? "change";
  const { errors, validate } = useFieldValidation(
    bindings?.value ?? "",
    hasValidation ? { checks: props.checks, validateOn } : undefined,
  );

  return (
    <div className="space-y-2">
      {props.label && (
        <label className="block text-sm font-medium leading-none">
          {props.label}
        </label>
      )}
      <RadioGroup
        name={props.name ?? undefined}
        value={value ?? ""}
        onValueChange={(val: unknown) => {
          setValue(String(val));
          if (hasValidation && validateOn === "change") validate();
          emit?.("change");
        }}
      >
        {options.map((opt: { label: string; value: string; disabled?: boolean }) => (
          <div key={opt.value} className="flex items-center gap-2">
            <Radio value={opt.value} disabled={opt.disabled ?? false}>
              <RadioIndicator />
            </Radio>
            <label className="text-sm">{opt.label}</label>
          </div>
        ))}
      </RadioGroup>
      {errors.length > 0 && (
        <p className="text-sm text-destructive">{errors[0]}</p>
      )}
    </div>
  );
}

function SelectComponent({ props, bindings, emit }: Ctx<"Select">) {
  const [value, setValue] = useBoundProp<string>(props.value, bindings?.value);
  const options = props.options ?? [];

  const hasValidation = !!(bindings?.value && props.checks?.length);
  const validateOn = props.validateOn ?? "change";
  const { errors, validate } = useFieldValidation(
    bindings?.value ?? "",
    hasValidation ? { checks: props.checks, validateOn } : undefined,
  );

  return (
    <div className="space-y-2">
      {props.label && (
        <label className="block text-sm font-medium leading-none">
          {props.label}
        </label>
      )}
      <SelectRoot
        value={value ?? ""}
        onValueChange={(val: string | null) => {
          setValue(val ?? "");
          if (hasValidation && validateOn === "change") validate();
          emit?.("change");
        }}
        disabled={props.disabled ?? false}
      >
        <SelectTrigger>
          <SelectValue placeholder={props.placeholder ?? "Select..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt: { label: string; value: string; disabled?: boolean }) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled ?? false}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
      {errors.length > 0 && (
        <p className="text-sm text-destructive">{errors[0]}</p>
      )}
    </div>
  );
}

function SliderComponent({ props, bindings, emit }: Ctx<"Slider">) {
  const [value, setValue] = useBoundProp<number>(props.value, bindings?.value);

  return (
    <div className="space-y-2">
      {props.label && (
        <label className="block text-sm font-medium leading-none">
          {props.label}
        </label>
      )}
      <DinachiSlider
        value={value ?? 0}
        onValueChange={(val: number | readonly number[]) => {
          const numVal = typeof val === "number" ? val : val[0] ?? 0;
          setValue(numVal);
          emit?.("change");
        }}
        min={props.min ?? 0}
        max={props.max ?? 100}
        step={props.step ?? 1}
        disabled={props.disabled ?? false}
      >
        <SliderControl>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb />
        </SliderControl>
      </DinachiSlider>
    </div>
  );
}

function ToggleComponent({ props, bindings, emit }: Ctx<"Toggle">) {
  const [pressed, setPressed] = useBoundProp<boolean>(props.pressed, bindings?.pressed);

  return (
    <Toggle
      variant={props.variant ?? "default"}
      size={props.size ?? "default"}
      pressed={pressed ?? false}
      onPressedChange={(val: boolean) => {
        setPressed(val);
        emit?.("change");
      }}
    >
      {props.label}
    </Toggle>
  );
}

function LabelComponent({ props }: Ctx<"Label">) {
  return (
    <label
      htmlFor={props.htmlFor ?? undefined}
      className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {props.text}
    </label>
  );
}

function BadgeComponent({ props }: Ctx<"Badge">) {
  return (
    <Badge
      variant={props.variant ?? "default"}
      size={props.size ?? "default"}
      rounded={props.rounded ?? "default"}
    >
      {props.text}
    </Badge>
  );
}

function SeparatorComponent({ props }: Ctx<"Separator">) {
  return <Separator orientation={props.orientation ?? "horizontal"} />;
}

function SkeletonComponent({ props }: Ctx<"Skeleton">) {
  return (
    <div
      className="animate-pulse rounded-md bg-muted"
      style={{
        width: props.width ?? undefined,
        height: props.height ?? "1rem",
      }}
    />
  );
}

function ProgressComponent({ props }: Ctx<"Progress">) {
  return (
    <div className="space-y-1">
      {props.label && (
        <div className="flex justify-between text-sm">
          <label className="font-medium leading-none">{props.label}</label>
          <span className="text-muted-foreground">{props.value}%</span>
        </div>
      )}
      <Progress value={props.value}>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}

// =============================================================================
// Compound Components (flattened wrappers)
// =============================================================================

function CardComponent({ props, children }: Ctx<"Card">) {
  return (
    <Card>
      {(props.title || props.description) && (
        <CardHeader>
          {props.title && <CardTitle>{props.title}</CardTitle>}
          {props.description && (
            <CardDescription>{props.description}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function TabsComponent({ props, bindings, children, emit }: Ctx<"Tabs">) {
  const tabs = props.tabs ?? [];
  const [value, setValue] = useBoundProp<string>(props.value, bindings?.value);
  const activeValue = (bindings?.value ? value : null) || props.defaultValue || tabs[0]?.value || "";

  return (
    <TabsRoot
      value={activeValue}
      onValueChange={(val: unknown) => {
        setValue(String(val));
        emit?.("change");
      }}
    >
      <TabsList>
        {tabs.map((tab: { label: string; value: string; disabled?: boolean }) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled ?? false}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={activeValue}>{children}</TabsContent>
    </TabsRoot>
  );
}

function AccordionComponent({ props }: Ctx<"Accordion">) {
  const items = props.items ?? [];

  return (
    <AccordionRoot
      multiple={props.multiple ?? false}
      className="w-full"
    >
      {items.map((item: { title: string; content: string; value: string; disabled?: boolean }, idx: number) => (
        <AccordionItem key={item.value || idx} value={item.value || String(idx)}>
          <AccordionHeader>
            <AccordionTrigger disabled={item.disabled ?? false}>
              {item.title}
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>{item.content}</AccordionPanel>
        </AccordionItem>
      ))}
    </AccordionRoot>
  );
}

function DialogComponent({ props, bindings, children }: Ctx<"Dialog">) {
  const [open, setOpen] = useBoundProp<boolean>(props.open, bindings?.open);

  return (
    <DialogRoot open={open ?? false} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          {props.description && (
            <DialogDescription>{props.description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="py-4">{children}</div>
        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

function AlertDialogComponent({ props, bindings, children, emit }: Ctx<"AlertDialog">) {
  const [open, setOpen] = useBoundProp<boolean>(props.open, bindings?.open);

  return (
    <AlertDialogRoot open={open ?? false} onOpenChange={setOpen}>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto">
          <AlertDialogPopup>
            <AlertDialogHeader>
              <AlertDialogTitle>{props.title}</AlertDialogTitle>
              {props.description && (
                <AlertDialogDescription>
                  {props.description}
                </AlertDialogDescription>
              )}
            </AlertDialogHeader>
            {children}
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setOpen(false);
                  emit?.("cancel");
                }}
              >
                {props.cancelLabel ?? "Cancel"}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setOpen(false);
                  emit?.("confirm");
                }}
              >
                {props.actionLabel ?? "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </div>
      </AlertDialogPortal>
    </AlertDialogRoot>
  );
}

function TooltipComponent({ props }: Ctx<"Tooltip">) {
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger>
          <span className="underline decoration-dotted cursor-help">
            {props.text}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side={props.side ?? "top"}
          align={props.align ?? "center"}
        >
          {props.content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}

// =============================================================================
// Additional Components (Avatar, Drawer, Popover, NumberField, ToggleGroup,
//                        Collapsible, ScrollArea, Fieldset)
// =============================================================================

function AvatarComponent({ props }: Ctx<"Avatar">) {
  return (
    <AvatarRoot size={props.size ?? "md"}>
      {props.src && <AvatarImage src={props.src} alt={props.alt ?? ""} />}
      <AvatarFallback>{props.fallback ?? "?"}</AvatarFallback>
    </AvatarRoot>
  );
}

function DrawerComponent({ props, bindings, children }: Ctx<"Drawer">) {
  const [open, setOpen] = useBoundProp<boolean>(props.open, bindings?.open);

  return (
    <DrawerRoot open={open ?? false} onOpenChange={setOpen}>
      <DrawerContent side={props.side ?? "right"}>
        <DrawerHeader>
          <DrawerTitle>{props.title}</DrawerTitle>
          {props.description && (
            <DrawerDescription>{props.description}</DrawerDescription>
          )}
        </DrawerHeader>
        <div className="py-4">{children}</div>
        <DrawerFooter>
          <DrawerClose>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
}

function PopoverComponent({ props, children }: Ctx<"Popover">) {
  return (
    <PopoverRoot>
      <PopoverTrigger className="cursor-pointer underline decoration-dotted underline-offset-4 text-sm">
        {props.triggerText}
      </PopoverTrigger>
      <PopoverContent
        side={props.side ?? "bottom"}
        align={props.align ?? "center"}
      >
        {children}
      </PopoverContent>
    </PopoverRoot>
  );
}

function NumberFieldComponent({ props, bindings, emit }: Ctx<"NumberField">) {
  const [value, setValue] = useBoundProp<number>(props.value, bindings?.value);

  const hasValidation = !!(bindings?.value && props.checks?.length);
  const validateOn = props.validateOn ?? "change";
  const { errors, validate } = useFieldValidation(
    bindings?.value ?? "",
    hasValidation ? { checks: props.checks, validateOn } : undefined,
  );

  return (
    <div className="space-y-2">
      {props.label && (
        <label className="block text-sm font-medium leading-none">
          {props.label}
        </label>
      )}
      <NumberFieldRoot
        value={value ?? 0}
        onValueChange={(val: number | null) => {
          setValue(val ?? 0);
          if (hasValidation && validateOn === "change") validate();
          emit?.("change");
        }}
        min={props.min}
        max={props.max}
        step={props.step ?? 1}
        disabled={props.disabled ?? false}
      >
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberFieldRoot>
      {errors.length > 0 && (
        <p className="text-sm text-destructive">{errors[0]}</p>
      )}
    </div>
  );
}

function ToggleGroupComponent({ props, bindings, emit }: Ctx<"ToggleGroup">) {
  const [value, setValue] = useBoundProp<string>(props.value, bindings?.value);
  const options = props.options ?? [];

  return (
    <ToggleGroupRoot
      value={value ? [value] : []}
      onValueChange={(newValue: unknown) => {
        const arr = newValue as string[];
        const selected = arr[arr.length - 1] ?? "";
        setValue(selected);
        emit?.("change");
      }}
    >
      {options.map((opt: { label: string; value: string }) => (
        <ToggleGroupItem
          key={opt.value}
          value={opt.value}
          variant={props.variant ?? "outline"}
          size={props.size ?? "default"}
        >
          {opt.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroupRoot>
  );
}

function CollapsibleComponent({ props, children }: Ctx<"Collapsible">) {
  return (
    <CollapsibleRoot defaultOpen={props.defaultOpen ?? false}>
      <CollapsibleTrigger>{props.triggerText}</CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="px-4 pb-4">{children}</div>
      </CollapsiblePanel>
    </CollapsibleRoot>
  );
}

function ScrollAreaContainerComponent({ props, children }: Ctx<"ScrollArea">) {
  return (
    <ScrollAreaComponent
      orientation={props.orientation ?? "vertical"}
      style={{ maxHeight: props.maxHeight ?? undefined }}
    >
      {children}
    </ScrollAreaComponent>
  );
}

function FieldsetComponent({ props, children }: Ctx<"Fieldset">) {
  return (
    <FieldsetRoot disabled={props.disabled ?? false}>
      {props.legend && <FieldsetLegend>{props.legend}</FieldsetLegend>}
      {children}
    </FieldsetRoot>
  );
}

// =============================================================================
// Component Registry Map
// =============================================================================

export const dinachiComponents = {
  Box: BoxComponent,
  Text: TextComponent,
  Button: ButtonComponent,
  Input: InputComponent,
  Textarea: TextareaComponent,
  Checkbox: CheckboxComponent,
  Switch: SwitchComponent,
  Radio: RadioComponent,
  Select: SelectComponent,
  Slider: SliderComponent,
  Toggle: ToggleComponent,
  Label: LabelComponent,
  Badge: BadgeComponent,
  Separator: SeparatorComponent,
  Skeleton: SkeletonComponent,
  Progress: ProgressComponent,
  Card: CardComponent,
  Tabs: TabsComponent,
  Accordion: AccordionComponent,
  Dialog: DialogComponent,
  AlertDialog: AlertDialogComponent,
  Tooltip: TooltipComponent,
  Avatar: AvatarComponent,
  Drawer: DrawerComponent,
  Popover: PopoverComponent,
  NumberField: NumberFieldComponent,
  ToggleGroup: ToggleGroupComponent,
  Collapsible: CollapsibleComponent,
  ScrollArea: ScrollAreaContainerComponent,
  Fieldset: FieldsetComponent,
};

// =============================================================================
// Action Handlers
// =============================================================================

type ToastVariant = "default" | "success" | "error" | "warning";

const toastTypeMap: Record<ToastVariant, string> = {
  default: "default",
  success: "success",
  error: "error",
  warning: "warning",
};

export const dinachiActionHandlers = {
  navigate: async (
    params: { url: string; target?: string } | undefined,
    _setState: SetState,
    _state: StateModel,
  ) => {
    if (!params?.url) return;
    if (params.target === "_blank") {
      window.open(params.url, "_blank");
    } else {
      window.location.href = params.url;
    }
  },

  submit: async (
    params: { formId?: string } | undefined,
    _setState: SetState,
    _state: StateModel,
  ) => {
    if (params?.formId) {
      const form = document.getElementById(params.formId) as HTMLFormElement | null;
      form?.requestSubmit();
    }
  },

  showToast: async (
    params: {
      title: string;
      description?: string;
      variant?: string;
      timeout?: number;
    } | undefined,
    _setState: SetState,
    _state: StateModel,
  ) => {
    if (!params?.title) return;
    toastManager.add({
      title: params.title,
      description: params.description ?? undefined,
      type: toastTypeMap[(params.variant as ToastVariant) ?? "default"] ?? "default",
      timeout: params.timeout ?? 5000,
    });
  },
};
