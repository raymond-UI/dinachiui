import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgentProvider, createAgent } from '../agent';
import { agentConformance } from '../test/agent-conformance';
import { toISODate, type DateRange } from '../calendar';
import { DateRangePicker } from './date-range-picker';

// Tuesday 17 November 2026.
const today = new Date(2026, 10, 17);
const pair = (r: DateRange) => [r.from && toISODate(r.from), r.to && toISODate(r.to)];
// By cell, not by name: a role query reads the name of every day in the scroll, which is slow on CI.
const day = (n: number) => document.querySelector<HTMLButtonElement>(`[data-day="2026-11-${String(n).padStart(2, '0')}"]:not([data-outside]) button`)!;
const readout = () => document.querySelector('[data-slot=date-range-picker-readout]')!;
// The popup holds two months of day buttons; a query across all of them is slow on CI.
const inSlot = (slot: string) => within(document.querySelector<HTMLElement>(`[data-slot=date-range-picker-${slot}]`)!);
const preset = (name: string) => inSlot('presets').getByRole('button', { name });
const action = (name: string) => inSlot('footer').getByRole('button', { name });
const week = { from: new Date(2026, 10, 11), to: today };

describe('DateRangePicker: trigger', () => {
  it('names a preset and the range it covers', () => {
    render(<DateRangePicker today={today} defaultValue={week} presentation="popover" />);
    expect(screen.getByRole('button', { name: /Last 7 days\s*11 to 17 Nov 2026/ })).toBeInTheDocument();
  });

  it('names a custom range by its dates', () => {
    render(<DateRangePicker today={today} defaultValue={{ from: new Date(2026, 9, 28), to: new Date(2026, 10, 3) }} presentation="popover" />);
    expect(screen.getByRole('button', { name: '28 Oct to 3 Nov 2026' })).toBeInTheDocument();
  });

  it('includes both years across a new year', () => {
    render(<DateRangePicker today={today} defaultValue={{ from: new Date(2025, 11, 28), to: new Date(2026, 0, 3) }} presentation="popover" />);
    expect(screen.getByRole('button', { name: '28 Dec 2025 to 3 Jan 2026' })).toBeInTheDocument();
  });

  it('shows the placeholder when empty', () => {
    render(<DateRangePicker today={today} presentation="popover" />);
    expect(screen.getByRole('button', { name: 'Pick dates' })).toBeInTheDocument();
  });

  it('keeps the range in its name when it is labelled', () => {
    render(<DateRangePicker aria-label="Period" today={today} defaultValue={week} presentation="popover" />);
    expect(screen.getByRole('button', { name: 'Period: Last 7 days 11 to 17 Nov 2026' })).toBeInTheDocument();
  });
});

// Opening scans every day in the scroll for focus, which jsdom does slowly; CI runs it several times slower again.
describe('DateRangePicker: popover', { timeout: 45_000 }, () => {
  async function open(ui: React.ReactElement) {
    const user = userEvent.setup();
    render(ui);
    await user.click(screen.getAllByRole('button')[0]);
    await screen.findByRole('dialog', { name: 'Date range' });
    return user;
  }

  it('applies a preset only on Apply', async () => {
    const onValueChange = vi.fn();
    const user = await open(<DateRangePicker today={today} defaultValue={week} presentation="popover" onValueChange={onValueChange} />);
    expect(preset('Last 7 days')).toHaveAttribute('aria-pressed', 'true');
    await user.click(preset('Last 30 days'));
    expect(readout()).toHaveTextContent('19 Oct to 17 Nov 2026 · 30 days');
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(action('Apply'));
    expect(pair(onValueChange.mock.calls[0][0])).toEqual(['2026-10-19', '2026-11-17']);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('marks Custom when the calendar is used, and holds Apply until there is an end', async () => {
    const onValueChange = vi.fn();
    const user = await open(<DateRangePicker today={today} defaultValue={week} presentation="popover" onValueChange={onValueChange} />);
    await user.click(preset('Custom'));
    expect(readout()).toHaveTextContent('Pick a start');
    expect(action('Apply')).toBeDisabled();
    await user.click(day(3));
    expect(readout()).toHaveTextContent('3 Nov to ...');
    await user.click(day(5));
    expect(preset('Custom')).toHaveAttribute('aria-pressed', 'true');
    expect(readout()).toHaveTextContent('3 to 5 Nov 2026 · 3 days');
    await user.click(action('Apply'));
    expect(pair(onValueChange.mock.calls[0][0])).toEqual(['2026-11-03', '2026-11-05']);
  });

  it.each([
    ['Cancel', (user: ReturnType<typeof userEvent.setup>) => user.click(action('Cancel'))],
    ['Escape', (user: ReturnType<typeof userEvent.setup>) => user.keyboard('{Escape}')],
  ])('leaves the range as it was on %s', async (_, close) => {
    const onValueChange = vi.fn();
    const user = await open(<DateRangePicker today={today} defaultValue={week} presentation="popover" onValueChange={onValueChange} />);
    await user.click(preset('Yesterday'));
    await close(user);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: /Last 7 days/ })).toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('keeps a hand-picked range named by its dates', async () => {
    const user = await open(<DateRangePicker today={today} presentation="popover" />);
    await user.click(day(11));
    await user.click(day(17));
    await user.click(action('Apply'));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: '11 to 17 Nov 2026' })).toBeInTheDocument();
  });

  it('shows the calendar alone when there are no presets', async () => {
    await open(<DateRangePicker today={today} presets={[]} presentation="popover" />);
    expect(document.querySelector('[data-slot=date-range-picker-presets]')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Custom' })).not.toBeInTheDocument();
  });

  it('drops presets that reach outside the bounds', async () => {
    await open(<DateRangePicker today={today} min={new Date(2026, 10, 1)} presentation="popover" />);
    expect(preset('Last 7 days')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Last 30 days' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Last month' })).not.toBeInTheDocument();
  });
});

