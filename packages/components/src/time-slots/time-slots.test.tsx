import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgentProvider, createAgent } from '../agent';
import { agentConformance } from '../test/agent-conformance';
import { TimeSlots, type TimeSlot } from './time-slots';

const h = (t: string) => +t.split(':')[0] * 60 + +t.split(':')[1];
const slot = (a: string, b: string): TimeSlot => ({ start: h(a), end: h(b) });
const busy = [slot('09:00', '10:00'), slot('12:30', '13:30'), slot('15:00', '16:30'), slot('18:00', '18:45')];
// 10:40, so the morning up to it is past.
const now = h('10:40');
const span = (v: TimeSlot | null) => v && [v.start, v.end].map((m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`).join('-');
const track = () => screen.getByRole('slider');
const readout = () => document.querySelector('[data-slot=time-slots-readout]')!;

/** One pixel a minute across 08:00 to 20:00. */
function sized() {
  track().getBoundingClientRect = () => ({ left: 0, right: 720, width: 720, top: 0, bottom: 64, height: 64, x: 0, y: 0, toJSON() {} });
}

describe('TimeSlots: track', () => {
  it('reads out the booking with its zone and length', () => {
    render(<TimeSlots layout="horizontal" timeZone="GMT" busy={busy} now={now} defaultValue={slot('10:45', '12:00')} />);
    expect(readout()).toHaveTextContent('10:45 to 12:00 GMT · 1 h 15 min');
    expect(track()).toHaveAttribute('aria-valuetext', '10:45 to 12:00 GMT, 1 h 15 min');
  });

  it('books free time by dragging, and stops at busy time', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimeSlots layout="horizontal" timeZone="GMT" busy={busy} now={now} onValueChange={onValueChange} />);
    sized();
    await user.pointer([{ keys: '[MouseLeft>]', target: track(), coords: { clientX: 180 } }, { coords: { clientX: 300 } }, { keys: '[/MouseLeft]' }]);
    expect(span(onValueChange.mock.lastCall![0])).toBe('11:00-12:30');
  });

  it('resizes from either end', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimeSlots layout="horizontal" timeZone="GMT" busy={busy} now={now} defaultValue={slot('11:00', '12:00')} onValueChange={onValueChange} />);
    sized();
    const [, end] = document.querySelectorAll('[data-edge]');
    await user.pointer([{ keys: '[MouseLeft>]', target: end, coords: { clientX: 240 } }, { coords: { clientX: 255 } }, { keys: '[/MouseLeft]' }]);
    expect(span(onValueChange.mock.lastCall![0])).toBe('11:00-12:15');
  });

  it('will not start on busy or past time', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimeSlots layout="horizontal" timeZone="GMT" busy={busy} now={now} onValueChange={onValueChange} />);
    sized();
    await user.pointer([{ keys: '[MouseLeft]', target: track(), coords: { clientX: 90 } }]);
    await user.pointer([{ keys: '[MouseLeft]', target: track(), coords: { clientX: 150 } }]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('moves on the arrows, jumping busy time it can not fit beside', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimeSlots layout="horizontal" timeZone="GMT" busy={busy} now={now} defaultValue={slot('11:00', '12:30')} onValueChange={onValueChange} />);
    track().focus();
    await user.keyboard('{ArrowRight}');
    expect(span(onValueChange.mock.lastCall![0])).toBe('13:30-15:00');
    await user.keyboard('{ArrowLeft}');
    expect(span(onValueChange.mock.lastCall![0])).toBe('11:00-12:30');
  });

  it('resizes on Shift and the arrows, up to busy time', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimeSlots layout="horizontal" timeZone="GMT" busy={busy} now={now} defaultValue={slot('11:00', '12:15')} onValueChange={onValueChange} />);
    track().focus();
    await user.keyboard('{Shift>}{ArrowRight}{ArrowRight}{/Shift}');
    expect(span(onValueChange.mock.lastCall![0])).toBe('11:00-12:30');
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it('goes to the first and last time that fits, and clears on Delete', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimeSlots layout="horizontal" timeZone="GMT" busy={busy} now={now} defaultValue={slot('13:30', '14:30')} onValueChange={onValueChange} />);
    track().focus();
    await user.keyboard('{Home}');
    expect(span(onValueChange.mock.lastCall![0])).toBe('10:45-11:45');
    await user.keyboard('{End}');
    expect(span(onValueChange.mock.lastCall![0])).toBe('19:00-20:00');
    await user.keyboard('{Delete}');
    expect(onValueChange.mock.lastCall![0]).toBeNull();
  });

  it('flips the arrows in RTL', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimeSlots layout="horizontal" dir="rtl" timeZone="GMT" defaultValue={slot('11:00', '12:00')} onValueChange={onValueChange} />);
    track().focus();
    await user.keyboard('{ArrowLeft}');
    expect(span(onValueChange.mock.lastCall![0])).toBe('11:15-12:15');
  });
});

describe('TimeSlots: rows', () => {
  const row = (name: RegExp) => screen.getByRole('button', { name });

  it('turns the day into half-hour rows, past and busy held', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimeSlots layout="vertical" timeZone="GMT" busy={busy} now={now} onValueChange={onValueChange} />);
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    expect(row(/^10:30, past/)).toHaveAttribute('aria-disabled', 'true');
    expect(row(/^12:30, busy/)).toHaveAttribute('aria-disabled', 'true');
    await user.click(row(/^12:30, busy/));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('taps a row, then stretches to a later one', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimeSlots layout="vertical" timeZone="GMT" busy={busy} now={now} onValueChange={onValueChange} />);
    await user.click(row(/^11:00/));
    expect(span(onValueChange.mock.lastCall![0])).toBe('11:00-11:30');
    await user.click(row(/^12:00/));
    expect(span(onValueChange.mock.lastCall![0])).toBe('11:00-12:30');
    expect(readout()).toHaveTextContent('11:00 to 12:30 GMT1 h 30 min');
  });

  it('starts again past busy time, and clears a lone row pressed twice', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimeSlots layout="vertical" timeZone="GMT" busy={busy} now={now} defaultValue={slot('11:00', '12:00')} onValueChange={onValueChange} />);
    await user.click(row(/^14:00/));
    expect(span(onValueChange.mock.lastCall![0])).toBe('14:00-14:30');
    await user.click(row(/^14:00/));
    expect(onValueChange.mock.lastCall![0]).toBeNull();
  });

  it('walks rows on the arrows', async () => {
    const user = userEvent.setup();
    render(<TimeSlots layout="vertical" timeZone="GMT" busy={busy} now={now} />);
    expect(row(/^11:00/)).toHaveAttribute('tabindex', '0');
    row(/^11:00/).focus();
    await user.keyboard('{ArrowDown}');
    expect(row(/^11:30/)).toHaveFocus();
  });
});

describe('TimeSlots: forms', () => {
  it('submits HH:MM/HH:MM, and fails validation when required and empty', () => {
    render(
      <form data-testid="form">
        <TimeSlots timeZone="GMT" name="slot" defaultValue={slot('10:45', '12:00')} />
        <TimeSlots timeZone="GMT" name="other" required />
      </form>
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    expect(new FormData(form).get('slot')).toBe('10:45/12:00');
    expect(form.checkValidity()).toBe(false);
  });
});

agentConformance({
  name: 'TimeSlots',
  render: ({ onChange, disabled }) => <TimeSlots layout="horizontal" aria-label="Room" timeZone="GMT" busy={busy} disabled={disabled} onValueChange={onChange} />,
  label: 'Room',
  entry: { component: 'slider', actions: ['setValue'] },
  act: { action: 'setValue', args: [['11:00', '12:00']], result: { ok: true, value: ['11:00', '12:00'] } },
  person: async (user) => {
    screen.getByRole('slider').focus();
    await user.keyboard('{ArrowRight}');
  },
});

describe('TimeSlots: agent', () => {
  it('lists one control, takes phrases, and refuses what the track refuses', async () => {
    const agent = createAgent();
    render(
      <AgentProvider agent={agent}>
        <TimeSlots layout="horizontal" timeZone="GMT" busy={busy} now={now} />
      </AgentProvider>
    );
    expect(agent.snapshot().map((c) => c.label)).toEqual(['Booking']);
    const set = (v: unknown) => agent.act({ steps: [{ ref: 'Booking', action: 'setValue', args: [v] }] });
    expect(await set('11am to 12:30')).toMatchObject({ ok: true, steps: [{ value: ['11:00', '12:30'] }] });
    expect((await set('12:00 to 13:00')).error?.message).toMatch(/12:30 to 13:30 is busy/);
    expect((await set('10:00-11:00')).error?.message).toMatch(/has passed/);
    expect((await set('11:05-12:00')).error?.message).toMatch(/steps of 15/);
    expect((await set('soon')).error?.message).toMatch(/not a span/);
  });
});
