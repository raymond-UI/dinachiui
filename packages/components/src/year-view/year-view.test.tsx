import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgentProvider, createAgent } from '../agent';
import { agentConformance } from '../test/agent-conformance';
import { toISODate } from '../calendar';
import { YearView } from './year-view';

// Tuesday 17 November 2026.
const today = new Date(2026, 10, 17);
const counts = { '2026-11-10': 3, '2026-11-11': 8, '2026-11-12': 1, '2025-11-20': 2 };
const square = (name: RegExp | string) => screen.getByRole('button', { name });
const readout = () => document.querySelector('[data-slot=year-view-readout]')!;
const iso = (d: unknown) => (d instanceof Date ? toISODate(d) : d);

describe('YearView: weeks', () => {
  it('shows 53 weeks up to this one, and leads with the total', () => {
    render(<YearView today={today} counts={counts} layout="weeks" formatCount={(n) => `${n} ${n === 1 ? 'deploy' : 'deploys'}`} />);
    expect(document.querySelectorAll('[data-slot=year-view-day]')).toHaveLength(371);
    expect(screen.getByText('14 deploys in the last 12 months')).toBeInTheDocument();
  });

  it('shades by quarters of the busiest day', () => {
    render(<YearView today={today} counts={counts} layout="weeks" />);
    expect(square(/11 November 2026/)).toHaveAttribute('data-level', '4');
    expect(square(/10 November 2026/)).toHaveAttribute('data-level', '2');
    expect(square(/12 November 2026/)).toHaveAttribute('data-level', '1');
    expect(square(/13 November 2026/)).toHaveAttribute('data-level', '0');
  });

  it('holds days after today', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<YearView today={today} counts={counts} layout="weeks" onValueChange={onValueChange} />);
    expect(square(/Friday 20 November 2026/)).toHaveAttribute('aria-disabled', 'true');
    await user.click(square(/Friday 20 November 2026/));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('gives a picked day its date and count', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<YearView today={today} counts={counts} layout="weeks" onValueChange={onValueChange} />);
    await user.click(square('Wednesday 11 November 2026: 8 events'));
    expect(iso(onValueChange.mock.lastCall![0])).toBe('2026-11-11');
    expect(readout()).toHaveTextContent('Wednesday 11 November 2026 · 8 events');
  });

  it('clears a picked day when it is pressed again', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<YearView today={today} counts={counts} layout="weeks" defaultValue={new Date(2026, 10, 11)} onValueChange={onValueChange} />);
    await user.click(square(/11 November 2026/));
    expect(onValueChange.mock.lastCall![0]).toBeNull();
  });

  it('keeps a required day when it is pressed again', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<YearView today={today} counts={counts} layout="weeks" required defaultValue={new Date(2026, 10, 11)} onValueChange={onValueChange} />);
    await user.click(square(/11 November 2026/));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(square(/11 November 2026/)).toHaveAttribute('aria-pressed', 'true');
  });

  it('lets days after today be picked up to max', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<YearView today={today} end={new Date(2026, 11, 31)} max={new Date(2026, 11, 31)} counts={{ ...counts, '2026-12-02': 5 }} layout="weeks" onValueChange={onValueChange} />);
    expect(square(/Wednesday 2 December 2026: 5 events/)).not.toHaveAttribute('aria-disabled');
    await user.click(square(/Wednesday 2 December 2026/));
    expect(iso(onValueChange.mock.lastCall![0])).toBe('2026-12-02');
    expect(screen.getByText(/17 events in the year to 31 Dec 2026/)).toBeInTheDocument();
  });

  it('starts where start says, for as many weeks as it takes', () => {
    render(<YearView today={today} start={new Date(2026, 0, 1)} end={new Date(2027, 5, 30)} max={new Date(2027, 5, 30)} counts={counts} layout="weeks" />);
    // Mon 29 Dec 2025 to Sun 4 Jul 2027.
    expect(document.querySelectorAll('[data-slot=year-view-day]')).toHaveLength(79 * 7);
    expect(square(/Wednesday 31 December 2025/)).toHaveAttribute('aria-disabled', 'true');
    expect(square(/Thursday 1 January 2026/)).not.toHaveAttribute('aria-disabled');
    expect(screen.getByText('12 events from 1 Jan 2026 to 30 Jun 2027')).toBeInTheDocument();
  });

  it('names the year it shows when it ends before today', () => {
    render(<YearView today={today} end={new Date(2026, 2, 3)} counts={counts} layout="weeks" />);
    expect(screen.getByText(/in the year to 3 Mar 2026/)).toBeInTheDocument();
  });

  it('walks weeks across and days down, and picks only on Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<YearView today={today} counts={counts} layout="weeks" onValueChange={onValueChange} />);
    await user.click(square(/Tuesday 10 November/));
    onValueChange.mockClear();
    await user.keyboard('{ArrowLeft}');
    expect(square(/Tuesday 3 November/)).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(square(/Wednesday 4 November/)).toHaveFocus();
    expect(square(/Wednesday 4 November/)).toHaveAttribute('tabindex', '0');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(readout()).toHaveTextContent('Tuesday 10 November 2026');
    await user.keyboard('{Enter}');
    expect(iso(onValueChange.mock.lastCall![0])).toBe('2026-11-04');
    expect(readout()).toHaveTextContent('Wednesday 4 November 2026');
  });

  it('jumps a month with PageUp and PageDown, and to the ends with Home and End', async () => {
    const user = userEvent.setup();
    render(<YearView today={today} counts={counts} layout="weeks" defaultValue={new Date(2026, 9, 10)} />);
    await user.click(square(/Saturday 10 October/));
    await user.keyboard('{PageUp}');
    expect(square(/Thursday 10 September 2026/)).toHaveFocus();
    await user.keyboard('{PageDown}{PageDown}{PageDown}');
    expect(square(/Tuesday 17 November 2026/)).toHaveFocus();
    await user.keyboard('{Home}');
    expect(square(/Monday 17 November 2025/)).toHaveFocus();
    await user.keyboard('{End}');
    expect(square(/Tuesday 17 November 2026/)).toHaveFocus();
  });
});

