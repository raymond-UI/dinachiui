Checkbox Group
Provides shared state to a series of checkboxes.

Apples

Fuji
Gala
Granny Smith
index.tsx
tailwind
import * as React from 'react';
import { Checkbox } from '@base-ui/react/checkbox';
import { CheckboxGroup } from '@base-ui/react/checkbox-group';

export default function ExampleCheckboxGroup() {
  return (
    <CheckboxGroup
      aria-labelledby="apples-caption"
      defaultValue={['fuji-apple']}
      className="flex flex-col items-start gap-1 text-gray-900"
    >
      <div className="font-medium" id="apples-caption">
        Apples
      </div>

      <label className="flex items-center gap-2">
        <Checkbox.Root
          name="apple"
          value="fuji-apple"
          className="flex size-5 items-center justify-center rounded-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-[checked]:bg-gray-900 data-[unchecked]:border data-[unchecked]:border-gray-300"
        >
          <Checkbox.Indicator className="flex text-gray-50 data-[unchecked]:hidden">
            <CheckIcon className="size-3" />
          </Checkbox.Indicator>
        </Checkbox.Root>
        Fuji
      </label>

      <label className="flex items-center gap-2">
        <Checkbox.Root
          name="apple"
          value="gala-apple"
          className="flex size-5 items-center justify-center rounded-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-[checked]:bg-gray-900 data-[unchecked]:border data-[unchecked]:border-gray-300"
        >
          <Checkbox.Indicator className="flex text-gray-50 data-[unchecked]:hidden">
            <CheckIcon className="size-3" />
          </Checkbox.Indicator>
        </Checkbox.Root>
        Gala
      </label>

      <label className="flex items-center gap-2">
        <Checkbox.Root
          name="apple"
          value="granny-smith-apple"
          className="flex size-5 items-center justify-center rounded-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-[checked]:bg-gray-900 data-[unchecked]:border data-[unchecked]:border-gray-300"
        >
          <Checkbox.Indicator className="flex text-gray-50 data-[unchecked]:hidden">
            <CheckIcon className="size-3" />
          </Checkbox.Indicator>
        </Checkbox.Root>
        Granny Smith
      </label>
    </CheckboxGroup>
  );
}

function CheckIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  );
}
Anatomy
Checkbox Group is composed together with Checkbox. Import the components and place them together:

Anatomy
import { Checkbox } from '@base-ui/react/checkbox';
import { CheckboxGroup } from '@base-ui/react/checkbox-group';
<CheckboxGroup>
  <Checkbox.Root />
</CheckboxGroup>
API reference
Prop
Type
Default
defaultValue
string[]

undefined

value
string[]

undefined

onValueChange
((value: string[], event: Event) => void)

undefined

allValues
string[]

undefined

disabled
boolean

false

className
| string
| ((state: Checkbox.Group.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: Checkbox.Group.State) => ReactElement)

undefined

Attribute
Description
data-disabled
Present when the checkbox group is disabled.

Examples
Parent checkbox
A checkbox that controls other checkboxes within a CheckboxGroup can be created:

Make CheckboxGroup a controlled component
Pass an array of all the child checkbox values to the CheckboxGroup’s allValues prop
Add the parent boolean prop to the parent Checkbox
Apples
Fuji
Gala
Granny Smith
import * as React from 'react';
import { Checkbox } from '@base-ui/react/checkbox';
import { CheckboxGroup } from '@base-ui/react/checkbox-group';
import styles from './index.module.css';

const fruits = ['fuji-apple', 'gala-apple', 'granny-smith-apple'];

export default function ExampleCheckboxGroup() {
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <CheckboxGroup
      aria-labelledby="apples-caption"
      value={value}
      onValueChange={setValue}
      allValues={fruits}
      className={styles.CheckboxGroup}
      style={{ marginLeft: '1rem' }}
    >
      <label
        className={styles.Item}
        id="apples-caption"
        style={{ marginLeft: '-1rem' }}
      >
        <Checkbox.Root className={styles.Checkbox} name="apples" parent>
          <Checkbox.Indicator
            className={styles.Indicator}
            render={(props, state) => (
              <span {...props}>
                {state.indeterminate ? (
                  <HorizontalRuleIcon className={styles.Icon} />
                ) : (
                  <CheckIcon className={styles.Icon} />
                )}
              </span>
            )}
          />
        </Checkbox.Root>
        Apples
      </label>

      <label className={styles.Item}>
        <Checkbox.Root value="fuji-apple" className={styles.Checkbox}>
          <Checkbox.Indicator className={styles.Indicator}>
            <CheckIcon className={styles.Icon} />
          </Checkbox.Indicator>
        </Checkbox.Root>
        Fuji
      </label>

      <label className={styles.Item}>
        <Checkbox.Root value="gala-apple" className={styles.Checkbox}>
          <Checkbox.Indicator className={styles.Indicator}>
            <CheckIcon className={styles.Icon} />
          </Checkbox.Indicator>
        </Checkbox.Root>
        Gala
      </label>

      <label className={styles.Item}>
        <Checkbox.Root value="granny-smith-apple" className={styles.Checkbox}>
          <Checkbox.Indicator className={styles.Indicator}>
            <CheckIcon className={styles.Icon} />
          </Checkbox.Indicator>
        </Checkbox.Root>
        Granny Smith
      </label>
    </CheckboxGroup>
  );
}

function CheckIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  );
}

function HorizontalRuleIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="currentcolor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}
Nested parent checkbox
User Permissions
View Dashboard
Access Reports
Manage Users
Create User
Edit User
Delete User
Assign Roles
Form integration
To use checkbox group in a form, pass the checkbox group’s name to a Field, then use the render prop to render the field as a Fieldset in order to label the group.

Using CheckboxGroup in a form
<Form>
  <Field.Root name="toppings" render={<Fieldset.Root />}>
    <Fieldset.Legend>Toppings</Fieldset.Legend>
    <CheckboxGroup>
      <Checkbox.Root value="anchovies" />
      <Checkbox.Root value="olives" />
    <CheckboxGroup>
  </Field.Root>
</Form>

Extra toppings
Anchovies
Olives
Jalapeños
