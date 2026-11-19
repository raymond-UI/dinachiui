import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgentProvider, createAgent } from '../agent';
import { agentConformance } from '../test/agent-conformance';
import { toISODate } from '../calendar';
import { WeekStrip } from './week-strip';

// Tuesday 17 November 2026.
const today = new Date(2026, 10, 17);
const day = (name: RegExp | string) => screen.getByRole('option', { name });
const iso = (d: unknown) => (d instanceof Date ? toISODate(d) : d);

describe('WeekStrip', () => {
  it('runs from last week to three weeks ahead, with today selected', () => {
    render(<WeekStrip today={today} />);
    const days = screen.getAllByRole('option');
    expect(days).toHaveLength(35);
    expect(days[0]).toHaveAccessibleName('Monday 9 November');
    expect(day('Tuesday 17 November')).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByRole('button', { name: 'Today' })).not.toBeInTheDocument();
  });

  it('names each day with its count, and dots up to three', () => {
    render(<WeekStrip today={today} counts={{ '2026-11-18': 5, '2026-11-19': 1 }} />);
    expect(day('Wednesday 18 November, 5 events').querySelectorAll('i')).toHaveLength(3);
    expect(day('Thursday 19 November, 1 event')).toBeInTheDocument();
    expect(day('Friday 20 November, 0 events')).toBeInTheDocument();
  });

  it('selects a day, and offers Today once away from it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<WeekStrip today={today} onValueChange={onValueChange} />);
    await user.click(day('Friday 20 November'));
    expect(iso(onValueChange.mock.lastCall![0])).toBe('2026-11-20');
    await user.click(screen.getByRole('button', { name: 'Today' }));
    expect(iso(onValueChange.mock.lastCall![0])).toBe('2026-11-17');
    expect(day('Tuesday 17 November')).toHaveFocus();
  });

  it('steps a week with its chevrons, up to the ends', async () => {
    const user = userEvent.setup();
    render(<WeekStrip today={today} />);
    await user.click(screen.getByRole('button', { name: 'Previous week' }));
    expect(day('Tuesday 10 November')).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('button', { name: 'Previous week' }));
    expect(day('Monday 9 November')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: 'Previous week' })).toBeDisabled();
  });

  it('steps to the edge when only part of a week is left', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const min = new Date(2026, 0, 1);
    const max = new Date(2027, 5, 30);
    render(<WeekStrip today={today} min={min} max={max} defaultValue={new Date(2026, 0, 5)} onValueChange={onValueChange} />);
    expect(screen.getByRole('button', { name: 'Previous week' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Previous week' }));
    expect(iso(onValueChange.mock.lastCall![0])).toBe('2026-01-01');
    await user.click(day(/Thursday 1 January/));
    await user.keyboard('{End}');
    expect(day(/Wednesday 30 June 2027/)).toHaveFocus();
    expect(iso(onValueChange.mock.lastCall![0])).toBe('2027-06-30');
    await user.keyboard('{PageUp}{PageUp}');
    expect(iso(onValueChange.mock.lastCall![0])).toBe('2027-06-16');
    await user.keyboard('{PageDown}{PageDown}{PageDown}');
    expect(iso(onValueChange.mock.lastCall![0])).toBe('2027-06-30');
  });

  it('names the year when it is not this one', () => {
    render(<WeekStrip today={today} max={new Date(2027, 0, 31)} defaultValue={new Date(2027, 0, 1)} />);
    expect(day('Friday 1 January 2027')).toHaveAttribute('aria-selected', 'true');
    expect(day('Thursday 31 December')).toBeInTheDocument();
    expect(document.querySelector('[data-slot=week-strip-title]')).toHaveTextContent('Friday 1 January 2027');
  });

  it('dots by thresholds when given', () => {
    render(<WeekStrip today={today} counts={{ '2026-11-18': 150, '2026-11-19': 5 }} thresholds={[10, 100, 200]} />);
    expect(day(/Wednesday 18 November/).querySelectorAll('i')).toHaveLength(2);
    expect(day(/Thursday 19 November/).querySelectorAll('i')).toHaveLength(0);
  });

  it('renders the weeks around the day, not the whole range', () => {
    render(<WeekStrip today={today} min={new Date(2026, 0, 1)} max={new Date(2027, 5, 30)} />);
    expect(screen.getAllByRole('option').length).toBeLessThanOrEqual(17 * 7);
    expect(day('Tuesday 17 November')).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByRole('option', { name: /Thursday 1 January/ })).not.toBeInTheDocument();
  });

  it('keeps the week buttons on every screen', () => {
    render(<WeekStrip today={today} />);
    expect(screen.getByRole('button', { name: 'Next week' }).className).not.toMatch(/max-md:hidden/);
  });

  it('moves a day on the arrows and goes home to today', async () => {
    const user = userEvent.setup();
    render(<WeekStrip today={today} />);
    await user.click(day('Tuesday 17 November'));
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(day('Thursday 19 November')).toHaveFocus();
    expect(day('Thursday 19 November')).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{PageDown}');
    expect(day('Thursday 26 November')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(day('Tuesday 17 November')).toHaveFocus();
  });

  it('keeps a tab stop when the value is off the strip', () => {
    render(<WeekStrip today={today} defaultValue={new Date(2027, 2, 1)} />);
    expect(day('Sunday 13 December')).toHaveAttribute('tabindex', '0');
    expect(screen.getAllByRole('option').filter((o) => o.getAttribute('aria-selected') === 'true')).toHaveLength(0);
  });

  it('flips the arrows in RTL', async () => {
    const user = userEvent.setup();
    render(<WeekStrip dir="rtl" today={today} />);
    await user.click(day('Tuesday 17 November'));
    await user.keyboard('{ArrowLeft}');
    expect(day('Wednesday 18 November')).toHaveFocus();
  });

  it('submits the day', () => {
    render(
      <form data-testid="form">
        <WeekStrip today={today} name="day" />
      </form>
    );
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('day')).toBe('2026-11-17');
  });
});

agentConformance({
  name: 'WeekStrip',
  render: ({ onChange, disabled }) => <WeekStrip aria-label="Schedule" today={today} disabled={disabled} onValueChange={onChange} />,
  label: 'Schedule',
  entry: { component: 'date', value: '2026-11-17', actions: ['setValue'] },
  act: { action: 'setValue', args: ['2026-11-20'], result: { ok: true, value: '2026-11-20' } },
  person: async (user) => {
    await user.click(screen.getByRole('option', { name: 'Friday 20 November' }));
  },
});

describe('WeekStrip: agent', () => {
  it('lists one control, takes phrases, and refuses days off the strip', async () => {
    const agent = createAgent();
    render(
      <AgentProvider agent={agent}>
        <WeekStrip today={today} />
      </AgentProvider>
    );
    expect(agent.snapshot().map((c) => c.label)).toEqual(['Day']);
    const set = (v: unknown) => agent.act({ steps: [{ ref: 'Day', action: 'setValue', args: [v] }] });
    expect(await set('next fri')).toMatchObject({ ok: true, steps: [{ value: '2026-11-27' }] });
    expect((await set('2027-01-01')).error?.message).toMatch(/ends on 2026-12-13/);
  });
});
