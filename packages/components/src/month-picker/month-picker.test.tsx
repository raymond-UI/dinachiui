import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgentProvider, createAgent } from '../agent';
import { agentConformance } from '../test/agent-conformance';
import type { DateRange } from '../calendar';
import { MonthPicker } from './month-picker';

// Tuesday 17 November 2026.
const today = new Date(2026, 10, 17);
const month = (name: string) => screen.getByRole('button', { name });
const ym = (d: Date | null) => d && `${d.getFullYear()}-${d.getMonth() + 1}`;
const readout = () => document.querySelector('[data-slot=month-picker-readout]')!;

describe('MonthPicker: picking', () => {
  it('shows twelve three-letter months for the year of the value', () => {
    render(<MonthPicker today={today} defaultValue={new Date(2025, 8, 1)} />);
    expect(screen.getByRole('heading', { name: '2025' })).toBeInTheDocument();
    expect(month('September 2025')).toHaveTextContent(/^Sep$/);
    expect(month('September 2025')).toHaveAttribute('aria-pressed', 'true');
  });

  it('rings this month', () => {
    render(<MonthPicker today={today} />);
    expect(month('November 2026')).toHaveAttribute('aria-current', 'date');
  });

  it('picks a month', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<MonthPicker today={today} onValueChange={onValueChange} />);
    await user.click(month('March 2026'));
    expect(ym(onValueChange.mock.calls[0][0])).toBe('2026-3');
  });

  it('steps the year from its header', async () => {
    const user = userEvent.setup();
    render(<MonthPicker today={today} max={today} />);
    expect(screen.getByRole('button', { name: 'Next year' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Previous year' }));
    expect(screen.getByRole('heading', { name: '2025' })).toBeInTheDocument();
  });

  it('holds months outside the bounds', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<MonthPicker today={today} max={today} onValueChange={onValueChange} />);
    expect(month('December 2026')).toHaveAttribute('aria-disabled', 'true');
    await user.click(month('December 2026'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('MonthPicker: range', () => {
  it('bands two picks and reads out the span', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<MonthPicker mode="range" today={today} onValueChange={onValueChange} />);
    await user.click(month('June 2026'));
    expect(readout()).toHaveTextContent('Jun 2026 to ...');
    await user.click(month('November 2026'));
    const r = onValueChange.mock.lastCall![0] as DateRange;
    expect([ym(r.from), ym(r.to)]).toEqual(['2026-6', '2026-11']);
    expect(readout()).toHaveTextContent('Jun to Nov 2026 · 6 months');
    expect(month('August 2026')).toHaveAttribute('aria-pressed', 'true');
    expect(month('May 2026')).toHaveAttribute('aria-pressed', 'false');
  });

  it('starts again on a third pick, or one before the start', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<MonthPicker mode="range" today={today} defaultValue={{ from: new Date(2026, 5, 1), to: null }} onValueChange={onValueChange} />);
    await user.click(month('March 2026'));
    const r = onValueChange.mock.lastCall![0] as DateRange;
    expect([ym(r.from), r.to]).toEqual(['2026-3', null]);
  });

  it('names both years across a new year', () => {
    render(<MonthPicker mode="range" today={today} defaultValue={{ from: new Date(2025, 10, 1), to: new Date(2026, 1, 1) }} />);
    expect(readout()).toHaveTextContent('Nov 2025 to Feb 2026 · 4 months');
  });
});

describe('MonthPicker: keyboard', () => {
  it('moves by month, quarter and year, crossing into the next year', async () => {
    const user = userEvent.setup();
    render(<MonthPicker today={today} defaultValue={new Date(2026, 10, 1)} />);
    await user.click(month('November 2026'));
    await user.keyboard('{ArrowRight}');
    expect(month('December 2026')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(month('March 2027')).toHaveFocus();
    expect(screen.getByRole('heading', { name: '2027' })).toBeInTheDocument();
    await user.keyboard('{PageUp}');
    expect(month('March 2026')).toHaveFocus();
  });

  it('stops at the bounds', async () => {
    const user = userEvent.setup();
    render(<MonthPicker today={today} max={today} defaultValue={new Date(2026, 10, 1)} />);
    await user.click(month('November 2026'));
    await user.keyboard('{ArrowDown}');
    expect(month('November 2026')).toHaveFocus();
  });

  it('flips left and right in RTL', async () => {
    const user = userEvent.setup();
    render(<MonthPicker dir="rtl" today={today} defaultValue={new Date(2026, 4, 1)} />);
    await user.click(month('May 2026'));
    await user.keyboard('{ArrowLeft}');
    expect(month('June 2026')).toHaveFocus();
  });
});

describe('MonthPicker: forms', () => {
  it('submits YYYY-MM, or a pair for a range', () => {
    render(
      <form data-testid="form">
        <MonthPicker today={today} name="one" defaultValue={new Date(2026, 2, 1)} />
        <MonthPicker mode="range" today={today} name="span" defaultValue={{ from: new Date(2026, 5, 1), to: new Date(2026, 10, 1) }} />
      </form>
    );
    const data = new FormData(screen.getByTestId('form') as HTMLFormElement);
    expect(data.get('one')).toBe('2026-03');
    expect(data.get('span')).toBe('2026-06/2026-11');
  });

  it('fails validation when required and empty', () => {
    render(
      <form data-testid="form">
        <MonthPicker today={today} name="one" required />
      </form>
    );
    expect((screen.getByTestId('form') as HTMLFormElement).checkValidity()).toBe(false);
  });
});

agentConformance({
  name: 'MonthPicker',
  render: ({ onChange, disabled }) => (
    <MonthPicker aria-label="Billing period" mode="range" today={today} disabled={disabled} onValueChange={onChange} />
  ),
  label: 'Billing period',
  entry: { component: 'date', multiple: true, actions: ['setValue', 'clear'] },
  act: { action: 'setValue', args: [['2026-06', '2026-11']], result: { ok: true, value: ['2026-06', '2026-11'] } },
  person: async (user) => {
    await user.click(screen.getByRole('button', { name: 'June 2026' }));
  },
});

describe('MonthPicker: agent', () => {
  function mount(ui: React.ReactElement) {
    const agent = createAgent();
    render(<AgentProvider agent={agent}>{ui}</AgentProvider>);
    return { agent, set: (...args: unknown[]) => agent.act({ steps: [{ ref: 'Month', action: 'setValue', args }] }) };
  }

  it('lists one control, not its months', () => {
    const { agent } = mount(<MonthPicker today={today} />);
    expect(agent.snapshot().map((c) => c.label)).toEqual(['Month']);
  });

  it('reads names and ISO months, and refuses what the grid refuses', async () => {
    const { set } = mount(<MonthPicker today={today} max={today} />);
    expect(await set('jun 2025')).toMatchObject({ ok: true, steps: [{ value: '2025-06' }] });
    expect(await set('2026-03')).toMatchObject({ ok: true, steps: [{ value: '2026-03' }] });
    expect((await set('2027-01')).error?.message).toMatch(/latest is 2026-11/);
    expect((await set('soon')).error?.message).toMatch(/not a month/);
  });
});
