import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgentProvider, createAgent } from '../agent';
import { agentConformance } from '../test/agent-conformance';
import { toISODate } from '../calendar';
import { DatePicker } from './date-picker';

// Tuesday 17 November 2026.
const today = new Date(2026, 10, 17);
const iso = (d: unknown) => (d instanceof Date ? toISODate(d) : d);
const field = () => screen.getByRole('textbox', { name: 'Due' });
const hint = () => document.querySelector('[data-slot=date-picker-hint]')!;

describe('DatePicker: typing', () => {
  it('previews what it reads, and commits on Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker aria-label="Due" today={today} presentation="popover" onValueChange={onValueChange} />);
    await user.type(field(), 'next fri');
    expect(hint()).toHaveTextContent('Fri, 27 Nov 2026');
    expect(hint()).toHaveTextContent('in 10 days');
    expect(onValueChange).not.toHaveBeenCalled();
    await user.keyboard('{Enter}');
    expect(iso(onValueChange.mock.calls[0][0])).toBe('2026-11-27');
    expect(field()).toHaveValue('Fri, 27 Nov 2026');
    expect(hint()).toHaveTextContent('in 10 days');
    expect(hint()).not.toHaveTextContent('Fri');
  });

  it('commits on leaving the field', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker aria-label="Due" today={today} presentation="popover" onValueChange={onValueChange} />);
    await user.type(field(), 'tomorrow');
    await user.tab();
    expect(iso(onValueChange.mock.calls[0][0])).toBe('2026-11-18');
    expect(field()).toHaveValue('Wed, 18 Nov 2026');
  });

  it('says why text is not a date, and keeps it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker aria-label="Due" today={today} presentation="popover" onValueChange={onValueChange} />);
    await user.type(field(), 'ne');
    expect(field()).not.toHaveAttribute('aria-invalid');
    await user.type(field(), 'ver');
    expect(hint()).toHaveTextContent('Not a date. Try 21 nov or next fri.');
    expect(field()).toHaveAttribute('aria-invalid', 'true');
    expect((field() as HTMLInputElement).validationMessage).toMatch(/Not a date/);
    await user.tab();
    expect(field()).toHaveValue('never');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('refuses days before min', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Due" today={today} min={today} presentation="popover" />);
    await user.type(field(), '3 nov');
    expect(hint()).toHaveTextContent('Tue, 3 Nov 2026 has passed.');
  });

  it('refuses blocked days', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Due" today={today} isDateDisabled={(d) => d.getDay() === 0} presentation="popover" />);
    await user.type(field(), '22 nov');
    expect(hint()).toHaveTextContent("Sun, 22 Nov 2026 isn't available.");
  });

  it('puts the text back on Escape', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Due" today={today} defaultValue={today} presentation="popover" />);
    await user.clear(field());
    await user.type(field(), 'fri');
    await user.keyboard('{Escape}');
    expect(field()).toHaveValue('Tue, 17 Nov 2026');
  });

  it('clears when emptied', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker aria-label="Due" today={today} defaultValue={today} presentation="popover" onValueChange={onValueChange} />);
    await user.clear(field());
    await user.tab();
    expect(onValueChange).toHaveBeenCalledWith(null, expect.anything());
  });

  it('follows a controlled value', () => {
    const { rerender } = render(<DatePicker aria-label="Due" today={today} value={today} presentation="popover" />);
    rerender(<DatePicker aria-label="Due" today={today} value={new Date(2026, 11, 1)} presentation="popover" />);
    expect(field()).toHaveValue('Tue, 1 Dec 2026');
  });

  it('takes its own parser and format', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DatePicker
        aria-label="Due"
        today={today}
        presentation="popover"
        parseDate={(text) => (text === 'demain' ? new Date(2026, 10, 18) : null)}
        formatDate={(d) => toISODate(d)}
        onValueChange={onValueChange}
      />
    );
    await user.type(field(), 'demain{Enter}');
    expect(field()).toHaveValue('2026-11-18');
  });
});

