"use client";

import {
  useStateBinding,
  type SetState,
  type StateModel,
} from "@json-render/react";
import type { ReactNode } from "react";
import type { InferComponentProps } from "@json-render/core";

// DinachiUI component imports
import {
  Button,
  Input,
  Textarea,
  Checkbox as DinachiCheckbox,
  Switch as DinachiSwitch,
  SwitchThumb,
  RadioGroup,
  Radio,
  RadioIndicator,
  Toggle,
  Slider as DinachiSlider,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
  Badge,
  Separator,
  Progress,
  ProgressTrack,
  ProgressIndicator,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Select as SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs as TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion as AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
  Dialog as DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
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
  TooltipProvider,
  Tooltip as TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  createToastManager,
} from "@dinachi/components";

import type { DinachiCatalog } from "./catalog";

// =============================================================================
// Toast Manager (singleton for action-based toast triggering)
// =============================================================================

export const toastManager = createToastManager();

// =============================================================================
// Helper: two-way state binding for input components
// =============================================================================

function useInputBinding(statePath?: string): [string, (v: string) => void] {
  const [bound, setBound] = useStateBinding<string>(statePath ?? "");
  if (statePath) {
    return [bound ?? "", setBound];
  }
  return ["", () => {}];
}

function useBoolBinding(statePath?: string): [boolean, (v: boolean) => void] {
  const [bound, setBound] = useStateBinding<boolean>(statePath ?? "");
  if (statePath) {
    return [bound ?? false, setBound];
  }
  return [false, () => {}];
}

function useNumberBinding(statePath?: string): [number, (v: number) => void] {
  const [bound, setBound] = useStateBinding<number>(statePath ?? "");
  if (statePath) {
    return [bound ?? 0, setBound];
  }
  return [0, () => {}];
}

// =============================================================================
// Component type helpers
// =============================================================================

type DinachiComponentNames =
  | "Button" | "Input" | "Textarea" | "Checkbox" | "Switch"
  | "Radio" | "Select" | "Slider" | "Toggle" | "Label"
  | "Badge" | "Separator" | "Skeleton" | "Progress"
  | "Card" | "Tabs" | "Accordion" | "Dialog" | "AlertDialog" | "Tooltip";

type Props<K extends DinachiComponentNames> = InferComponentProps<DinachiCatalog, K>;

interface Ctx<K extends DinachiComponentNames> {
  props: Props<K>;
  children?: ReactNode;
  emit?: (event: string) => void;
  loading?: boolean;
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

function InputComponent({ props, emit }: Ctx<"Input">) {
  const [value, setValue] = useInputBinding(props.statePath);

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
        value={value}
        disabled={props.disabled ?? false}
        required={props.required ?? false}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setValue(e.target.value);
          emit?.("change");
        }}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter") emit?.("submit");
        }}
      />
    </div>
  );
}

function TextareaComponent({ props, emit }: Ctx<"Textarea">) {
  const [value, setValue] = useInputBinding(props.statePath);

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
        value={value}
        disabled={props.disabled ?? false}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setValue(e.target.value);
          emit?.("change");
        }}
      />
    </div>
  );
}

function CheckboxComponent({ props, emit }: Ctx<"Checkbox">) {
  const [checked, setChecked] = useBoolBinding(props.statePath);

  return (
    <div className="flex items-center gap-2">
      <DinachiCheckbox
        name={props.name ?? undefined}
        checked={checked}
        disabled={props.disabled ?? false}
        required={props.required ?? false}
        onCheckedChange={(val: boolean) => {
          setChecked(val);
          emit?.("change");
        }}
      />
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {props.label}
      </label>
    </div>
  );
}

function SwitchComponent({ props, emit }: Ctx<"Switch">) {
  const [checked, setChecked] = useBoolBinding(props.statePath);

  return (
    <div className="flex items-center gap-2">
      <DinachiSwitch
        name={props.name ?? undefined}
        checked={checked}
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

function RadioComponent({ props, emit }: Ctx<"Radio">) {
  const [value, setValue] = useInputBinding(props.statePath);
  const options = props.options ?? [];

  return (
    <div className="space-y-2">
      {props.label && (
        <label className="block text-sm font-medium leading-none">
          {props.label}
        </label>
      )}
      <RadioGroup
        name={props.name ?? undefined}
        value={value}
        onValueChange={(val: unknown) => {
          setValue(String(val));
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
    </div>
  );
}

function SelectComponent({ props, emit }: Ctx<"Select">) {
  const [value, setValue] = useInputBinding(props.statePath);
  const options = props.options ?? [];

  return (
    <div className="space-y-2">
      {props.label && (
        <label className="block text-sm font-medium leading-none">
          {props.label}
        </label>
      )}
      <SelectRoot
        value={value}
        onValueChange={(val: string | null) => {
          setValue(val ?? "");
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
    </div>
  );
}

function SliderComponent({ props, emit }: Ctx<"Slider">) {
  const [value, setValue] = useNumberBinding(props.statePath);

  return (
    <div className="space-y-2">
      {props.label && (
        <label className="block text-sm font-medium leading-none">
          {props.label}
        </label>
      )}
      <DinachiSlider
        value={value}
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

function ToggleComponent({ props, emit }: Ctx<"Toggle">) {
  const [pressed, setPressed] = useBoolBinding(props.statePath);

  return (
    <Toggle
      variant={props.variant ?? "default"}
      size={props.size ?? "default"}
      pressed={pressed}
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

function TabsComponent({ props, children, emit }: Ctx<"Tabs">) {
  const tabs = props.tabs ?? [];
  const [value, setValue] = useInputBinding(props.statePath);
  const activeValue = value || props.defaultValue || tabs[0]?.value || "";

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
      {items.map((item: { title: string; content: string; value: string; disabled?: boolean }) => (
        <AccordionItem key={item.value} value={item.value}>
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

function DialogComponent({ props, children }: Ctx<"Dialog">) {
  const [open, setOpen] = useStateBinding<boolean>(props.statePath);

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

function AlertDialogComponent({ props, children, emit }: Ctx<"AlertDialog">) {
  const [open, setOpen] = useStateBinding<boolean>(props.statePath);

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
// Component Registry Map
// =============================================================================

export const dinachiComponents = {
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
