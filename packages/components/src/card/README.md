# Card

A container for grouping related content with header, body, and footer sections.

## Installation

```bash
npx @dinachi/cli@latest add card
```

## Usage

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
```

```tsx
<Card>
  <CardHeader>
    <CardTitle>Notifications</CardTitle>
    <CardDescription>You have 3 unread messages.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Your content goes here.</p>
  </CardContent>
  <CardFooter>
    <p>Card footer</p>
  </CardFooter>
</Card>
```

## API Reference

- **Card** -- Root container with rounded border, background, and shadow styling. Renders a `div`.
- **CardHeader** -- Top section with flex column layout and padding. Renders a `div`.
- **CardTitle** -- Heading inside the header. Renders an `h3`.
- **CardDescription** -- Muted description text inside the header. Renders a `p`.
- **CardContent** -- Main content area with padding. Renders a `div`.
- **CardFooter** -- Bottom section with flex row layout and padding. Renders a `div`.
