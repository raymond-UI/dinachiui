# Avatar

An image element with a fallback for representing a user.

## Usage

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@dinachi/components/avatar";

export function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/dinachi.png" alt="@dinachi" />
      <AvatarFallback>DN</AvatarFallback>
    </Avatar>
  );
}
```

## Props

### Avatar

Extends `React.ComponentPropsWithoutRef<typeof BaseAvatar.Root>` from Base UI.

### AvatarImage

Extends `React.ComponentPropsWithoutRef<typeof BaseAvatar.Image>` from Base UI.

### AvatarFallback

Extends `React.ComponentPropsWithoutRef<typeof BaseAvatar.Fallback>` from Base UI.
