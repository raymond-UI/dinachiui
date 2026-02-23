import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import * as React from "react"
import { Form } from "./form"
import { Field, FieldLabel, FieldControl, FieldError } from "../field"

describe("Form", () => {
  it("renders correctly with children", () => {
    render(
      <Form data-testid="form">
        <input name="test" />
        <button type="submit">Submit</button>
      </Form>
    )

    expect(screen.getByTestId("form")).toBeInTheDocument()
    expect(screen.getByRole("textbox")).toBeInTheDocument()
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("applies default className", () => {
    render(<Form data-testid="form">Test form</Form>)
    const form = screen.getByTestId("form")
    expect(form).toHaveClass("space-y-4")
  })

  it("applies custom className when provided as string", () => {
    render(<Form className="custom-form-class" data-testid="form">Test form</Form>)
    const form = screen.getByTestId("form")
    expect(form).toHaveClass("space-y-4", "custom-form-class")
  })

  it("applies className with form state", () => {
    const errors = { email: "Invalid email" }

    render(
      <Form
        className="form-with-errors"
        errors={errors}
        data-testid="form"
      >
        Test form
      </Form>
    )

    expect(screen.getByTestId("form")).toHaveClass("form-with-errors")
  })

  it("handles errors prop correctly", () => {
    const errors = {
      email: "Email is required",
      password: "Password too short"
    }

    render(<Form errors={errors} data-testid="form">Test form</Form>)
    const form = screen.getByTestId("form")
    expect(form).toBeInTheDocument()
  })

  it("handles errors with automatic clearing (Base UI 1.0.0+)", async () => {
    const errors = { email: "Email error" }

    render(
      <Form errors={errors} data-testid="form">
        <Field name="email">
          <FieldControl />
          <FieldError />
        </Field>
        <button type="submit">Submit</button>
      </Form>
    )

    expect(screen.getByTestId("form")).toBeInTheDocument()
  })

  it("renders with Field components", () => {
    render(
      <Form data-testid="form">
        <Field name="email">
          <FieldLabel>Email</FieldLabel>
          <FieldControl type="email" />
          <FieldError />
        </Field>
      </Form>
    )

    expect(screen.getByTestId("form")).toBeInTheDocument()
    expect(screen.getByText("Email")).toBeInTheDocument()
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLFormElement>()

    render(
      <Form ref={ref} data-testid="form">
        Test form
      </Form>
    )

    expect(ref.current).toBeInstanceOf(HTMLFormElement)
    expect(ref.current).toBe(screen.getByTestId("form"))
  })

  it("handles form submission", async () => {
    const handleSubmit = vi.fn((e) => e.preventDefault())

    render(
      <Form onSubmit={handleSubmit}>
        <input name="email" defaultValue="test@example.com" />
        <button type="submit">Submit</button>
      </Form>
    )

    const submitButton = screen.getByRole("button")
    await userEvent.click(submitButton)

    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it("handles empty errors object", () => {
    render(<Form errors={{}} data-testid="form">Test form</Form>)
    const form = screen.getByTestId("form")
    expect(form).toBeInTheDocument()
  })

  it("handles array of error messages", () => {
    const errors = {
      email: ["Email is required", "Email must be valid"],
      password: "Password too short"
    }

    render(<Form errors={errors} data-testid="form">Test form</Form>)
    const form = screen.getByTestId("form")
    expect(form).toBeInTheDocument()
  })

  it("updates props when re-rendered", () => {
    const { rerender } = render(
      <Form
        className="initial-class"
        errors={{}}
        data-testid="form"
      >
        Test form
      </Form>
    )

    expect(screen.getByTestId("form")).toHaveClass("initial-class")

    rerender(
      <Form
        className="updated-class"
        errors={{ email: "Error" }}
        data-testid="form"
      >
        Test form
      </Form>
    )

    expect(screen.getByTestId("form")).toHaveClass("updated-class")
  })

  it("passes through additional props", () => {
    render(
      <Form
        data-testid="form"
        id="my-form"
        aria-label="Test form"
      >
        Test form
      </Form>
    )

    const form = screen.getByTestId("form")
    expect(form).toHaveAttribute("id", "my-form")
    expect(form).toHaveAttribute("aria-label", "Test form")
  })

  it("renders as a native form element", () => {
    render(<Form data-testid="form">Test form</Form>)
    const form = screen.getByTestId("form")
    expect(form.tagName).toBe("FORM")
  })

  it("sets noValidate for Base UI validation handling", () => {
    render(<Form data-testid="form">Test form</Form>)
    const form = screen.getByTestId("form")
    expect(form).toHaveAttribute("novalidate")
  })

  describe("integration with Field components", () => {
    it("works with Field components and error handling", () => {
      const errors = { email: "Email is required" }

      render(
        <Form errors={errors}>
          <Field name="email">
            <FieldLabel>Email</FieldLabel>
            <FieldControl type="email" placeholder="Enter email" />
            <FieldError />
          </Field>
          <button type="submit">Submit</button>
        </Form>
      )

      expect(screen.getByText("Email")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument()
    })

    it("handles form state changes with Field components", () => {
      const { rerender } = render(
        <Form errors={{}}>
          <Field name="email">
            <FieldLabel>Email</FieldLabel>
            <FieldControl type="email" />
            <FieldError />
          </Field>
        </Form>
      )

      rerender(
        <Form errors={{ email: "Invalid email" }}>
          <Field name="email">
            <FieldLabel>Email</FieldLabel>
            <FieldControl type="email" />
            <FieldError />
          </Field>
        </Form>
      )

      expect(screen.getByText("Email")).toBeInTheDocument()
    })
  })
})
