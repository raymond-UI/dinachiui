import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Fieldset, FieldsetLegend } from './fieldset'

describe('Fieldset', () => {
  it('renders legend and children', () => {
    render(
      <Fieldset>
        <FieldsetLegend>Profile</FieldsetLegend>
        <input aria-label="name" />
      </Fieldset>
    )

    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByLabelText('name')).toBeInTheDocument()
  })

  it('forwards ref and className', () => {
    const ref = React.createRef<HTMLElement>()

    render(
      <Fieldset ref={ref} className="custom-fieldset">
        <FieldsetLegend>Settings</FieldsetLegend>
      </Fieldset>
    )

    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('custom-fieldset')
  })
})