describe('DateRangePicker: drawer', () => {
  it('shows presets as chips and applies from its footer', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DateRangePicker today={today} presentation="drawer" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Pick dates' }));
    await user.click(await screen.findByRole('button', { name: 'Today' }));
    expect(readout()).toHaveTextContent('Tue, 17 Nov 2026');
    expect(readout()).toHaveTextContent('1 day');
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(pair(onValueChange.mock.calls[0][0])).toEqual(['2026-11-17', '2026-11-17']);
  });

  it('opens on the applied range, not the one left unapplied', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker today={today} defaultValue={week} presentation="drawer" />);
    await user.click(screen.getByRole('button', { name: /Last 7 days/ }));
    await user.click(await screen.findByRole('button', { name: 'Yesterday' }));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /Last 7 days/ }));
    expect(await screen.findByRole('button', { name: 'Last 7 days' })).toHaveAttribute('aria-pressed', 'true');
    expect(readout()).toHaveTextContent('11 to 17 Nov 2026');
  });
});

describe('DateRangePicker: forms', () => {
  it('submits the range as a pair', () => {
    render(
      <form data-testid="form">
        <DateRangePicker today={today} name="when" defaultValue={week} presentation="popover" />
      </form>
    );
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('when')).toBe('2026-11-11/2026-11-17');
  });

  it('fails validation when required and empty', () => {
    render(
      <form data-testid="form">
        <DateRangePicker today={today} name="when" required presentation="popover" />
      </form>
    );
    expect((screen.getByTestId('form') as HTMLFormElement).checkValidity()).toBe(false);
  });
});

agentConformance({
  name: 'DateRangePicker',
  render: ({ onChange, disabled }) => (
    <DateRangePicker aria-label="Period" today={today} disabled={disabled} presentation="popover" onValueChange={onChange} />
  ),
  label: 'Period',
  entry: { component: 'date', multiple: true, items: ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'This month', 'Last month'] },
  act: { action: 'setValue', args: [['2026-11-02', '2026-11-08']], result: { ok: true, value: ['2026-11-02', '2026-11-08'] } },
  person: async (user) => {
    await user.click(screen.getByRole('button', { name: /^Period/ }));
    await user.click(await screen.findByRole('button', { name: 'Today' }));
    await user.click(screen.getByRole('button', { name: 'Apply' }));
  },
});

describe('DateRangePicker: agent', () => {
  function mount(ui: React.ReactElement) {
    const agent = createAgent();
    render(<AgentProvider agent={agent}>{ui}</AgentProvider>);
    return (...args: unknown[]) => agent.act({ steps: [{ ref: 'Period', action: 'setValue', args }] });
  }

  it('takes a preset by name, or two dates in any form', async () => {
    const set = mount(<DateRangePicker aria-label="Period" today={today} presentation="popover" />);
    expect(await set('last 7 days')).toMatchObject({ ok: true, steps: [{ value: ['2026-11-11', '2026-11-17'] }] });
    expect(await set('2 nov to 8 nov')).toMatchObject({ ok: true, steps: [{ value: ['2026-11-02', '2026-11-08'] }] });
    expect(await set('2026-10-01/2026-10-31')).toMatchObject({ ok: true, steps: [{ value: ['2026-10-01', '2026-10-31'] }] });
  });

  it('does not report a change that changes nothing', async () => {
    const onValueChange = vi.fn();
    const set = mount(<DateRangePicker aria-label="Period" today={today} defaultValue={week} presentation="popover" onValueChange={onValueChange} />);
    expect(await set('last 7 days')).toMatchObject({ ok: true });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('refuses ranges the calendar would refuse', async () => {
    const set = mount(<DateRangePicker aria-label="Period" today={today} max={today} isDateDisabled={(d) => d.getDate() === 5} presentation="popover" />);
    expect((await set('soon')).error?.message).toMatch(/Last 7 days/);
    expect((await set(['2026-11-10', '2026-11-08'])).error?.message).toMatch(/on or after/);
    expect((await set(['2026-11-10', '2026-11-20'])).error?.message).toMatch(/latest is 2026-11-17/);
    expect((await set(['2026-11-03', '2026-11-08'])).error?.message).toMatch(/can't run across 2026-11-05/);
  });
});
