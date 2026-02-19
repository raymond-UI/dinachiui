import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Meter, MeterTrack, MeterIndicator, MeterLabel, MeterValue } from './meter'

describe('Meter', () => {
  it('renders meter with label and value', () => {
    render(
      <Meter value={40} min={0} max={100}>
        <MeterLabel>Storage</MeterLabel>
        <MeterTrack>
          <MeterIndicator data-testid="meter-indicator" />
        </MeterTrack>
        <MeterValue />
      </Meter>
    )

    expect(screen.getByRole('meter')).toBeInTheDocument()
    expect(screen.getByText('Storage')).toBeInTheDocument()
    expect(screen.getByTestId('meter-indicator')).toBeInTheDocument()
  })

  it('applies custom classes', () => {
    render(
      <Meter value={10} className="custom-meter">
        <MeterTrack data-testid="meter-track" className="custom-track">
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    )

    expect(screen.getByTestId('meter-track').parentElement).toHaveClass('custom-meter')
    expect(screen.getByTestId('meter-track')).toHaveClass('custom-track')
  })
})
