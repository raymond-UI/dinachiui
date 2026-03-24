import { render, screen } from "@testing-library/react"
import { createRef } from "react"
import { Link } from "./link"

describe("Link", () => {
  it("renders as an anchor element", () => {
    render(<Link href="/about">About</Link>)
    const link = screen.getByRole("link", { name: "About" })
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe("A")
    expect(link).toHaveAttribute("href", "/about")
  })

  it("applies default variant classes", () => {
    render(<Link href="/">Home</Link>)
    const link = screen.getByRole("link")
    expect(link).toHaveClass("text-primary")
    expect(link).toHaveClass("underline")
  })

  it("applies muted variant classes", () => {
    render(
      <Link href="/" variant="muted">
        Muted
      </Link>
    )
    const link = screen.getByRole("link")
    expect(link).toHaveClass("text-muted-foreground")
  })

  it("applies plain variant classes", () => {
    render(
      <Link href="/" variant="plain">
        Plain
      </Link>
    )
    const link = screen.getByRole("link")
    expect(link).toHaveClass("text-foreground")
  })

  it("applies unstyled variant with no extra classes", () => {
    render(
      <Link href="/" variant="unstyled">
        Unstyled
      </Link>
    )
    const link = screen.getByRole("link")
    expect(link).not.toHaveClass("text-primary")
    expect(link).not.toHaveClass("underline")
  })

  it("forwards ref correctly", () => {
    const ref = createRef<HTMLAnchorElement>()
    render(
      <Link ref={ref} href="/">
        Link
      </Link>
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it("accepts custom className", () => {
    render(
      <Link href="/" className="custom-class">
        Link
      </Link>
    )
    const link = screen.getByRole("link")
    expect(link).toHaveClass("custom-class")
  })

  it("adds external attributes when external is true", () => {
    render(
      <Link href="https://example.com" external>
        External
      </Link>
    )
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("renders external icon when external is true", () => {
    render(
      <Link href="https://example.com" external>
        External
      </Link>
    )
    const link = screen.getByRole("link")
    const svg = link.querySelector("svg")
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute("aria-hidden", "true")
  })

  it("does not render external icon when external is false", () => {
    render(<Link href="/about">Internal</Link>)
    const link = screen.getByRole("link")
    const svg = link.querySelector("svg")
    expect(svg).not.toBeInTheDocument()
  })

  it("allows overriding target and rel when external", () => {
    render(
      <Link href="https://example.com" external target="_self" rel="noopener">
        Override
      </Link>
    )
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("target", "_self")
    expect(link).toHaveAttribute("rel", "noopener")
  })

  it("renders as a different element via render prop", () => {
    render(
      <Link render={<span data-testid="custom" />} href="/about">
        Custom
      </Link>
    )
    const element = screen.getByTestId("custom")
    expect(element.tagName).toBe("SPAN")
    expect(element).toHaveTextContent("Custom")
  })

  it("passes className and props to render element", () => {
    render(
      <Link render={<span />} variant="muted">
        Render
      </Link>
    )
    const element = screen.getByText("Render")
    expect(element).toHaveClass("text-muted-foreground")
  })

  it("forwards ref to render element", () => {
    const ref = createRef<HTMLAnchorElement>()
    render(
      <Link ref={ref} render={<button type="button" />}>
        Button Link
      </Link>
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("renders external icon and attributes with render prop", () => {
    render(
      <Link
        render={<span data-testid="custom" />}
        href="https://example.com"
        external
      >
        External
      </Link>
    )
    const element = screen.getByTestId("custom")
    expect(element.querySelector("svg")).toBeInTheDocument()
    expect(element).toHaveAttribute("target", "_blank")
    expect(element).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("merges className from render element and variant", () => {
    render(
      <Link render={<span className="custom-render" />} variant="muted">
        Merge
      </Link>
    )
    const element = screen.getByText("Merge")
    expect(element).toHaveClass("text-muted-foreground")
    expect(element).toHaveClass("custom-render")
  })

  it("does not set target or rel when not external", () => {
    render(<Link href="/about">About</Link>)
    const link = screen.getByRole("link")
    expect(link).not.toHaveAttribute("target")
    expect(link).not.toHaveAttribute("rel")
  })

  it("includes screen reader text for external links", () => {
    render(
      <Link href="https://example.com" external>
        External
      </Link>
    )
    expect(screen.getByText("(opens in a new tab)")).toBeInTheDocument()
  })

  it("applies inline-flex only when external", () => {
    const { rerender } = render(<Link href="/">Internal</Link>)
    expect(screen.getByRole("link")).not.toHaveClass("inline-flex")

    rerender(
      <Link href="https://example.com" external>
        External
      </Link>
    )
    expect(screen.getByRole("link")).toHaveClass("inline-flex")
  })

  it("spreads additional HTML attributes", () => {
    render(
      <Link href="/" data-testid="custom" id="my-link">
        Link
      </Link>
    )
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("data-testid", "custom")
    expect(link).toHaveAttribute("id", "my-link")
  })
})
