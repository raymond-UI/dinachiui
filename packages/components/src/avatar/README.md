# Avatar

An image element with a fallback for representing a user.

## Installation

```bash
npx @dinachi/cli@latest add avatar
```

## Usage

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
```

```tsx
<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

## API Reference

**Avatar**

Root container. Extends `Avatar.Root` from Base UI.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Controls the avatar dimensions (sm: 32px, md: 40px, lg: 48px). |

- **AvatarImage** -- The user's profile image. Extends `Avatar.Image` from Base UI. Accepts standard `img` props like `src` and `alt`.
- **AvatarFallback** -- Displayed when the image fails to load or is not provided. Extends `Avatar.Fallback` from Base UI. Typically contains initials or an icon.
