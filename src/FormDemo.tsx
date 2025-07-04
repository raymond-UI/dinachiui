import {
  Button,
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  FieldValidity,
  Form,
  type Errors,
} from "@dinachi/components";
import React from "react";
import { z } from "zod";

// Basic form with validation
export function BasicFormExample() {
  const [errors, setErrors] = React.useState<Errors>({});
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newErrors: Errors = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!email.includes("@"))
      newErrors.email = "Please enter a valid email";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      alert("Form submitted successfully!");
    }
    setLoading(false);
  };

  return (
    <Form
      errors={errors}
      onClearErrors={setErrors}
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md"
    >
      <Field name="name">
        <FieldLabel>Full Name</FieldLabel>
        <FieldControl type="text" required placeholder="Enter your full name" />
        <FieldError />
      </Field>

      <Field name="email">
        <FieldLabel>Email Address</FieldLabel>
        <FieldControl type="email" required placeholder="Enter your email" />
        <FieldError />
      </Field>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </Form>
  );
}

// Zod validation example
export function ZodFormExample() {
  const [errors, setErrors] = React.useState<Errors>({});

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    age: z
      .string()
      .min(1, "Age is required")
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, "Age must be a positive number"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData) as Record<string, string>;

    const result = formSchema.safeParse(data);

    if (!result.success) {
      const zodErrors = result.error.flatten().fieldErrors;
      const newErrors: Errors = {};

      Object.entries(zodErrors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          newErrors[field] = messages[0];
        }
      });

      setErrors(newErrors);
      return;
    }

    setErrors({});
    console.log("Form is valid:", result.data);
    alert("Form validation passed!");
  };

  return (
    <Form
      errors={errors}
      onClearErrors={setErrors}
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md"
    >
      <Field name="name">
        <FieldLabel>Name</FieldLabel>
        <FieldControl placeholder="Enter name" />
        <FieldError />
      </Field>

      <Field name="age">
        <FieldLabel>Age</FieldLabel>
        <FieldControl type="number" placeholder="Enter age" />
        <FieldError />
      </Field>

      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl type="email" placeholder="Enter email" />
        <FieldError />
      </Field>

      <Button type="submit">Submit</Button>
    </Form>
  );
}

// Real-time validation with FieldValidity
export function RealTimeValidationExample() {
  const [errors, setErrors] = React.useState<Errors>({});
  const [values, setValues] = React.useState({ email: "", password: "" });

  const handleInputChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    const newErrors = { ...errors };

    if (name === "email") {
      if (!value) {
        delete newErrors.email;
      } else if (!value.includes("@")) {
        newErrors.email = "Please enter a valid email";
      } else {
        delete newErrors.email;
      }
    }

    if (name === "password") {
      if (!value) {
        delete newErrors.password;
      } else if (value.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (Object.keys(errors).length === 0 && values.email && values.password) {
      alert("Form submitted successfully!");
    }
  };

  return (
    <Form
      errors={errors}
      onClearErrors={setErrors}
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md"
    >
      <Field name="email">
        <FieldLabel>Email Address</FieldLabel>
        <FieldControl
          type="email"
          value={values.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Enter your email"
        />
        <FieldValidity>
          {() => (
            <div className="flex items-center gap-2">
              {values.email && !errors.email && (
                <span className="text-green-600 text-sm">
                  ✓ Valid email format
                </span>
              )}
              {values.email && errors.email && (
                <span className="text-red-600 text-sm">
                  ✗ Invalid email format
                </span>
              )}
            </div>
          )}
        </FieldValidity>
        <FieldError />
      </Field>

      <Field name="password">
        <FieldLabel>Password</FieldLabel>
        <FieldControl
          type="password"
          value={values.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          placeholder="Enter your password"
        />
        <FieldValidity>
          {() => (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {values.password.length >= 8 ? (
                  <span className="text-green-600 text-sm">
                    ✓ At least 8 characters
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">
                    ○ At least 8 characters
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/[A-Z]/.test(values.password) ? (
                  <span className="text-green-600 text-sm">
                    ✓ Contains uppercase letter
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">
                    ○ Contains uppercase letter
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/[0-9]/.test(values.password) ? (
                  <span className="text-green-600 text-sm">
                    ✓ Contains number
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">
                    ○ Contains number
                  </span>
                )}
              </div>
            </div>
          )}
        </FieldValidity>
        <FieldError />
      </Field>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </Form>
  );
}

// Custom render prop example
export function CustomRenderExample() {
  const [errors, setErrors] = React.useState<Errors>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;

    if (!username) {
      setErrors({ username: "Username is required" });
    } else if (username.length < 3) {
      setErrors({ username: "Username must be at least 3 characters" });
    } else {
      setErrors({});
      alert("Form is valid!");
    }
  };

  return (
    <Form
      errors={errors}
      onClearErrors={setErrors}
      onSubmit={handleSubmit}
      render={(props, state) => (
        <form
          {...props}
          className="max-w-md space-y-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Custom Styled Form
            </h3>
            {Object.keys(state.errors).length > 0 && (
              <div className="mt-2 p-3 bg-red-100 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm font-medium">
                  ⚠️ Please fix {Object.keys(state.errors).length} error(s)
                  below
                </p>
              </div>
            )}
          </div>

          <Field name="username">
            <FieldLabel>Username</FieldLabel>
            <FieldControl type="text" placeholder="Enter username" />
            <FieldError />
          </Field>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
          >
            Submit Custom Form
          </Button>
        </form>
      )}
    />
  );
}

export default function FormDemo() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Form Component Demo</h1>
        <p className="text-xl text-muted-foreground">
          Essential examples showcasing the Form component features
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Form with Validation</h2>
        <p className="text-muted-foreground">
          A simple form with loading states and basic validation.
        </p>
        <BasicFormExample />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Zod Schema Validation</h2>
        <p className="text-muted-foreground">
          Type-safe validation using Zod schemas with data transformation.
        </p>
        <ZodFormExample />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Real-Time Validation</h2>
        <p className="text-muted-foreground">
          Live validation feedback using FieldValidity components.
        </p>
        <RealTimeValidationExample />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Custom Render Prop</h2>
        <p className="text-muted-foreground">
          Complete control over form rendering with custom styling.
        </p>
        <CustomRenderExample />
      </section>
    </div>
  );
}
