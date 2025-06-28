import React from 'react';
import {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldValidity,
  Button
} from '@dinachi/components';

// 1. Basic Required Field
export function BasicField() {
  return (
    <Field>
      <FieldLabel>Full Name</FieldLabel>
      <FieldControl required placeholder="Enter your full name" />
      <FieldError match="valueMissing">Please enter your full name</FieldError>
    </Field>
  );
}

// 2. Field with Description
export function FieldWithDescription() {
  return (
    <Field>
      <FieldLabel>Username</FieldLabel>
      <FieldControl required minLength={3} placeholder="johndoe123" />
      <FieldDescription>Choose a unique username with at least 3 characters</FieldDescription>
      <FieldError match="valueMissing">Username is required</FieldError>
      <FieldError match="tooShort">Username must be at least 3 characters</FieldError>
    </Field>
  );
}

// 3. Email Field with Multiple Validations
export function EmailField() {
  return (
    <Field>
      <FieldLabel>Email Address</FieldLabel>
      <FieldControl type="email" required placeholder="john@example.com" />
      <FieldDescription>We'll use this to send you important updates</FieldDescription>
      <FieldError match="valueMissing">Email address is required</FieldError>
      <FieldError match="typeMismatch">Please enter a valid email address</FieldError>
    </Field>
  );
}

// 4. Password Field with Custom Validation
export function PasswordField() {
  return (
    <Field
      validate={(value) => {
        if (!value) return "Password is required";
        if (typeof value === 'string' && value.length < 8) {
          return "Password must be at least 8 characters";
        }
        if (typeof value === 'string' && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return "Password must contain uppercase, lowercase, and number";
        }
        return null;
      }}
    >
      <FieldLabel>Password</FieldLabel>
      <FieldControl type="password" placeholder="Enter a strong password" />
      <FieldDescription>Must be at least 8 characters with uppercase, lowercase, and number</FieldDescription>
      <FieldError match="customError">{/* This will show the custom validation message */}</FieldError>
    </Field>
  );
}

// 5. Number Field with Range Validation
export function AgeField() {
  return (
    <Field>
      <FieldLabel>Age</FieldLabel>
      <FieldControl type="number" required min={13} max={120} placeholder="25" />
      <FieldDescription>You must be at least 13 years old</FieldDescription>
      <FieldError match="valueMissing">Please enter your age</FieldError>
      <FieldError match="rangeUnderflow">You must be at least 13 years old</FieldError>
      <FieldError match="rangeOverflow">Please enter a valid age</FieldError>
    </Field>
  );
}

// 6. Field with Custom Validity Display
export function CustomValidityField() {
  return (
    <Field name="website">
      <FieldLabel>Website URL</FieldLabel>
      <FieldControl type="url" placeholder="https://example.com" />
      <FieldDescription>Optional: Your personal or company website</FieldDescription>
      <FieldValidity>
        {(state) => {
          const validity = state.validity || {};
          const keys = Object.keys(validity);
          const isValid = keys.length > 0 && Object.values(validity).every(v => v === false);
          const isInvalid = keys.length > 0 && Object.values(validity).some(v => v === true);
          return (
            <div className="flex items-center gap-2">
              {isValid ? (
                <span className="text-green-600">✓ Valid URL</span>
              ) : isInvalid ? (
                <span className="text-red-600">✗ Invalid URL format</span>
              ) : (
                <span className="text-gray-500">Enter a valid URL</span>
              )}
            </div>
          );
        }}
      </FieldValidity>
      <FieldError match="typeMismatch">Please enter a valid URL (e.g., https://example.com)</FieldError>
    </Field>
  );
}

// 7. Controlled Field with React State
export function ControlledField() {
  const [value, setValue] = React.useState('');
  return (
    <Field>
      <FieldLabel>Bio</FieldLabel>
      <FieldControl
        render={(props) => (
          <textarea
            {...props}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Tell us about yourself..."
            maxLength={500}
            className={"min-h-[100px] resize-none " + (props.className || "")}
          />
        )}
      />
      <FieldDescription>{500 - value.length} characters remaining</FieldDescription>
      <FieldError match="tooLong">Bio must be 500 characters or less</FieldError>
    </Field>
  );
}

// 8. Field in a Complete Form
export function ContactForm() {
  const [message, setMessage] = React.useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <Field name="name">
        <FieldLabel>Full Name *</FieldLabel>
        <FieldControl required placeholder="John Doe" />
        <FieldError match="valueMissing">Name is required</FieldError>
      </Field>
      <Field name="email">
        <FieldLabel>Email Address *</FieldLabel>
        <FieldControl type="email" required placeholder="john@example.com" />
        <FieldError match="valueMissing">Email is required</FieldError>
        <FieldError match="typeMismatch">Please enter a valid email</FieldError>
      </Field>
      <Field name="message">
        <FieldLabel>Message *</FieldLabel>
        <FieldControl
          render={(props) => (
            <textarea
              {...props}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Your message..."
              className={"min-h-[120px] " + (props.className || "")}
              required
            />
          )}
        />
        <FieldDescription>Tell us how we can help you</FieldDescription>
        <FieldError match="valueMissing">Message is required</FieldError>
      </Field>
      <Button 
        type="submit"
        className="w-full"
      >
        Send Message
      </Button>
    </form>
  );
}

