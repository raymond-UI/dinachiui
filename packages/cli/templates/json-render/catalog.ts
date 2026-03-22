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
      "Flex layout container. Default direction=column. Use direction=row for horizontal groups (metrics, button rows, avatar+text). Gap: xs=tight pairs, sm=related items, md=standard, lg=sections.",
    example: { direction: "row", gap: "md", align: "center" },
  },

  Text: {
    props: z.object({
      content: z.string(),
      variant: z.enum(["h1", "h2", "h3", "h4", "p", "span", "muted", "lead"]).optional(),
    }),
    description:
      "Text display. h2=page title (one per page), h3=section/card title, h4=sub-section, p=body (default), lead=intro paragraph after heading, muted=helper/secondary/timestamps, span=inline.",
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
      "Clickable button. default=primary CTA (one per section), outline/secondary=secondary action, ghost=tertiary/cancel, destructive=dangerous (pair with confirmation), link=navigation only. Emits 'press'.",
    example: { label: "Submit", variant: "default" },
  },

  Input: {
    props: z.object({
      label: z.string().optional(),
      name: z.string().optional(),
      type: z.enum(["text", "email", "password", "number", "tel", "url"]).optional(),
      placeholder: z.string().optional(),
      value: z.string().optional(),
      disabled: z.boolean().optional(),
      required: z.boolean().optional(),
      ...validationSchema,
    }),
    description:
      "Text input. Always set label — never rely on placeholder alone. Match type to content: email, tel, number, url, password. Bind value with $bindState for two-way binding. Supports validation via checks array.",
    example: { label: "Email", type: "email", placeholder: "you@example.com", value: { $bindState: "/form/email" } },
  },

  Textarea: {
    props: z.object({
      label: z.string().optional(),
      name: z.string().optional(),
      placeholder: z.string().optional(),
      rows: z.number().optional(),
      value: z.string().optional(),
      disabled: z.boolean().optional(),
      ...validationSchema,
    }),
    description:
      "Multi-line text input. Use for comments, messages, descriptions, or any long-form text. Always set label. Bind value with $bindState for two-way binding. Supports validation via checks array.",
    example: { label: "Message", placeholder: "Type your message..." },
  },

  Checkbox: {
    props: z.object({
      label: z.string(),
      name: z.string().optional(),
      checked: z.boolean().optional(),
      disabled: z.boolean().optional(),
      required: z.boolean().optional(),
      ...validationSchema,
    }),
    description:
      "Checkbox for boolean choices: agreements, opt-ins, multi-select options. Use Switch instead for on/off settings. Bind checked with $bindState. Supports validation.",
  },

  Switch: {
    props: z.object({
      label: z.string(),
      name: z.string().optional(),
      checked: z.boolean().optional(),
      disabled: z.boolean().optional(),
    }),
    description:
      "Toggle switch for on/off settings (notifications, features, preferences). Use Checkbox instead for agreements or multi-select. Bind checked with $bindState.",
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
      value: z.string().optional(),
      ...validationSchema,
    }),
    description:
      "Radio group for single selection from 2-5 visible options. Use Select for 6+ options. Use ToggleGroup for compact visual selection. Bind value with $bindState. Supports validation.",
    example: {
      label: "Size",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
      value: { $bindState: "/form/size" },
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
      value: z.string().optional(),
      ...validationSchema,
    }),
    description:
      "Dropdown select for single selection from many options (6+). Use Radio for 2-5 visible options. Always set label and a descriptive placeholder. Bind value with $bindState. Supports validation.",
    example: {
      label: "Country",
      placeholder: "Select country",
      options: [
        { label: "United States", value: "us" },
        { label: "Canada", value: "ca" },
      ],
      value: { $bindState: "/form/country" },
    },
  },

  Slider: {
    props: z.object({
      label: z.string().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      step: z.number().optional(),
      value: z.number().optional(),
      disabled: z.boolean().optional(),
    }),
    description:
      "Range slider for numeric selection within a range (ratings, volume, budget). Use NumberField for precise numeric input. Always set label, min, max. Bind value with $bindState.",
    example: { label: "Volume", min: 0, max: 100, step: 1 },
  },

  Toggle: {
    props: z.object({
      label: z.string(),
      variant: z.enum(["default", "outline"]).optional(),
      size: z.enum(["default", "sm", "lg"]).optional(),
      pressed: z.boolean().optional(),
    }),
    description:
      "Pressable toggle button for binary on/off states (bold, italic, favorite). Use Switch for settings, Checkbox for form agreements. Bind pressed with $bindState.",
  },

  Label: {
    props: z.object({
      text: z.string(),
      htmlFor: z.string().optional(),
    }),
    description: "Standalone form label. Most form components (Input, Select, Checkbox, etc.) have a built-in label prop — use that instead. Only use Label for custom field layouts.",
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
    description:
      "Status indicator. success=active/approved/complete, warning=pending/caution, destructive=error/blocked, info=neutral update, secondary=metadata/low-emphasis, outline=counts/tags. Keep text short (1-2 words).",
    example: { text: "Active", variant: "success" },
  },

  Separator: {
    props: z.object({
      orientation: z.enum(["horizontal", "vertical"]).optional(),
    }),
    description: "Visual divider between major content blocks. Use sparingly — prefer gap spacing over separators. Best between sections with different content types (e.g., header vs body, totals vs line items).",
  },

  Skeleton: {
    props: z.object({
      width: z.string().optional(),
      height: z.string().optional(),
    }),
    description: "Loading placeholder that mimics content shape. Set width/height to match the content it replaces (e.g. '200px', '1rem'). Use multiple Skeletons to represent a loading card or list.",
    example: { width: "200px", height: "20px" },
  },

  Progress: {
    props: z.object({
      value: z.number(),
      label: z.string().optional(),
    }),
    description: "Progress bar for completion tracking (uploads, onboarding, goals). Value 0-100. Always set label for context. Pair with a Text(variant='muted') showing the percentage.",
    example: { value: 65, label: "Upload progress" },
  },

  Card: {
    props: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }),
    slots: ["default"],
    description:
      "Content group with visual boundary. Always set title for context. Use description for subtitle/context. Ideal for: metrics, form sections, profile blocks, list items, feature highlights.",
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
      value: z.string().optional(),
    }),
    slots: ["default"],
    description:
      "Tab navigation for mutually exclusive views (e.g., Profile/Security/Billing). Use for 2-6 sections. Always set defaultValue. Bind value with $bindState to track active tab.",
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
      "Collapsible sections for FAQ, details, or grouped info. Always set collapsible=true. Use multiple=true when sections are independent. Items as [{title, content, value}].",
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
      open: z.boolean().optional(),
    }),
    slots: ["default"],
    description:
      "Centered modal for focused tasks or critical decisions. Use for confirmations, short forms, important messages. Prefer Drawer for longer content or side panels. Bind open with $bindState.",
  },

  AlertDialog: {
    props: z.object({
      title: z.string(),
      description: z.string().optional(),
      open: z.boolean().optional(),
      actionLabel: z.string().optional(),
      cancelLabel: z.string().optional(),
    }),
    slots: ["default"],
    description:
      "Confirmation dialog for destructive or irreversible actions (delete, discard, cancel subscription). Always pair with destructive Button triggers. Set clear actionLabel (e.g., 'Delete') and cancelLabel. Bind open with $bindState.",
  },

  Tooltip: {
    props: z.object({
      content: z.string(),
      text: z.string(),
      side: z.enum(["top", "right", "bottom", "left"]).optional(),
      align: z.enum(["start", "center", "end"]).optional(),
    }),
    description: "Hover tooltip for supplementary help text or definitions. Keep content brief (one sentence). Use for non-essential info that doesn't need to be always visible.",
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
      "User avatar. Always set fallback initials (2 chars). Pair with Text in Box(direction='row', align='center', gap='sm') for user references. sm=inline/lists, md=cards, lg=profiles.",
    example: { src: "https://example.com/avatar.jpg", fallback: "JD", size: "md" },
  },

  Drawer: {
    props: z.object({
      title: z.string(),
      description: z.string().optional(),
      side: z.enum(["top", "right", "bottom", "left"]).optional(),
      open: z.boolean().optional(),
    }),
    slots: ["default"],
    description:
      "Slide-in side panel for filters, detailed forms, settings, or secondary content. Use instead of Dialog for longer content. Default side=right. Bind open with $bindState.",
  },

  Popover: {
    props: z.object({
      triggerText: z.string(),
      side: z.enum(["top", "right", "bottom", "left"]).optional(),
      align: z.enum(["start", "center", "end"]).optional(),
    }),
    slots: ["default"],
    description:
      "Click-triggered floating panel for contextual info, quick actions, or mini-forms. Use for content that's too complex for a Tooltip but doesn't need a full Dialog.",
    example: { triggerText: "More info", side: "bottom" },
  },

  NumberField: {
    props: z.object({
      label: z.string().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      step: z.number().optional(),
      value: z.number().optional(),
      disabled: z.boolean().optional(),
      ...validationSchema,
    }),
    description:
      "Numeric input with +/- buttons for precise values (quantity, guests, items). Use Slider instead for approximate ranges. Always set label, min, max. Bind value with $bindState. Supports validation.",
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
      value: z.string().optional(),
    }),
    description:
      "Compact visual selector for 2-4 options (view modes, themes, sizes). Use Radio for more options or when labels are long. Bind value with $bindState.",
    example: {
      options: [
        { label: "Grid", value: "grid" },
        { label: "List", value: "list" },
        { label: "Board", value: "board" },
      ],
      value: { $bindState: "/view/mode" },
    },
  },

  Collapsible: {
    props: z.object({
      triggerText: z.string(),
      defaultOpen: z.boolean().optional(),
    }),
    slots: ["default"],
    description:
      "Single expandable section for show/hide content (details, advanced options). Use Accordion for multiple collapsible items. Set triggerText to describe hidden content.",
    example: { triggerText: "Show details", defaultOpen: false },
  },

  ScrollArea: {
    props: z.object({
      maxHeight: z.string().optional(),
      orientation: z.enum(["vertical", "horizontal", "both"]).optional(),
    }),
    slots: ["default"],
    description:
      "Scrollable container for long lists or content. Use when list exceeds 5 items or content is taller than the viewport. Always set maxHeight (e.g. '300px', '400px').",
    example: { maxHeight: "300px", orientation: "vertical" },
  },

  Fieldset: {
    props: z.object({
      legend: z.string().optional(),
      disabled: z.boolean().optional(),
    }),
    slots: ["default"],
    description:
      "Form field group. Always set legend to describe the group (e.g., 'Personal Information', 'Notification Settings'). Use to semantically group related inputs within a form.",
    example: { legend: "Personal Information" },
  },
};

const dinachiActionDefinitions = {
  navigate: {
    params: z.object({
      url: z.string(),
      target: z.enum(["_self", "_blank"]).optional(),
    }),
    description: "Navigate to a URL. Use target='_blank' for external links. Bind to Button(variant='link') or link-style elements.",
  },

  submit: {
    params: z.object({
      formId: z.string().optional(),
    }),
    description: "Submit a form. Bind to the primary submit Button at the end of a form. Optionally specify formId.",
  },

  showToast: {
    params: z.object({
      title: z.string(),
      description: z.string().optional(),
      variant: z.enum(["default", "success", "error", "warning"]).optional(),
      timeout: z.number().optional(),
    }),
    description: "Show a toast notification. Use success for completions, error for failures, warning for cautions. Keep title short (3-5 words), add description for details.",
  },
};

// =============================================================================
// Exports — raw definitions only, no framework dependency
// =============================================================================

export type DinachiComponentName = keyof typeof dinachiComponentDefinitions;
export type DinachiActionName = keyof typeof dinachiActionDefinitions;

export { dinachiComponentDefinitions, dinachiActionDefinitions };
