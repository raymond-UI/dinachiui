import { z } from "zod";

// =============================================================================
// Shared validation schema for form components
// =============================================================================

const validationSchema = {
  checks: z.array(z.object({
    type: z.string(),
    message: z.string(),
    args: z.record(z.string(), z.unknown()).optional(),
  })).optional(),
  validateOn: z.enum(["change", "blur", "submit"]).optional(),
};

// =============================================================================
// Component + Action Definitions
// =============================================================================

const dinachiComponentDefinitions = {
  Box: {
    props: z.object({
      direction: z.enum(["row", "column"]).optional(),
      gap: z.enum(["none", "xs", "sm", "md", "lg", "xl"]).optional(),
      align: z.enum(["start", "center", "end", "stretch", "baseline"]).optional(),
      justify: z.enum(["start", "center", "end", "between", "around", "evenly"]).optional(),
      wrap: z.boolean().optional(),
      padding: z.enum(["none", "xs", "sm", "md", "lg", "xl"]).optional(),
    }),
    slots: ["default"],
    description:
      "Flex layout container. Use for grouping and arranging child elements. Default direction is column.",
    example: { direction: "row", gap: "md", align: "center" },
  },

  Text: {
    props: z.object({
      content: z.string(),
      variant: z.enum(["h1", "h2", "h3", "h4", "p", "span", "muted", "lead"]).optional(),
    }),
    description:
      "Text display component. Use for headings, paragraphs, and inline text. Variant controls size and style.",
    example: { content: "Hello World", variant: "h2" },
  },

  Button: {
    props: z.object({
      label: z.string(),
      variant: z
        .enum(["default", "destructive", "outline", "secondary", "ghost", "link"])
        .optional(),
      size: z.enum(["default", "sm", "lg", "icon"]).optional(),
      disabled: z.boolean().optional(),
    }),
    description:
      "Clickable button. Emits 'press' event on click. Bind on.press to an action.",
    example: { label: "Submit", variant: "default" },
  },

  Input: {
    props: z.object({
      label: z.string().optional(),
      name: z.string().optional(),
      type: z.enum(["text", "email", "password", "number", "tel", "url"]).optional(),
      placeholder: z.string().optional(),
      statePath: z.string().optional(),
      disabled: z.boolean().optional(),
      required: z.boolean().optional(),
      ...validationSchema,
    }),
    description:
      "Text input field. Set statePath for two-way state binding. Supports validation via checks array. Emits 'change' on input, 'submit' on Enter.",
    example: { label: "Email", type: "email", placeholder: "you@example.com", statePath: "/form/email" },
  },

  Textarea: {
    props: z.object({
      label: z.string().optional(),
      name: z.string().optional(),
      placeholder: z.string().optional(),
      rows: z.number().optional(),
      statePath: z.string().optional(),
      disabled: z.boolean().optional(),
      ...validationSchema,
    }),
    description:
      "Multi-line text input. Set statePath for two-way state binding. Supports validation via checks array. Emits 'change' on input.",
    example: { label: "Message", placeholder: "Type your message..." },
  },

  Checkbox: {
    props: z.object({
      label: z.string(),
      name: z.string().optional(),
      statePath: z.string().optional(),
      disabled: z.boolean().optional(),
      required: z.boolean().optional(),
      ...validationSchema,
    }),
    description:
      "Checkbox input with label. Set statePath to bind checked state. Supports validation via checks array. Emits 'change' on toggle.",
  },

  Switch: {
    props: z.object({
      label: z.string(),
      name: z.string().optional(),
      statePath: z.string().optional(),
      disabled: z.boolean().optional(),
    }),
    description:
      "Toggle switch with label. Set statePath to bind checked state. Emits 'change' on toggle.",
  },

  Radio: {
    props: z.object({
      label: z.string().optional(),
      name: z.string().optional(),
      options: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
          disabled: z.boolean().optional(),
        })
      ),
      statePath: z.string().optional(),
      ...validationSchema,
    }),
    description:
      "Radio button group. Options as [{label, value}]. Set statePath to bind selected value. Supports validation via checks array. Emits 'change' on selection.",
    example: {
      label: "Size",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
      statePath: "/form/size",
    },
  },

  Select: {
    props: z.object({
      label: z.string().optional(),
      name: z.string().optional(),
      placeholder: z.string().optional(),
      disabled: z.boolean().optional(),
      options: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
          disabled: z.boolean().optional(),
        })
      ),
      statePath: z.string().optional(),
      ...validationSchema,
    }),
    description:
      "Dropdown select. Options as [{label, value}]. Set statePath to bind selected value. Supports validation via checks array. Emits 'change' on selection.",
    example: {
      label: "Country",
      placeholder: "Select country",
      options: [
        { label: "United States", value: "us" },
        { label: "Canada", value: "ca" },
      ],
      statePath: "/form/country",
    },
  },

  Slider: {
    props: z.object({
      label: z.string().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      step: z.number().optional(),
      statePath: z.string().optional(),
      disabled: z.boolean().optional(),
    }),
    description:
      "Range slider. Set statePath to bind numeric value. Emits 'change' on drag.",
    example: { label: "Volume", min: 0, max: 100, step: 1 },
  },

  Toggle: {
    props: z.object({
      label: z.string(),
      variant: z.enum(["default", "outline"]).optional(),
      size: z.enum(["default", "sm", "lg"]).optional(),
      statePath: z.string().optional(),
    }),
    description:
      "Toggle button. Set statePath to bind pressed state. Emits 'change' on press.",
  },

  Label: {
    props: z.object({
      text: z.string(),
      htmlFor: z.string().optional(),
    }),
    description: "Form field label text.",
    example: { text: "Email address" },
  },

  Badge: {
    props: z.object({
      text: z.string(),
      variant: z
        .enum(["default", "secondary", "destructive", "outline", "success", "warning", "info"])
        .optional(),
      size: z.enum(["sm", "default", "lg"]).optional(),
      rounded: z.enum(["default", "sm", "md", "lg", "none"]).optional(),
    }),
    description: "Status badge with multiple color variants.",
    example: { text: "Active", variant: "success" },
  },

  Separator: {
    props: z.object({
      orientation: z.enum(["horizontal", "vertical"]).optional(),
    }),
    description: "Visual separator line between content sections.",
  },

  Skeleton: {
    props: z.object({
      width: z.string().optional(),
      height: z.string().optional(),
    }),
    description: "Loading placeholder. Set width/height (e.g. '200px', '1rem').",
    example: { width: "200px", height: "20px" },
  },

  Progress: {
    props: z.object({
      value: z.number(),
      label: z.string().optional(),
    }),
    description: "Progress bar. Value from 0 to 100.",
    example: { value: 65, label: "Upload progress" },
  },

  Card: {
    props: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }),
    slots: ["default"],
    description:
      "Container card with optional title and description. Children render as card body content.",
    example: { title: "Overview", description: "Your account summary" },
  },

  Tabs: {
    props: z.object({
      tabs: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
          disabled: z.boolean().optional(),
        })
      ),
      defaultValue: z.string().optional(),
      statePath: z.string().optional(),
    }),
    slots: ["default"],
    description:
      "Tab navigation. Tabs as [{label, value}]. Children render inside active tab panel. Set statePath to bind active tab. Emits 'change' on tab switch.",
    example: {
      tabs: [
        { label: "Overview", value: "overview" },
        { label: "Settings", value: "settings" },
      ],
      defaultValue: "overview",
    },
  },

  Accordion: {
    props: z.object({
      items: z.array(
        z.object({
          title: z.string(),
          content: z.string(),
          value: z.string(),
          disabled: z.boolean().optional(),
        })
      ),
      multiple: z.boolean().optional(),
      collapsible: z.boolean().optional(),
    }),
    description:
      "Collapsible sections. Items as [{title, content, value}]. Set multiple=true to allow expanding multiple items.",
    example: {
      items: [
        { title: "What is Dinachi?", content: "An accessible UI library.", value: "q1" },
        { title: "How to install?", content: "Run dinachi init.", value: "q2" },
      ],
      collapsible: true,
    },
  },

  Dialog: {
    props: z.object({
      title: z.string(),
      description: z.string().optional(),
      statePath: z.string(),
    }),
    slots: ["default"],
    description:
      "Modal dialog. Set statePath to a boolean state path to control open/close. Use setState action to toggle. Children render as dialog body.",
  },

  AlertDialog: {
    props: z.object({
      title: z.string(),
      description: z.string().optional(),
      statePath: z.string(),
      actionLabel: z.string().optional(),
      cancelLabel: z.string().optional(),
    }),
    slots: ["default"],
    description:
      "Confirmation dialog with action/cancel buttons. Set statePath to a boolean state path. Emits 'confirm' and 'cancel' events.",
  },

  Tooltip: {
    props: z.object({
      content: z.string(),
      text: z.string(),
      side: z.enum(["top", "right", "bottom", "left"]).optional(),
      align: z.enum(["start", "center", "end"]).optional(),
    }),
    description: "Hover tooltip. Shows 'content' text when hovering over 'text' trigger.",
    example: { content: "More information", text: "Hover me", side: "top" },
  },

  Avatar: {
    props: z.object({
      src: z.string().optional(),
      fallback: z.string().optional(),
      alt: z.string().optional(),
      size: z.enum(["sm", "md", "lg"]).optional(),
    }),
    description:
      "User avatar with image and text fallback. Shows fallback initials when image fails or is missing.",
    example: { src: "https://example.com/avatar.jpg", fallback: "JD", size: "md" },
  },

  Drawer: {
    props: z.object({
      title: z.string(),
      description: z.string().optional(),
      side: z.enum(["top", "right", "bottom", "left"]).optional(),
      statePath: z.string(),
    }),
    slots: ["default"],
    description:
      "Slide-in panel from screen edge. Like Dialog but anchored to a side. Set statePath to a boolean state path to control open/close. Children render as drawer body.",
  },

  Popover: {
    props: z.object({
      triggerText: z.string(),
      side: z.enum(["top", "right", "bottom", "left"]).optional(),
      align: z.enum(["start", "center", "end"]).optional(),
    }),
    slots: ["default"],
    description:
      "Click-triggered floating panel. Shows children in a positioned popup next to the trigger text. No statePath needed — toggles on click.",
    example: { triggerText: "More info", side: "bottom" },
  },

  NumberField: {
    props: z.object({
      label: z.string().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      step: z.number().optional(),
      statePath: z.string().optional(),
      disabled: z.boolean().optional(),
      ...validationSchema,
    }),
    description:
      "Numeric input with increment/decrement buttons. Set statePath to bind numeric value. Supports validation via checks array. Emits 'change' on value change.",
    example: { label: "Quantity", min: 0, max: 100, step: 1 },
  },

  ToggleGroup: {
    props: z.object({
      options: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      ),
      variant: z.enum(["default", "outline"]).optional(),
      size: z.enum(["default", "sm", "lg"]).optional(),
      statePath: z.string().optional(),
    }),
    description:
      "Group of toggle buttons where one can be selected. Like radio buttons but as toggle buttons. Set statePath to bind selected value. Emits 'change' on selection.",
    example: {
      options: [
        { label: "Grid", value: "grid" },
        { label: "List", value: "list" },
        { label: "Board", value: "board" },
      ],
      statePath: "/view/mode",
    },
  },

  Collapsible: {
    props: z.object({
      triggerText: z.string(),
      defaultOpen: z.boolean().optional(),
    }),
    slots: ["default"],
    description:
      "Expandable section with a trigger button. Children render in the collapsible panel. Click trigger to show/hide content.",
    example: { triggerText: "Show details", defaultOpen: false },
  },

  ScrollArea: {
    props: z.object({
      maxHeight: z.string().optional(),
      orientation: z.enum(["vertical", "horizontal", "both"]).optional(),
    }),
    slots: ["default"],
    description:
      "Scrollable container with styled scrollbars. Wrap long content to make it scrollable. Set maxHeight (e.g. '300px') to constrain height.",
    example: { maxHeight: "300px", orientation: "vertical" },
  },

  Fieldset: {
    props: z.object({
      legend: z.string().optional(),
      disabled: z.boolean().optional(),
    }),
    slots: ["default"],
    description:
      "Form field group with optional legend. Groups related form inputs semantically. Children render inside the fieldset.",
    example: { legend: "Personal Information" },
  },
};

const dinachiActionDefinitions = {
  navigate: {
    params: z.object({
      url: z.string(),
      target: z.enum(["_self", "_blank"]).optional(),
    }),
    description: "Navigate to a URL. Set target='_blank' for new tab.",
  },

  submit: {
    params: z.object({
      formId: z.string().optional(),
    }),
    description: "Submit a form. Optionally specify formId.",
  },

  showToast: {
    params: z.object({
      title: z.string(),
      description: z.string().optional(),
      variant: z.enum(["default", "success", "error", "warning"]).optional(),
      timeout: z.number().optional(),
    }),
    description: "Show a toast notification.",
  },
};

// =============================================================================
// Exports — raw definitions only, no framework dependency
// =============================================================================

export type DinachiComponentName = keyof typeof dinachiComponentDefinitions;
export type DinachiActionName = keyof typeof dinachiActionDefinitions;

export { dinachiComponentDefinitions, dinachiActionDefinitions };
