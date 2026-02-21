import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
} from './progress'

describe('Progress', () => {
  it('renders progress with accessible role', () => {
    render(
      <Progress value={55}>
        <ProgressLabel>Upload</ProgressLabel>
        <ProgressTrack>
          <ProgressIndicator data-testid="progress-indicator" />
        </ProgressTrack>
        <ProgressValue />
      </Progress>
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByText('Upload')).toBeInTheDocument()
    expect(screen.getByTestId('progress-indicator')).toBeInTheDocument()
  })

  it('supports indeterminate state', () => {
    render(
      <Progress value={null}>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    )

    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toBeInTheDocument()
    expect(progressbar).not.toHaveAttribute('aria-valuenow')
    expect(progressbar).toHaveAttribute('aria-valuetext', 'indeterminate progress')
  })
})
