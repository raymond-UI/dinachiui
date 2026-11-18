import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgentProvider, createAgent } from '../agent';
import { agentConformance } from '../test/agent-conformance';
import { enGB } from 'date-fns/locale';
import { Calendar, isoWeek, parseDate, toISODate, fromISODate, daysBetween, type DateRange } from './calendar';

// Tuesday 17 November 2026.
const today = new Date(2026, 10, 17);
const iso = (text: string, order?: 'day-first' | 'month-first') => {
  const d = parseDate(text, { today, order });
  return d ? toISODate(d) : null;
};
// By cell, not by name: a role query reads the name of every day in the scroll, which is slow on CI.
const day = (n: number) => document.querySelector<HTMLButtonElement>(`[data-day="2026-11-${String(n).padStart(2, '0')}"]:not([data-outside]) button`)!;

describe('parseDate', () => {
  it('reads relative words', () => {
    expect(iso('today')).toBe('2026-11-17');
    expect(iso('Tomorrow')).toBe('2026-11-18');
    expect(iso('tmr')).toBe('2026-11-18');
    expect(iso('yesterday')).toBe('2026-11-16');
    expect(iso('in 3 days')).toBe('2026-11-20');
    expect(iso('in 2 weeks')).toBe('2026-12-01');
    expect(iso('in 1 month')).toBe('2026-12-17');
  });

  it('clamps a month ahead to the last day of a shorter month', () => {
    expect(toISODate(parseDate('in 1 month', { today: new Date(2026, 0, 31) })!)).toBe('2026-02-28');
  });

  it('reads weekdays, with next meaning the following week', () => {
    expect(iso('fri')).toBe('2026-11-20');
    expect(iso('friday')).toBe('2026-11-20');
    expect(iso('this fri')).toBe('2026-11-20');
    expect(iso('next fri')).toBe('2026-11-27');
    expect(iso('tue')).toBe('2026-11-24');
    expect(iso('next mon')).toBe('2026-11-23');
  });

  it('reads written and numeric dates', () => {
    expect(iso('21 nov')).toBe('2026-11-21');
    expect(iso('21st November 2027')).toBe('2027-11-21');
    expect(iso('nov 21')).toBe('2026-11-21');
    expect(iso('Nov 21, 2027')).toBe('2027-11-21');
    expect(iso('2026-12-03')).toBe('2026-12-03');
    expect(iso('3/12', 'day-first')).toBe('2026-12-03');
    expect(iso('3/12', 'month-first')).toBe('2026-03-12');
    expect(iso('3.12.27', 'day-first')).toBe('2027-12-03');
    expect(iso('Fri, 20 Nov 2026')).toBe('2026-11-20');
    expect(iso('Friday, November 20, 2026')).toBe('2026-11-20');
    expect(iso('21 nov 26')).toBe('2026-11-21');
    expect(iso('sept 3')).toBe('2026-09-03');
  });

  it('reads numeric dates in the order the browser writes them', () => {
    // jsdom speaks en-US, which writes the month first.
    expect(iso('3/12')).toBe('2026-03-12');
  });

  it('puts a two-digit year within fifty years of today', () => {
    expect(iso('1/1/99', 'day-first')).toBe('1999-01-01');
    expect(iso('1/1/30', 'day-first')).toBe('2030-01-01');
  });

  it('reads this weekday as today, and next by the start of the week', () => {
    expect(iso('this tue')).toBe('2026-11-17');
    expect(iso('tuesday')).toBe('2026-11-24');
    // With weeks starting on Sunday, Sunday the 22nd opens next week.
    expect(toISODate(parseDate('next sun', { today, weekStartsOn: 0 })!)).toBe('2026-11-22');
    expect(iso('next sun')).toBe('2026-11-29');
  });

  it('returns null for text that is not a real date', () => {
    expect(iso('')).toBeNull();
    expect(iso('soon')).toBeNull();
    expect(iso('monster')).toBeNull();
    expect(iso('marx 3')).toBeNull();
    expect(iso('31 feb')).toBeNull();
    expect(iso('2026-13-01')).toBeNull();
    expect(fromISODate('2026-02-30')).toBeNull();
  });
});

describe('date helpers', () => {
  it('numbers weeks the ISO way', () => {
    expect(isoWeek(new Date(2026, 0, 1))).toBe(1);
    expect(isoWeek(new Date(2027, 0, 1))).toBe(53);
    expect(isoWeek(today)).toBe(47);
  });

  it('counts days across a daylight saving change', () => {
    expect(daysBetween(new Date(2026, 2, 28), new Date(2026, 2, 30))).toBe(2);
  });
});

