import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgentProvider, createAgent, isAgentChange } from '../agent';
import { agentConformance } from '../test/agent-conformance';
import { Pagination, pageItems } from './pagination';

const page = (n: number) => screen.getByRole('button', { name: `Page ${n}` });
const labels = () =>
  Array.from(screen.getByRole('navigation').querySelectorAll('[data-slot^="pagination-"]'), (el) =>
    el.getAttribute('aria-current') ? `[${el.textContent}]` : el.textContent || el.getAttribute('aria-label')
  );

describe('pageItems', () => {
  it('lists every page up to seven', () => {
    expect(pageItems(1, 0)).toEqual([]);
    expect(pageItems(1, 1)).toEqual([1]);
    expect(pageItems(3, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageItems(7, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('holds seven slots once there are more than seven pages', () => {
    for (const count of [8, 9, 25, 250]) {
      for (let p = 1; p <= count; p++) expect(pageItems(p, count)).toHaveLength(7);
    }
  });

  it('keeps the first and last page, with gaps around the current one', () => {
    expect(pageItems(1, 8)).toEqual([1, 2, 3, 4, 5, 'gap', 8]);
    expect(pageItems(4, 8)).toEqual([1, 2, 3, 4, 5, 'gap', 8]);
    expect(pageItems(5, 8)).toEqual([1, 'gap', 4, 5, 6, 7, 8]);
    expect(pageItems(8, 8)).toEqual([1, 'gap', 4, 5, 6, 7, 8]);
    expect(pageItems(4, 25)).toEqual([1, 2, 3, 4, 5, 'gap', 25]);
    expect(pageItems(5, 25)).toEqual([1, 'gap', 4, 5, 6, 'gap', 25]);
    expect(pageItems(6, 25)).toEqual([1, 'gap', 5, 6, 7, 'gap', 25]);
    expect(pageItems(21, 25)).toEqual([1, 'gap', 20, 21, 22, 'gap', 25]);
    expect(pageItems(22, 25)).toEqual([1, 'gap', 21, 22, 23, 24, 25]);
    expect(pageItems(25, 25)).toEqual([1, 'gap', 21, 22, 23, 24, 25]);
  });

  it('clamps a page off either end, and odd counts', () => {
    expect(pageItems(0, 25)).toEqual(pageItems(1, 25));
    expect(pageItems(-3, 25)).toEqual(pageItems(1, 25));
    expect(pageItems(99, 25)).toEqual(pageItems(25, 25));
    expect(pageItems(Number.NaN, 25)).toEqual(pageItems(1, 25));
    expect(pageItems(6.4, 25)).toEqual(pageItems(6, 25));
    expect(pageItems(1, -2)).toEqual([]);
    expect(pageItems(1, 3.9)).toEqual([1, 2, 3]);
  });
});

describe('Pagination', () => {
  it('is a navigation landmark with the current page marked', () => {
    render(<Pagination count={25} defaultPage={6} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveAttribute('data-slot', 'pagination');
    expect(page(6)).toHaveAttribute('aria-current', 'page');
    expect(page(5)).not.toHaveAttribute('aria-current');
    expect(labels()).toEqual(['Previous page', '1', '…', '5', '[6]', '7', '…', '25', 'Next page']);
  });

  it('keeps the current page in its slot when the window shifts, and focus with it', async () => {
    const user = userEvent.setup();
    render(<Pagination count={25} defaultPage={15} />);
    const current = page(15);
    await user.click(page(16));
    expect(page(16)).toBe(current);
    expect(page(16)).toHaveAttribute('aria-current', 'page');
    expect(page(16)).toHaveFocus();
  });

  it('goes to a page, and steps with prev and next', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination count={25} defaultPage={6} onPageChange={onPageChange} />);
    await user.click(page(7));
    expect(onPageChange).toHaveBeenLastCalledWith(7, expect.objectContaining({ reason: 'page-press' }));
    expect(page(7)).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(page(8)).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(7, expect.objectContaining({ reason: 'previous' }));
  });

  it('disables the arrows at the ends rather than hiding them', () => {
    const { rerender } = render(<Pagination count={5} page={1} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
    rerender(<Pagination count={5} page={5} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('respects a controlled page and a cancelled change', async () => {
    const user = userEvent.setup();
    render(<Pagination count={25} page={6} onPageChange={(_, d) => d.cancel()} />);
    await user.click(page(7));
    expect(page(6)).toHaveAttribute('aria-current', 'page');
  });

  it('gives every page slot the same width, so the bar never jumps', () => {
    render(<Pagination count={250} defaultPage={120} />);
    const nav = screen.getByRole('navigation');
    const slots = Array.from(nav.querySelectorAll<HTMLElement>('[data-slot="pagination-page"], [data-slot="pagination-gap"]'));
    expect(slots).toHaveLength(7);
    for (const el of slots) {
      expect(el.style.getPropertyValue('--pagination-digits')).toBe('3');
      expect(el.className).toContain('min-w-[max(2rem,calc(var(--pagination-digits)*1ch+0.75rem))]');
    }
  });

  it('opens a gap into a field: Enter goes, clamped to the last page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination count={25} defaultPage={6} onPageChange={onPageChange} />);
    await user.click(screen.getAllByRole('button', { name: 'Jump to a page' })[1]);
    const field = screen.getByRole('textbox', { name: 'Page 1 to 25' });
    expect(field).toHaveFocus();
    expect(field).toHaveAttribute('placeholder', '6');
    await user.type(field, '99{Enter}');
    expect(onPageChange).toHaveBeenLastCalledWith(25, expect.objectContaining({ reason: 'jump' }));
    expect(page(25)).toHaveAttribute('aria-current', 'page');
    expect(page(25)).toHaveFocus();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('reverts on Escape, and commits on blur', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination count={25} defaultPage={6} onPageChange={onPageChange} />);
    await user.click(screen.getAllByRole('button', { name: 'Jump to a page' })[0]);
    await user.type(screen.getByRole('textbox'), '2{Escape}');
    expect(onPageChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: 'Jump to a page' })[0]);
    await user.type(screen.getByRole('textbox'), '2');
    await user.tab();
    expect(onPageChange).toHaveBeenLastCalledWith(2, expect.anything());
  });

  it('ignores a jump that is not a number', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination count={25} defaultPage={6} onPageChange={onPageChange} />);
    await user.click(screen.getAllByRole('button', { name: 'Jump to a page' })[0]);
    await user.type(screen.getByRole('textbox'), 'abc{Enter}');
    expect(onPageChange).not.toHaveBeenCalled();
    expect(screen.getAllByRole('button', { name: 'Jump to a page' })).toHaveLength(2);
  });

  it('reads Page 6 of 25 when compact, with the number as the jump field', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination variant="compact" count={25} defaultPage={6} onPageChange={onPageChange} />);
    const current = screen.getByRole('button', { name: 'Page 6 of 25, go to page' });
    expect(current).toHaveTextContent('Page 6 of 25');
    expect(screen.queryByRole('button', { name: 'Page 7' })).not.toBeInTheDocument();
    await user.click(current);
    const field = screen.getByRole('textbox', { name: 'Go to page' });
    expect(field).toHaveFocus();
    await user.type(field, '0{Enter}');
    expect(onPageChange).toHaveBeenLastCalledWith(1, expect.objectContaining({ reason: 'jump' }));
    expect(screen.getByRole('button', { name: 'Page 1 of 25, go to page' })).toHaveFocus();
  });

  it('renders pages as links with getHref', () => {
    render(<Pagination count={25} defaultPage={6} getHref={(p) => `/orders?page=${p}`} />);
    const link = screen.getByRole('link', { name: 'Page 7' });
    expect(link).toHaveAttribute('href', '/orders?page=7');
    expect(screen.getByRole('link', { name: 'Page 6' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute('href', '/orders?page=7');
    expect(screen.getAllByRole('button', { name: 'Jump to a page' })).toHaveLength(2);
  });

  it('keeps a refused link click where it is', () => {
    render(<Pagination count={25} defaultPage={6} getHref={(p) => `/p/${p}`} onPageChange={(_, d) => d.cancel()} />);
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    screen.getByRole('link', { name: 'Page 7' }).dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
  });

  it('leaves the page alone when a link opens in a new tab', () => {
    const onPageChange = vi.fn();
    render(<Pagination count={25} defaultPage={6} getHref={(p) => `/p/${p}`} onPageChange={onPageChange} />);
    for (const mod of [{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }]) {
      const click = new MouseEvent('click', { bubbles: true, cancelable: true, ...mod });
      screen.getByRole('link', { name: 'Page 7' }).dispatchEvent(click);
      expect(click.defaultPrevented).toBe(false);
    }
    expect(onPageChange).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: 'Page 6' })).toHaveAttribute('aria-current', 'page');
  });

  it('loads the page URL after a jump with getHref, unless the app refuses', async () => {
    const user = userEvent.setup();
    const assign = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign });
    try {
      const { unmount } = render(<Pagination count={25} defaultPage={6} getHref={(p) => `/p/${p}`} />);
      await user.click(screen.getAllByRole('button', { name: 'Jump to a page' })[1]);
      await user.type(screen.getByRole('textbox'), '12{Enter}');
      expect(assign).toHaveBeenCalledWith('/p/12');
      unmount();

      assign.mockClear();
      render(<Pagination count={25} defaultPage={6} getHref={(p) => `/p/${p}`} onPageChange={(_, d) => d.cancel()} />);
      await user.click(screen.getAllByRole('button', { name: 'Jump to a page' })[1]);
      await user.type(screen.getByRole('textbox'), '12{Enter}');
      expect(assign).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('returns focus to the gap on Escape', async () => {
    const user = userEvent.setup();
    render(<Pagination count={25} defaultPage={6} />);
    await user.click(screen.getAllByRole('button', { name: 'Jump to a page' })[1]);
    await user.keyboard('{Escape}');
    expect(screen.getAllByRole('button', { name: 'Jump to a page' })[1]).toHaveFocus();
  });

  it('keeps focus in the bar when an arrow reaches the end and disables', async () => {
    const user = userEvent.setup();
    render(<Pagination count={25} defaultPage={24} />);
    screen.getByRole('button', { name: 'Next page' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(page(25)).toHaveFocus();
  });

  it('closes a jump field when the page moves under it', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Pagination count={25} page={6} />);
    await user.click(screen.getAllByRole('button', { name: 'Jump to a page' })[1]);
    rerender(<Pagination count={25} page={24} />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    rerender(<Pagination count={25} page={6} />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('treats a count that is not finite as one page', () => {
    render(<Pagination count={Number.POSITIVE_INFINITY} />);
    expect(labels()).toEqual(['Previous page', '[1]', 'Next page']);
  });

  it('shows page 1 of 1 when there are no pages', () => {
    render(<Pagination count={0} />);
    expect(page(1)).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('makes 44px targets at size lg', () => {
    render(<Pagination variant="compact" size="lg" count={25} defaultPage={6} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveClass('h-11', 'w-11');
    expect(screen.getByRole('button', { name: 'Page 6 of 25, go to page' })).toHaveClass('h-11', 'leading-[2.75rem]');
  });

  it('disables everything', () => {
    render(<Pagination count={25} defaultPage={6} disabled />);
    for (const b of screen.getAllByRole('button')) expect(b).toBeDisabled();
  });
});

agentConformance({
  name: 'Pagination',
  render: ({ onChange, disabled }) => <Pagination aria-label="Orders" count={25} defaultPage={6} disabled={disabled} onPageChange={onChange} />,
  label: 'Orders',
  entry: { component: 'number', value: 6, min: 1, max: 25, actions: ['setValue', 'increment', 'decrement'] },
  act: { action: 'setValue', args: [12], result: { ok: true, value: 12 } },
  person: async (user) => {
    await user.click(screen.getByRole('button', { name: 'Page 7' }));
  },
});

describe('Pagination: agent', () => {
  function mount() {
    const agent = createAgent();
    const onPageChange = vi.fn();
    render(
      <AgentProvider agent={agent}>
        <Pagination aria-label="Orders" count={25} defaultPage={6} onPageChange={onPageChange} />
      </AgentProvider>
    );
    return { agent, onPageChange };
  }

  it('lists one control, not each button', () => {
    const { agent } = mount();
    expect(agent.snapshot().map((c) => c.label)).toEqual(['Orders']);
  });

  it('steps with increment and decrement, and takes a page as text', async () => {
    const { agent, onPageChange } = mount();
    expect(await agent.act({ steps: [{ ref: 'Orders', action: 'increment' }] })).toMatchObject({ ok: true, steps: [{ value: 7 }] });
    expect(await agent.act({ steps: [{ ref: 'Orders', action: 'decrement', args: [3] }] })).toMatchObject({ ok: true, steps: [{ value: 4 }] });
    expect(await agent.act({ steps: [{ ref: 'Orders', action: 'setValue', args: ['20'] }] })).toMatchObject({ ok: true, steps: [{ value: 20 }] });
    expect(onPageChange.mock.calls.every(([, d]) => isAgentChange(d))).toBe(true);
  });

  it('refuses pages out of range, and what is not a page', async () => {
    const { agent } = mount();
    const off = await agent.act({ steps: [{ ref: 'Orders', action: 'setValue', args: [26] }] });
    expect(off.ok).toBe(false);
    expect(off.error?.message).toMatch(/1 to 25/);
    const zero = await agent.act({ steps: [{ ref: 'Orders', action: 'decrement', args: [6] }] });
    expect(zero.error?.message).toMatch(/out of range/);
    const text = await agent.act({ steps: [{ ref: 'Orders', action: 'setValue', args: ['next'] }] });
    expect(text.error?.message).toMatch(/not a page number/);
    const half = await agent.act({ steps: [{ ref: 'Orders', action: 'increment', args: [1.5] }] });
    expect(half.error?.message).toMatch(/not a whole number of pages/);
    expect(agent.snapshot()[0].value).toBe(6);
  });

  it('loads the page URL when the pages are links', async () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign });
    try {
      const agent = createAgent();
      render(
        <AgentProvider agent={agent}>
          <Pagination aria-label="Orders" count={25} page={6} getHref={(p) => `/orders?page=${p}`} />
        </AgentProvider>
      );
      expect(await agent.act({ steps: [{ ref: 'Orders', action: 'setValue', args: [12] }] })).toMatchObject({ ok: true });
      expect(assign).toHaveBeenCalledWith('/orders?page=12');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
