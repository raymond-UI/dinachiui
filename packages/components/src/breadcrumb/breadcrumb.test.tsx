import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgentProvider, createAgent, isAgentChange } from '../agent';
import { agentConformance } from '../test/agent-conformance';
import { Breadcrumb, breadcrumbFit, type BreadcrumbItem } from './breadcrumb';

const room: BreadcrumbItem[] = [
  { label: 'Hotels', href: '#hotels' },
  { label: 'Properties', href: '#properties' },
  { label: 'Harbour House', href: '#harbour' },
  { label: 'Second floor', href: '#floor' },
  { label: 'Rooms', href: '#rooms' },
  { label: '214 Sea View Double' },
];

const shownLabels = () =>
  Array.from(screen.getByRole('list').querySelectorAll('[data-slot="breadcrumb-item"], [data-slot="breadcrumb-ellipsis"]'), (li) =>
    li.getAttribute('data-slot') === 'breadcrumb-ellipsis' ? '…' : li.textContent
  );

// Lays the trail out in jsdom: every level is 10px a character, the nav is `navWidth` wide.
let navWidth = 1000;
function layout() {
  const original = Element.prototype.getBoundingClientRect;
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const el = this as HTMLElement;
    const rect = (width: number) => ({ ...original.call(el), width }) as DOMRect;
    if (el.dataset.slot === 'breadcrumb') return rect(navWidth);
    if (el.hasAttribute('data-measure-separator')) return rect(14);
    if (el.hasAttribute('data-measure-ellipsis')) return rect(24);
    if (el.hasAttribute('data-measure-item')) return rect((el.textContent ?? '').length * 10);
    return rect(0);
  });
}

describe('breadcrumbFit', () => {
  const base = { separator: 10, ellipsis: 20, minKeep: 2 };
  it('keeps every level when they fit', () => {
    expect(breadcrumbFit({ ...base, widths: [50, 50, 50], available: 170 })).toBe(3);
  });

  it('folds middle levels one at a time, only as far as needed', () => {
    const widths = [50, 50, 50, 50, 50];
    // Full: 250 + 4 * 10 = 290. Keep 3: 50 + 20 + 150 + 4 * 10 = 260.
    expect(breadcrumbFit({ ...base, widths, available: 289 })).toBe(3);
    expect(breadcrumbFit({ ...base, widths, available: 260 })).toBe(3);
    expect(breadcrumbFit({ ...base, widths, available: 259 })).toBe(2);
  });

  it('stops at minKeep, leaving the last level to truncate', () => {
    expect(breadcrumbFit({ ...base, widths: [50, 50, 50, 50, 50], available: 10 })).toBe(2);
    expect(breadcrumbFit({ ...base, minKeep: 1, widths: [50, 50, 50, 50, 50], available: 10 })).toBe(1);
  });

  it('counts the gap between parts', () => {
    expect(breadcrumbFit({ ...base, widths: [50, 50, 50, 50], available: 230 })).toBe(4);
    expect(breadcrumbFit({ ...base, widths: [50, 50, 50, 50], gap: 2, available: 230 })).toBe(2);
  });

  it('never collapses a trail too short to', () => {
    expect(breadcrumbFit({ ...base, widths: [50, 50], available: 10 })).toBe(2);
    expect(breadcrumbFit({ ...base, widths: [50, 50, 50], available: 10 })).toBe(3);
  });
});