// 9. Disabled Field
export function DisabledField() {
  return (
    <Field disabled>
      <FieldLabel>Account Type</FieldLabel>
      <FieldControl value="Premium" readOnly />
      <FieldDescription>Contact support to change your account type</FieldDescription>
    </Field>
  );
}

// 10. Field with Async Validation
export function AsyncValidationField() {
  return (
    <Field
      validationMode="onChange"
      validationDebounceTime={500}
      validate={async (value) => {
        if (!value || typeof value !== 'string') return null;
        // Simulate API call to check username availability
        await new Promise(resolve => setTimeout(resolve, 300));
        if (value.toLowerCase() === 'admin' || value.toLowerCase() === 'root') {
          return "This username is not available";
        }
        return null;
      }}
    >
      <FieldLabel>Username</FieldLabel>
      <FieldControl placeholder="Choose a username" minLength={3} />
      <FieldDescription>We'll check if this username is available</FieldDescription>
      <FieldError match="tooShort">Username must be at least 3 characters</FieldError>
      <FieldError match="customError">{/* Shows async validation error */}</FieldError>
      <FieldValidity>
        {(state) => {
          const validity = state.validity || {};
          const keys = Object.keys(validity);
          const isValid = keys.length > 0 && Object.values(validity).every(v => v === false);
          const isInvalid = keys.length > 0 && Object.values(validity).some(v => v === true);
          return (
            <div className="flex items-center gap-2">
              {isValid ? (
                <span className="text-green-600">✓ Username available</span>
              ) : isInvalid ? (
                <span className="text-red-600">✗ Invalid or unavailable username</span>
              ) : null}
            </div>
          );
        }}
      </FieldValidity>
    </Field>
  );
}

// Main demo wrapper
export default function FieldDemoShowcase() {
  return (
    <div className="space-y-10 max-w-2xl mx-auto my-8">
      <h2 className="text-3xl font-bold mb-6">Field Component Demos</h2>
      <section>
        <h3 className="text-xl font-semibold mb-2">1. Basic Required Field</h3>
        <BasicField />
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-2">2. Field with Description</h3>
        <FieldWithDescription />
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-2">3. Email Field with Multiple Validations</h3>
        <EmailField />
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-2">4. Password Field with Custom Validation</h3>
        <PasswordField />
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-2">5. Number Field with Range Validation</h3>
        <AgeField />
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-2">6. Field with Custom Validity Display</h3>
        <CustomValidityField />
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-2">7. Controlled Field with React State</h3>
        <ControlledField />
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-2">8. Field in a Complete Form</h3>
        <ContactForm />
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-2">9. Disabled Field</h3>
        <DisabledField />
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-2">10. Field with Async Validation</h3>
        <AsyncValidationField />
      </section>
    </div>
  );
} 