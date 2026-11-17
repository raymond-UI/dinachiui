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

  it('names the year it shows when it ends before today', () => {
    render(<YearView today={today} end={new Date(2026, 2, 3)} counts={counts} layout="weeks" />);
    expect(screen.getByText(/in the year to 3 Mar 2026/)).toBeInTheDocument();
  });

  it('walks weeks across and days down', async () => {
    const user = userEvent.setup();
    render(<YearView today={today} counts={counts} layout="weeks" />);
    await user.click(square(/Tuesday 10 November/));
    await user.keyboard('{ArrowLeft}');
    expect(square(/Tuesday 3 November/)).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(square(/Wednesday 4 November/)).toHaveFocus();
    expect(readout()).toHaveTextContent('Wednesday 4 November 2026');
  });
});

describe('YearView: months', () => {
  it('stacks months, latest first, and walks days across and weeks down', async () => {
    const user = userEvent.setup();
    render(<YearView today={today} counts={counts} layout="months" />);
    const headings = screen.getAllByRole('heading').map((h) => h.textContent);
    expect(headings[0]).toBe('November 2026');
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