describe('YearView: months', () => {
  it('stacks months, latest first, and walks days across and weeks down', async () => {
    const user = userEvent.setup();
    render(<YearView today={today} counts={counts} layout="months" />);
    const labels = [...document.querySelectorAll('[data-slot=year-view-month-label]')].map((h) => h.textContent);
    expect(labels[0]).toBe('November 2026');
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    await user.click(square(/Tuesday 10 November/));
    await user.keyboard('{ArrowRight}');
    expect(square(/Wednesday 11 November/)).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(square(/Wednesday 4 November/)).toHaveFocus();
  });
});

agentConformance({
  name: 'YearView',
  render: ({ onChange, disabled }) => (
    <YearView aria-label="Deploys" today={today} counts={counts} layout="weeks" disabled={disabled} onValueChange={onChange} />
  ),
  label: 'Deploys',
  entry: { component: 'date', actions: ['setValue', 'clear'] },
  act: { action: 'setValue', args: ['2026-11-11'], result: { ok: true, value: '2026-11-11' } },
  person: async (user) => {
    await user.click(screen.getByRole('button', { name: /Wednesday 11 November 2026/ }));
  },
});

describe('YearView: agent', () => {
  it('lists one control, and refuses days with no count yet', async () => {
    const agent = createAgent();
    render(
      <AgentProvider agent={agent}>
        <YearView today={today} counts={counts} layout="weeks" />
      </AgentProvider>
    );
    expect(agent.snapshot().map((c) => c.label)).toEqual(['Activity']);
    const set = (v: unknown) => agent.act({ steps: [{ ref: 'Activity', action: 'setValue', args: [v] }] });
    expect((await set('2026-11-20')).error?.message).toMatch(/after 2026-11-17/);
    expect((await set('2024-01-01')).error?.message).toMatch(/starts on/);
  });
});
