"use client"

import { Link } from "@/components/ui/link";

export function DefaultLinkExample() {
  return <Link href="#">DinachiUI Documentation</Link>;
}

export function LinkVariantsExample() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="#" variant="default">
        Default link with underline
      </Link>
      <Link href="#" variant="muted">
        Muted link for secondary actions
      </Link>
      <Link href="#" variant="plain">
        Plain link without underline
      </Link>
      <Link href="#" variant="unstyled">
        Unstyled link for custom styling
      </Link>
    </div>
  );
}

export function LinkExternalExample() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="https://github.com" external>
        GitHub
      </Link>
      <Link href="https://react.dev" external variant="muted">
        React Documentation
      </Link>
    </div>
  );
}

export function LinkRenderExample() {
  return (
    <div className="flex flex-col gap-4">
      <Link render={<button type="button" />}>Renders as a button</Link>
      <p className="text-sm text-muted-foreground">
        Use the render prop to compose with framework routers like Next.js Link
        or React Router Link.
      </p>
    </div>
  );
}

export function LinkRenderFunctionExample() {
  return (
    <div className="flex flex-col gap-4">
      <Link
        render={(props) => <button type="button" {...props} />}
        variant="muted"
      >
        Render function
      </Link>
      <p className="text-sm text-muted-foreground">
        The function form receives merged props (className, ref, etc.) and gives
        you full control over how they are applied.
      </p>
    </div>
  );
}
