useRender
Hook for enabling a render prop in custom components.

The useRender hook lets you build custom components that provide a render prop to override the default rendered element.

API reference
Input parameters
Prop
Type
Default
render
RenderProp<State>

undefined

props
Record<string, unknown>

undefined

ref
| React.Ref<RenderedElementType>
| React.Ref<RenderedElementType>[]

undefined

state
State

undefined

Return value
Prop
Type
element
React.ReactElement

Usage
const element = useRender({
  // Input parameters
});
Examples
A render prop for a custom Text component lets consumers use it to replace the default rendered p element with a different tag or component.

Text component rendered as a paragraph tag

Text component rendered as a strong tag
'use client';
import * as React from 'react';
import { useRender } from '@base-ui-components/react/use-render';
import { mergeProps } from '@base-ui-components/react/merge-props';
import styles from './index.module.css';

interface TextProps extends useRender.ComponentProps<'p'> {}

function Text(props: TextProps) {
  const { render = <p />, ...otherProps } = props;

  const element = useRender({
    render,
    props: mergeProps<'p'>({ className: styles.Text }, otherProps),
  });

  return element;
}

export default function ExampleText() {
  return (
    <div>
      <Text>Text component rendered as a paragraph tag</Text>
      <Text render={<strong />}>Text component rendered as a strong tag</Text>
    </div>
  );
}
The callback version of the render prop enables more control of how props are spread, and also passes the internal state of a component.

'use client';
import * as React from 'react';
import { useRender } from '@base-ui-components/react/use-render';
import { mergeProps } from '@base-ui-components/react/merge-props';
import styles from './index.module.css';

interface CounterState {
  odd: boolean;
}

interface CounterProps extends useRender.ComponentProps<'button', CounterState> {}

function Counter(props: CounterProps) {
  const { render = <button />, ...otherProps } = props;

  const [count, setCount] = React.useState(0);
  const odd = count % 2 === 1;
  const state = React.useMemo(() => ({ odd }), [odd]);

  const defaultProps: useRender.ElementProps<'button'> = {
    className: styles.Button,
    type: 'button',
    children: (
      <React.Fragment>
        Counter: <span>{count}</span>
      </React.Fragment>
    ),
    onClick() {
      setCount((prev) => prev + 1);
    },
    'aria-label': `Count is ${count}, click to increase.`,
  };

  const element = useRender({
    render,
    state,
    props: mergeProps<'button'>(defaultProps, otherProps),
  });

  return element;
}

export default function ExampleCounter() {
  return (
    <Counter
      render={(props, state) => (
        <button {...props}>
          {props.children}
          <span className={styles.suffix}>{state.odd ? '👎' : '👍'}</span>
        </button>
      )}
    />
  );
}
Merging props
The mergeProps function merges two or more sets of React props together. It safely merges three types of props:

Event handlers, so that all are invoked
className strings
style properties
mergeProps merges objects from left to right, so that subsequent objects’ properties in the arguments overwrite previous ones. Merging props is useful when creating custom components, as well as inside the callback version of the render prop for any Base UI component.

Using mergeProps in the render callback
import { mergeProps } from '@base-ui-components/react/merge-props';
import styles from './index.module.css';
function Button() {
  return (
    <Component
      render={(props, state) => (
        <button
          {...mergeProps<'button'>(props, {
            className: styles.Button,
          })}
        />
      )}
    />
  );
}
Merging refs
When building custom components, you often need to control a ref internally while still letting external consumers pass their own—merging refs lets both parties have access to the underlying DOM element. The ref option in useRender enables this, which holds an array of refs to be merged together.

In React 19, React.forwardRef() is not needed when building primitive components, as the external ref prop is already contained inside props. Your internal ref can be passed to ref to be merged with props.ref:

React 19
function Text({ render = <p />, ...props }: TextProps) {
  const internalRef = React.useRef<HTMLElement | null>(null);
  const element = useRender({
    ref: internalRef,
    props,
    render,
  });
  return element;
}
In older versions of React, you need to use React.forwardRef() and add the forwarded ref to the ref array along with your own internal ref.

The examples above assume React 19, and should be modified to use React.forwardRef() to support React 18 and 17.

React 18 and 17
const Text = React.forwardRef(function Text(
  { render = <p />, ...props }: TextProps,
  forwardedRef: React.ForwardedRef<HTMLElement>,
) {
  const internalRef = React.useRef<HTMLElement | null>(null);
  const element = useRender({
    ref: [forwardedRef, internalRef],
    props,
    render,
  });
  return element;
});
TypeScript
To type props, there are two interfaces:

useRender.ComponentProps for a component’s external (public) props. It types the render prop and HTML attributes.
useRender.ElementProps for the element’s internal (private) props. It types HTML attributes alone.
Typing props
interface ButtonProps extends useRender.ComponentProps<'button'> {}
function Button({ render = <button />, ...props }: ButtonProps) {
  const defaultProps: useRender.ElementProps<'button'> = {
    className: styles.Button,
    type: 'button',
    children: 'Click me',
  };
  const element = useRender({
    render,
    props: mergeProps<'button'>(defaultProps, props),
  });
  return element;
}
Migrating from Radix UI
Radix UI uses an asChild prop, while Base UI uses a render prop. Learn more about how composition works in Base UI in the composition guide.

In Radix UI, the Slot component lets you implement an asChild prop.

Radix UI Slot component
import { Slot } from 'radix-ui';
function Button({ asChild, ...props }) {
  const Comp = asChild ? Slot.Root : 'button';
  return <Comp {...props} />;
}
// Usage
<Button asChild>
  <a href="/contact">Contact</a>
</Button>
In Base UI, useRender lets you implement a render prop. The example below is the equivalent implementation to the Radix example above.

Base UI render prop
import { useRender } from '@base-ui-components/react/use-render';
function Button({ render = <button />, ...props }) {
  return useRender({ render, props });
}
// Usage
<Button render={<a href="/contact">Contact</a>} />