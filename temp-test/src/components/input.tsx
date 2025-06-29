import * as React from 'react';
import { Input as BaseInput } from '@base-ui-components/react/input';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof BaseInput>>(
  ({ className, ...props }, ref) => {
    return (
      <BaseInput
        className="h-10 w-full max-w-64 rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