describe('Breadcrumb', () => {
  beforeEach(() => {
    navWidth = 1000;
  });
  afterEach(() => vi.restoreAllMocks());

  it('is a navigation landmark with an ordered list, and the current page is not a link', () => {
    render(<Breadcrumb items={room} presentation="trail" />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toHaveAttribute('data-slot', 'breadcrumb');
    expect(nav.querySelector('ol')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Rooms' })).toHaveAttribute('href', '#rooms');
    const current = document.querySelector('[data-slot="breadcrumb-page"]')!;
    expect(current).toHaveTextContent('214 Sea View Double');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.closest('a')).toBeNull();
    expect(shownLabels()).toEqual(room.map((r) => r.label));
  });

  it('hides separators from assistive tech', () => {
    render(<Breadcrumb items={room} presentation="trail" />);
    const separators = document.querySelectorAll('[data-slot="breadcrumb-separator"]');
    expect(separators).toHaveLength(room.length - 1);
    separators.forEach((s) => expect(s).toHaveAttribute('aria-hidden', 'true'));
  });

  it('can leave the current page to the heading', () => {
    render(<Breadcrumb items={room} presentation="trail" hideCurrent />);
    expect(screen.queryByText('214 Sea View Double')).not.toBeInTheDocument();
    expect(shownLabels()).toEqual(room.slice(0, -1).map((r) => r.label));
  });

  it('folds the middle levels into a menu as the container narrows, keeping the root and parent', async () => {
    layout();
    // The full trail is 740px; keeping two levels after the root is 378px.
    navWidth = 400;
    render(<Breadcrumb items={room} presentation="trail" />);
    expect(shownLabels()).toEqual(['Hotels', '…', 'Rooms', '214 Sea View Double']);
    const more = screen.getByRole('button', { name: 'Show 3 more levels' });
    await userEvent.setup().click(more);
    const menu = await screen.findByRole('menu');
    expect(within(menu).getAllByRole('menuitem').map((m) => m.textContent)).toEqual(['Properties', 'Harbour House', 'Second floor']);
    expect(within(menu).getByRole('menuitem', { name: 'Harbour House' })).toHaveAttribute('href', '#harbour');
  });

  it('folds only as far as needed', () => {
    layout();
    navWidth = 600;
    render(<Breadcrumb items={room} presentation="trail" />);
    expect(shownLabels()).toEqual(['Hotels', '…', 'Second floor', 'Rooms', '214 Sea View Double']);
    expect(screen.getByRole('button', { name: 'Show 2 more levels' })).toBeInTheDocument();
  });

  it('lets the last level truncate with its full name in a tooltip', () => {
    render(<Breadcrumb items={room} presentation="trail" />);
    const current = document.querySelector('[data-slot="breadcrumb-page"]')!;
    expect(current).toHaveTextContent('214 Sea View Double');
    expect(current).toHaveAttribute('title', '214 Sea View Double');
    expect(current).toHaveClass('truncate');
    expect(current.closest('li')).toHaveClass('min-w-12');
  });

  it('runs onNavigate on a press, and a cancel keeps the browser where it is', async () => {
    const onNavigate = vi.fn((_: BreadcrumbItem, details: { cancel(): void }) => details.cancel());
    render(<Breadcrumb items={room} presentation="trail" onNavigate={onNavigate} />);
    const rooms = screen.getByRole('link', { name: 'Rooms' });
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    act(() => {
      rooms.dispatchEvent(event);
    });
    expect(onNavigate).toHaveBeenCalledWith(room[4], expect.objectContaining({ reason: 'link-press' }));
    expect(event.defaultPrevented).toBe(true);
  });

  it('renders a router link through an item\'s render', () => {
    const items = [{ label: 'Home', href: '/', render: <a data-router="" /> }, { label: 'Here' }];
    render(<Breadcrumb items={items} presentation="trail" />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('data-router');
  });

  it('blocks people when disabled', async () => {
    const onNavigate = vi.fn();
    render(<Breadcrumb items={room} presentation="trail" onNavigate={onNavigate} disabled />);
    const rooms = screen.getByRole('link', { name: 'Rooms' });
    expect(rooms).toHaveAttribute('aria-disabled', 'true');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    act(() => {
      rooms.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(onNavigate).not.toHaveBeenCalled();
  });
});

describe('Breadcrumb: back', () => {
  afterEach(() => vi.useRealTimers());

  it('is one link to the parent, and a button for the whole trail', () => {
    render(<Breadcrumb items={room} presentation="back" />);
    const back = screen.getByRole('link', { name: 'Back to Rooms' });
    expect(back).toHaveAttribute('href', '#rooms');
    expect(back).toHaveAttribute('data-slot', 'breadcrumb-back');
    expect(screen.getByRole('button', { name: 'Show full path' })).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('opens the trail as a sheet, root first and the current page last', async () => {
    const user = userEvent.setup();
    render(<Breadcrumb items={room} presentation="back" />);
    await user.click(screen.getByRole('button', { name: 'Show full path' }));
    const sheet = await screen.findByRole('dialog');
    const nav = within(sheet).getByRole('navigation', { name: 'Breadcrumb' });
    const rows = within(nav).getAllByRole('listitem').map((li) => li.textContent);
    expect(rows).toEqual(room.map((r) => r.label));
    expect(within(nav).getByText('214 Sea View Double')).toHaveAttribute('aria-current', 'page');
  });

  it('closes the sheet when a level is chosen', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn((_item: BreadcrumbItem, details: { cancel: () => void }) => details.cancel());
    render(<Breadcrumb items={room} presentation="back" onNavigate={onNavigate} />);
    await user.click(screen.getByRole('button', { name: 'Show full path' }));
    const sheet = await screen.findByRole('dialog');
    await user.click(within(sheet).getByRole('link', { name: 'Harbour House' }));
    expect(onNavigate).toHaveBeenCalledWith(room[2], expect.objectContaining({ reason: 'sheet-press' }));
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('opens the sheet on a long-press without going back', async () => {
    vi.useFakeTimers();
    const onNavigate = vi.fn();
    render(<Breadcrumb items={room} presentation="back" onNavigate={onNavigate} />);
    const back = screen.getByRole('link', { name: 'Back to Rooms' });
    act(() => {
      back.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
      vi.advanceTimersByTime(500);
    });
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    act(() => {
      back.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      back.dispatchEvent(click);
    });
    expect(click.defaultPrevented).toBe(true);
    expect(onNavigate).not.toHaveBeenCalled();
    vi.useRealTimers();
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('goes back on a tap', async () => {
    const onNavigate = vi.fn((_: BreadcrumbItem, d: { cancel(): void }) => d.cancel());
    render(<Breadcrumb items={room} presentation="back" onNavigate={onNavigate} />);
    await userEvent.setup().click(screen.getByRole('link', { name: 'Back to Rooms' }));
    expect(onNavigate).toHaveBeenCalledWith(room[4], expect.objectContaining({ reason: 'back-press' }));
  });

  it('draws floating pills for use over a photo', () => {
    render(<Breadcrumb items={room} presentation="back" floating />);
    expect(screen.getByRole('navigation')).toHaveAttribute('data-floating');
    expect(screen.getByRole('link', { name: 'Back to Rooms' })).toHaveClass('rounded-full');
  });

  it('renders nothing for a page with no parent', () => {
    const { container } = render(<Breadcrumb items={[{ label: 'Home' }]} presentation="back" />);
    expect(container).toBeEmptyDOMElement();
  });
});

agentConformance({
  name: 'Breadcrumb',
  render: ({ onChange, disabled }) => (
    <Breadcrumb aria-label="Room path" items={room} presentation="trail" disabled={disabled} onNavigate={onChange} />
  ),
  label: 'Room path',
  entry: { component: 'list', value: '214 Sea View Double', items: room.map((r) => r.label), actions: ['goTo'] },
  act: { action: 'goTo', args: ['Rooms'], result: { ok: true } },
  invalid: { action: 'goTo', args: ['Lobby'], lists: ['Hotels', 'Rooms'] },
  person: async (user) => {
    await user.click(screen.getByRole('link', { name: 'Rooms' }));
  },
});

describe('Breadcrumb: agent', () => {
  // The menu and sheet open between an agent's steps, outside any act().
  const env = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
  beforeEach(() => {
    env.IS_REACT_ACT_ENVIRONMENT = false;
  });
  afterEach(() => {
    env.IS_REACT_ACT_ENVIRONMENT = true;
    vi.restoreAllMocks();
  });

  function mount(props: Partial<React.ComponentProps<typeof Breadcrumb>> = {}) {
    const agent = createAgent();
    const onNavigate = vi.fn();
    render(
      <AgentProvider agent={agent}>
        <Breadcrumb items={room} presentation="trail" onNavigate={onNavigate} {...props} />
      </AgentProvider>
    );
    return { agent, onNavigate };
  }

  it('is one control: its links are not listed again', () => {
    const { agent } = mount();
    const snapshot = agent.snapshot();
    expect(snapshot.filter((c) => c.component === 'link')).toEqual([]);
    expect(snapshot.find((c) => c.label === 'Breadcrumb')).toBeDefined();
  });

  it('goes to a collapsed level through the menu', async () => {
    navWidth = 400;
    layout();
    const { agent, onNavigate } = mount();
    expect(screen.queryByRole('link', { name: 'Harbour House' })).not.toBeInTheDocument();
    const result = await (agent.act({ steps: [{ ref: 'Breadcrumb', action: 'goTo', args: ['Harbour House'] }] }));
    expect(result.ok).toBe(true);
    expect(onNavigate).toHaveBeenCalledWith(room[2], expect.anything());
    expect(isAgentChange(onNavigate.mock.calls[0][1])).toBe(true);
  });

  it('goes to a level by position from 1', async () => {
    const { agent, onNavigate } = mount();
    await agent.act({ steps: [{ ref: 'Breadcrumb', action: 'goTo', args: [2] }] });
    expect(onNavigate).toHaveBeenCalledWith(room[1], expect.anything());
  });

  it('goes to a level from the phone sheet', async () => {
    const { agent, onNavigate } = mount({ presentation: 'back' });
    const result = await (agent.act({ steps: [{ ref: 'Breadcrumb', action: 'goTo', args: ['Properties'] }] }));
    expect(result.ok).toBe(true);
    expect(onNavigate).toHaveBeenCalledWith(room[1], expect.anything());
    expect(isAgentChange(onNavigate.mock.calls[0][1])).toBe(true);
  });

  it('does nothing for the current page', async () => {
    const { agent, onNavigate } = mount();
    const result = await agent.act({ steps: [{ ref: 'Breadcrumb', action: 'goTo', args: ['214 Sea View Double'] }] });
    expect(result.ok).toBe(true);
    expect(onNavigate).not.toHaveBeenCalled();
  });
});