describe('Calendar', () => {
  it('marks its parts with data-slot', () => {
    const { container } = render(<Calendar aria-label="Date" today={today} weekNumbers />);
    for (const slot of ['calendar', 'calendar-weekdays', 'calendar-scroller', 'calendar-month', 'calendar-caption', 'calendar-day']) {
      expect(container.querySelector(`[data-slot="${slot}"]`)).not.toBeNull();
    }
  });

  it('names each day by its full date', () => {
    render(<Calendar aria-label="Date" today={today} />);
    expect(day(20)).toHaveAccessibleName(/November 20th, 2026/);
  });

  it('picks a single day and unpicks it on a second press', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Calendar aria-label="Date" today={today} onValueChange={onValueChange} />);
    await user.click(day(20));
    expect(toISODate(onValueChange.mock.calls[0][0])).toBe('2026-11-20');
    expect(day(20).closest('td')).toHaveAttribute('aria-selected', 'true');
    await user.click(day(20));
    expect(onValueChange.mock.calls[1][0]).toBeNull();
  });

  it('keeps a required single day picked', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Calendar aria-label="Date" today={today} required defaultValue={new Date(2026, 10, 20)} onValueChange={onValueChange} />);
    await user.click(day(20));
    expect(toISODate(onValueChange.mock.calls[0][0])).toBe('2026-11-20');
  });

  it('toggles days in multiple mode, kept in date order', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Calendar mode="multiple" aria-label="Dates" today={today} onValueChange={onValueChange} />);
    await user.click(day(24));
    await user.click(day(19));
    expect(onValueChange.mock.calls[1][0].map(toISODate)).toEqual(['2026-11-19', '2026-11-24']);
    await user.click(day(24));
    expect(onValueChange.mock.calls[2][0].map(toISODate)).toEqual(['2026-11-19']);
  });

  it('builds a range from two presses and marks the days between', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Calendar mode="range" aria-label="Stay" today={today} onValueChange={onValueChange} />);
    await user.click(day(19));
    expect(onValueChange.mock.calls[0][0]).toEqual({ from: new Date(2026, 10, 19), to: null });
    await user.click(day(23));
    expect(onValueChange.mock.calls[1][0]).toEqual({ from: new Date(2026, 10, 19), to: new Date(2026, 10, 23) });
    expect(day(21).closest('td')).toHaveAttribute('aria-selected', 'true');
    expect(day(19)).toHaveAttribute('data-range', 'start');
    expect(day(19)).toHaveAttribute('data-selected');
    expect(day(23)).toHaveAttribute('data-selected');
    expect(day(22)).not.toHaveAttribute('data-selected');
    expect(day(23)).toHaveAttribute('data-range', 'end');
  });

  it('announces only committed days as selected, not a previewed range', async () => {
    const user = userEvent.setup();
    render(<Calendar mode="range" aria-label="Stay" today={today} />);
    await user.click(day(19));
    await user.hover(day(23));
    expect(day(23)).toHaveAttribute('data-range', 'end');
    expect(day(21).closest('td')).not.toHaveAttribute('aria-selected');
    expect(day(23).closest('td')).not.toHaveAttribute('aria-selected');
    expect(day(19).closest('td')).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps a range off the hidden copies of the next month', () => {
    const { container } = render(
      <Calendar mode="range" aria-label="Stay" today={today} defaultValue={{ from: new Date(2026, 10, 25), to: new Date(2026, 11, 5) }} />
    );
    for (const cell of container.querySelectorAll('td[data-outside]')) {
      expect(cell).not.toHaveAttribute('aria-selected');
      expect(cell.className).not.toMatch(/bg-secondary/);
    }
  });

  it('is multiselectable only when it is, and names itself as a group', () => {
    const { unmount } = render(<Calendar aria-label="Date" today={today} />);
    expect(screen.getByRole('group', { name: 'Date' })).toBeInTheDocument();
    expect(screen.getAllByRole('grid')[0]).not.toHaveAttribute('aria-multiselectable');
    unmount();
    render(<Calendar mode="multiple" aria-label="Date" today={today} />);
    expect(screen.getAllByRole('grid')[0]).toHaveAttribute('aria-multiselectable', 'true');
  });

  it('restarts a range pressed before its start, or across a blocked day', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Calendar
        mode="range"
        aria-label="Stay"
        today={today}
        isDateDisabled={(d) => d.getDate() === 21}
        onValueChange={onValueChange}
      />
    );
    await user.click(day(19));
    await user.click(day(18));
    expect(onValueChange.mock.calls[1][0]).toEqual({ from: new Date(2026, 10, 18), to: null });
    await user.click(day(24));
    expect(onValueChange.mock.calls[2][0]).toEqual({ from: new Date(2026, 10, 24), to: null });
  });

  it('previews a range under the pointer', async () => {
    const user = userEvent.setup();
    const onPreview = vi.fn();
    render(<Calendar mode="range" aria-label="Stay" today={today} onPreview={onPreview} />);
    await user.click(day(19));
    await user.hover(day(22));
    expect(onPreview).toHaveBeenLastCalledWith({ from: new Date(2026, 10, 19), to: new Date(2026, 10, 22) });
  });

  it('blocks days outside min and max', () => {
    render(<Calendar aria-label="Date" today={today} min={new Date(2026, 10, 10)} max={new Date(2026, 10, 25)} />);
    expect(day(9)).toBeDisabled();
    expect(day(26)).toBeDisabled();
    expect(day(10)).not.toBeDisabled();
  });

  it('moves between days with the arrow keys', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Calendar aria-label="Date" today={today} defaultValue={new Date(2026, 10, 17)} onValueChange={onValueChange} />);
    day(17).focus();
    await user.keyboard('{ArrowRight}{ArrowDown}{Enter}');
    expect(toISODate(onValueChange.mock.calls[0][0])).toBe('2026-11-25');
  });

  it('shows week numbers', () => {
    render(<Calendar aria-label="Date" today={today} weekNumbers />);
    expect(screen.getAllByText('47').length).toBeGreaterThan(0);
  });

  it('submits the value in a form', () => {
    const { container, rerender } = render(
      <Calendar aria-label="Date" name="due" today={today} value={new Date(2026, 10, 20)} />
    );
    expect(container.querySelector('input[name="due"]')).toHaveValue('2026-11-20');
    const range: DateRange = { from: new Date(2026, 10, 19), to: new Date(2026, 10, 23) };
    rerender(<Calendar mode="range" aria-label="Date" name="due" today={today} value={range} />);
    expect(container.querySelector('input[name="due"]')).toHaveValue('2026-11-19/2026-11-23');
  });

  it('opens on the month of its value in the paged layout', () => {
    render(<Calendar layout="paged" aria-label="Date" today={today} defaultValue={new Date(2027, 2, 4)} />);
    expect(screen.getByText('March 2027')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();
  });

  it('follows a controlled value to another month in the paged layout', () => {
    const { rerender } = render(<Calendar layout="paged" aria-label="Date" today={today} value={today} />);
    rerender(<Calendar layout="paged" aria-label="Date" today={today} value={new Date(2027, 5, 10)} />);
    expect(screen.getByText('June 2027')).toBeInTheDocument();
  });

  it('recentres on today when switched from scroll to paged', () => {
    const { rerender } = render(<Calendar aria-label="Date" today={today} />);
    rerender(<Calendar layout="paged" aria-label="Date" today={today} />);
    expect(screen.getByText('November 2026')).toBeInTheDocument();
  });

  it('holds a bounded run of months however far it scrolls', () => {
    render(<Calendar aria-label="Date" today={today} />);
    const sc = document.querySelector<HTMLElement>('[data-slot=calendar-scroller]')!;
    Object.defineProperty(sc, 'clientHeight', { configurable: true, value: 360 });
    Object.defineProperty(sc, 'scrollHeight', { configurable: true, value: 4000 });
    const months = () => document.querySelectorAll('[data-slot=calendar-month]').length;
    const initial = months();
    for (let i = 0; i < 10; i++) {
      sc.scrollTop = 3800;
      fireEvent.scroll(sc);
    }
    expect(months()).toBeGreaterThan(initial);
    expect(months()).toBeLessThanOrEqual(19);
    expect(document.querySelector('[data-day="2026-11-17"]')).not.toBeInTheDocument();
    for (let i = 0; i < 8; i++) {
      sc.scrollTop = 0;
      fireEvent.scroll(sc);
    }
    expect(months()).toBeLessThanOrEqual(19);
    expect(day(17)).toBeInTheDocument();
  });

  it('jumps by month and year from the dropdown caption', async () => {
    const user = userEvent.setup();
    render(<Calendar layout="paged" captionLayout="dropdown" aria-label="Date" today={today} />);
    expect(screen.getByRole('combobox', { name: 'Month' })).toHaveTextContent('Nov');
    await user.click(screen.getByRole('combobox', { name: 'Year' }));
    await user.click(await screen.findByRole('option', { name: '1990' }));
    await user.click(screen.getByRole('combobox', { name: 'Month' }));
    await user.click(await screen.findByRole('option', { name: 'Mar' }));
    expect(document.querySelector('[data-day="1990-03-15"]')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Year' })).toHaveTextContent('1990');
  });

  it('keeps the dropdowns inside min and max', async () => {
    const user = userEvent.setup();
    render(
      <Calendar
        layout="paged"
        captionLayout="dropdown"
        aria-label="Date"
        today={today}
        min={new Date(2026, 3, 10)}
        max={new Date(2027, 1, 20)}
      />
    );
    await user.click(screen.getByRole('combobox', { name: 'Year' }));
    expect((await screen.findAllByRole('option')).map((o) => o.textContent)).toEqual(['2026', '2027']);
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('combobox', { name: 'Month' }));
    expect(await screen.findByRole('option', { name: 'Mar' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('option', { name: 'Apr' })).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('offsets later months so the picked one lands where it was chosen', async () => {
    const user = userEvent.setup();
    render(<Calendar layout="paged" numberOfMonths={2} captionLayout="dropdown" aria-label="Date" today={today} />);
    await user.click(screen.getAllByRole('combobox', { name: 'Month' })[1]);
    await user.click(await screen.findByRole('option', { name: 'Jun' }));
    expect(screen.getAllByRole('combobox', { name: 'Month' }).map((m) => m.textContent)).toEqual(['May', 'Jun']);
  });
});

agentConformance({
  name: 'Calendar',
  render: ({ onChange, disabled }) => (
    <Calendar aria-label="Due date" today={today} disabled={disabled} onValueChange={onChange} />
  ),
  label: 'Due date',
  entry: { component: 'date', actions: ['setValue', 'clear'] },
  act: { action: 'setValue', args: ['2026-11-20'], result: { ok: true, value: '2026-11-20' } },
  person: async (user) => {
    await user.click(screen.getByRole('button', { name: /November 20th, 2026/ }));
  },
  // react-day-picker commits twice on mount on its own.
  commits: 2,
});

agentConformance({
  name: 'Calendar (range)',
  render: ({ onChange, disabled }) => (
    <Calendar mode="range" aria-label="Stay" today={today} disabled={disabled} onValueChange={onChange} />
  ),
  label: 'Stay',
  entry: { component: 'date', multiple: true },
  act: { action: 'setValue', args: [['2026-11-19', '2026-11-23']], result: { ok: true, value: ['2026-11-19', '2026-11-23'] } },
  person: async (user) => {
    await user.click(screen.getByRole('button', { name: /November 19th, 2026/ }));
  },
  // react-day-picker commits twice on mount on its own.
  commits: 2,
});

describe('Calendar: agent values', () => {
  function mount(ui: React.ReactElement) {
    const agent = createAgent();
    render(<AgentProvider agent={agent}>{ui}</AgentProvider>);
    return (...args: unknown[]) => agent.act({ steps: [{ ref: 'When', action: 'setValue', args }] });
  }

  it('reads phrases the way the field does', async () => {
    const set = mount(<Calendar aria-label="When" today={today} />);
    expect(await set('next fri')).toMatchObject({ ok: true, steps: [{ value: '2026-11-27' }] });
  });

  it('refuses text that is not a date, and days that are blocked', async () => {
    const set = mount(<Calendar aria-label="When" today={today} min={today} />);
    expect((await set('soon')).error?.message).toMatch(/not a date/);
    expect((await set('2026-11-01')).error?.message).toMatch(/earliest is 2026-11-17/);
  });

  it('wants a range from and to, in order', async () => {
    const set = mount(<Calendar mode="range" aria-label="When" today={today} />);
    expect((await set(['2026-11-23', '2026-11-19'])).error?.message).toMatch(/on or after/);
    expect(await set('21 nov to 24 nov')).toMatchObject({ ok: true, steps: [{ value: ['2026-11-21', '2026-11-24'] }] });
    expect(await set('2026-11-25/2026-11-28')).toMatchObject({ ok: true, steps: [{ value: ['2026-11-25', '2026-11-28'] }] });
  });

  it('reads a range of numeric dates', async () => {
    const set = mount(<Calendar mode="range" aria-label="When" today={today} locale={enGB} />);
    expect(await set('21/11 to 24/11')).toMatchObject({ ok: true, steps: [{ value: ['2026-11-21', '2026-11-24'] }] });
  });

  it('refuses a range across a blocked day', async () => {
    const set = mount(<Calendar mode="range" aria-label="When" today={today} isDateDisabled={(d) => d.getDate() === 22} />);
    expect((await set(['2026-11-20', '2026-11-24'])).error?.message).toMatch(/can't run across 2026-11-22/);
  });

  it('checks Date objects against the bounds too', async () => {
    const set = mount(<Calendar mode="range" aria-label="When" today={today} min={today} />);
    expect((await set([new Date(2026, 0, 1), new Date(2026, 0, 2)])).error?.message).toMatch(/earliest/);
    expect((await set([new Date(NaN), today])).error?.message).toMatch(/not a date/);
  });

  it('pages to the month an agent sets', async () => {
    const set = mount(<Calendar layout="paged" aria-label="When" today={today} />);
    await set('2027-06-10');
    expect(await screen.findByText('June 2027')).toBeInTheDocument();
  });
});