describe('DatePicker: popover', () => {
  it('opens on ArrowDown, and picking a day commits and closes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker aria-label="Due" today={today} presentation="popover" onValueChange={onValueChange} />);
    await user.click(field());
    await user.keyboard('{ArrowDown}');
    const popup = await screen.findByRole('dialog', { name: 'Choose a date' });
    await user.click(screen.getByRole('button', { name: /November 20th, 2026/ }));
    expect(iso(onValueChange.mock.lastCall![0])).toBe('2026-11-20');
    await waitFor(() => expect(popup).not.toBeInTheDocument());
    expect(field()).toHaveValue('Fri, 20 Nov 2026');
  });

  it('names its trigger with the value', () => {
    render(<DatePicker aria-label="Due" today={today} defaultValue={today} presentation="popover" />);
    expect(screen.getByRole('button', { name: 'Choose a date, Tue, 17 Nov 2026' })).toBeInTheDocument();
  });
});

describe('DatePicker: drawer', () => {
  it('commits only on its confirm button', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker aria-label="Due" today={today} presentation="drawer" label="Due date" confirmLabel="Set due date" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Due date' }));
    const tomorrow = await screen.findByRole('button', { name: 'Tomorrow' });
    await user.click(tomorrow);
    expect(tomorrow).toHaveAttribute('aria-pressed', 'true');
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Set due date' }));
    expect(iso(onValueChange.mock.calls[0][0])).toBe('2026-11-18');
  });

  it('drops chips that land on blocked days', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Due" today={today} presentation="drawer" min={new Date(2026, 10, 19)} />);
    await user.click(screen.getByRole('button', { name: 'Choose a date' }));
    await screen.findByRole('button', { name: 'Saturday' });
    expect(screen.queryByRole('button', { name: 'Today' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Tomorrow' })).not.toBeInTheDocument();
  });
});

describe('DatePicker: forms', () => {
  it('submits the day as YYYY-MM-DD', () => {
    render(
      <form data-testid="form">
        <DatePicker aria-label="Due" today={today} name="due" defaultValue={today} presentation="popover" />
      </form>
    );
    const data = new FormData(screen.getByTestId('form') as HTMLFormElement);
    expect(data.get('due')).toBe('2026-11-17');
  });

  it('is required on the field a person fills', () => {
    render(<DatePicker aria-label="Due" today={today} required presentation="popover" />);
    expect(field()).toBeRequired();
    expect((field() as HTMLInputElement).checkValidity()).toBe(false);
  });
});

agentConformance({
  name: 'DatePicker',
  render: ({ onChange, disabled }) => (
    <DatePicker aria-label="Due" today={today} disabled={disabled} presentation="popover" onValueChange={onChange} />
  ),
  label: 'Due',
  entry: { component: 'date', actions: ['setValue', 'clear'] },
  act: { action: 'setValue', args: ['2026-11-20'], result: { ok: true, value: '2026-11-20' } },
  person: async (user) => {
    await user.type(screen.getByRole('textbox', { name: 'Due' }), '20 nov{Enter}');
  },
});

describe('DatePicker: agent', () => {
  function mount(ui: React.ReactElement) {
    const agent = createAgent();
    render(<AgentProvider agent={agent}>{ui}</AgentProvider>);
    return { agent, set: (...args: unknown[]) => agent.act({ steps: [{ ref: 'Due', action: 'setValue', args }] }) };
  }

  it('shows the agent one control, not the calendar inside', () => {
    const { agent } = mount(<DatePicker aria-label="Due" today={today} presentation="popover" />);
    expect(agent.snapshot().filter((c) => c.component === 'date')).toHaveLength(1);
  });

  it('reads phrases, and refuses what the field refuses', async () => {
    const { set } = mount(<DatePicker aria-label="Due" today={today} min={today} presentation="popover" />);
    expect(await set('next fri')).toMatchObject({ ok: true, steps: [{ value: '2026-11-27' }] });
    expect((await set('soon')).error?.message).toMatch(/not a date/);
    expect((await set('2026-11-01')).error?.message).toMatch(/has passed/);
  });

  it('reports a field that does not read', async () => {
    const user = userEvent.setup();
    const { agent } = mount(<DatePicker aria-label="Due" today={today} presentation="popover" />);
    await user.type(field(), 'never');
    expect(agent.snapshot()[0]).toMatchObject({ invalid: true, errors: ['Not a date. Try 21 nov or next fri.'] });
  });
});
